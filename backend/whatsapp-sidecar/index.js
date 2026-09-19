/**
 * Anekarasa Resto — WhatsApp sidecar (Baileys)
 *
 * Lightweight Express service replacing the previous whatsapp-web.js sidecar.
 * No Chromium/Puppeteer: Baileys talks to WhatsApp over a plain WebSocket,
 * which keeps RAM/CPU low enough for a small Railway service.
 *
 * Responsibilities (all the app needs):
 *   - Manage one or more WhatsApp sessions with QR pairing.
 *   - Persist credentials to disk: scan once, stay connected until the
 *     superadmin explicitly deletes the session. Credentials are NEVER
 *     deleted automatically (even when WhatsApp logs the device out).
 *   - Send plain text messages (used by Laravel to deliver OTP codes).
 *
 * Security:
 *   Every endpoint except GET /health requires `Authorization: Bearer
 *   <access_token>` where the token is a JWT issued by Laravel (HS256,
 *   shared JWT_SECRET) whose payload carries `role: "superadmin"`.
 *   Tokens without a usable role claim are verified by introspecting
 *   `GET {LARAVEL_URL}/api/user` (fallback, cached briefly).
 *
 * The Vue frontend never talks to this service directly: Laravel proxies
 * the superadmin's access_token here for session management, and uses a
 * self-issued superadmin (service) token for OTP sends.
 */

const express = require('express');
const qrcode = require('qrcode');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const baileys = require('@whiskeysockets/baileys');
const makeWASocket = baileys.default ?? baileys.makeWASocket;
const { useMultiFileAuthState, DisconnectReason, Browsers } = baileys;

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '127.0.0.1';
const JWT_SECRET = process.env.JWT_SECRET || '';
const LARAVEL_URL = (process.env.LARAVEL_URL || '').replace(/\/+$/, '');
const ROLE_CACHE_TTL = parseInt(process.env.ROLE_CACHE_TTL || '60', 10);
const SESSION_DIR = process.env.SESSION_DIR || path.join(__dirname, 'sessions');
const AUTO_START_SESSIONS = !['0', 'false', 'no', 'off'].includes(
  String(process.env.AUTO_START_SESSIONS ?? 'true').toLowerCase(),
);
const DEFAULT_COUNTRY_CODE = process.env.DEFAULT_COUNTRY_CODE || '62';

const LOG = '[wa-sidecar]';

if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true });

// Keep the HTTP server alive even when a Baileys socket throws internally —
// one bad session must not take every session down with it.
process.on('uncaughtException', (e) => {
  console.error(`${LOG} uncaughtException: ${e && e.stack ? e.stack : e}`);
});
process.on('unhandledRejection', (e) => {
  console.error(`${LOG} unhandledRejection: ${e && e.stack ? e.stack : e}`);
});

/**
 * sessionId → {
 *   sock, status: 'initializing'|'qr'|'ready'|'disconnected'|'error',
 *   qrDataUri, error, reconnectAttempts, reconnectTimer
 * }
 */
const sessions = new Map();

/** sha256(token) → { until: epochSeconds } for positive introspection results. */
const roleCache = new Map();

/* ------------------------------------------------------------------ */
/* Auth: Laravel-issued access_token with role superadmin              */
/* ------------------------------------------------------------------ */

async function assertSuperadmin(req, res) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token) {
    res.status(401).json({ error: 'missing bearer access_token' });
    return false;
  }

  // Fast path: verify the JWT signature locally and trust the signed `role`
  // claim (Laravel embeds role via User::getJWTCustomClaims()).
  if (JWT_SECRET) {
    try {
      const payload = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
      if (payload.role === 'superadmin') {
        req.auth = { via: 'jwt', sub: payload.sub };
        return true;
      }
      if (!LARAVEL_URL) {
        res.status(403).json({ error: 'forbidden: role bukan superadmin' });
        return false;
      }
    } catch (e) {
      res.status(401).json({ error: `invalid access_token: ${e.message}` });
      return false;
    }
  }

  // Fallback: JWT_SECRET unset or the token carries no role claim — ask
  // Laravel who this token belongs to and require role === "superadmin".
  return await introspectToken(token, res);
}

async function introspectToken(token, res) {
  if (!LARAVEL_URL) {
    res.status(500).json({ error: 'server misconfigured: JWT_SECRET dan LARAVEL_URL tidak ada untuk validasi token' });
    return false;
  }

  const cacheKey = crypto.createHash('sha256').update(token).digest('hex');
  const cached = roleCache.get(cacheKey);
  if (cached && cached.until > Date.now() / 1000) {
    req.auth = { via: 'introspection' };
    return true;
  }

  const user = await fetchJson(`${LARAVEL_URL}/api/user`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    timeoutMs: 8000,
  }).catch(() => null);

  if (!user) {
    res.status(401).json({ error: 'access_token tidak dapat divalidasi oleh Laravel' });
    return false;
  }

  if (user?.role !== 'superadmin') {
    res.status(403).json({ error: 'forbidden: role bukan superadmin' });
    return false;
  }

  roleCache.set(cacheKey, { until: Date.now() / 1000 + ROLE_CACHE_TTL });
  req.auth = { via: 'introspection', sub: user.id };
  return true;
}

async function fetchJson(url, { headers, timeoutMs = 8000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { headers, signal: controller.signal });
    if (!response.ok) return null;
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------------ */
/* Baileys session management                                          */
/* ------------------------------------------------------------------ */

function sanitizeSessionId(id) {
  if (!id || typeof id !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(id)) return null;
  return id;
}

function authDirFor(sessionId) {
  return path.join(SESSION_DIR, sessionId);
}

function setStatus(session, status, error = null) {
  session.status = status;
  session.error = error;
}

async function startSocket(sessionId, session) {
  const { state, saveCreds } = await useMultiFileAuthState(authDirFor(sessionId));

  const sock = makeWASocket({
    auth: state,
    browser: Browsers.ubuntu('Chrome'),
    printQRInTerminal: false,
    keepAliveIntervalMs: 30_000,
    markOnlineOnConnect: false,
    syncFullHistory: false,
    generateHighQualityLinkPreview: false,
  });
  session.sock = sock;

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    try {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        session.qrDataUri = await qrcode.toDataURL(qr);
        setStatus(session, 'qr');
        console.log(`${LOG} [${sessionId}] QR generated (refresh every ~57s while pairing)`);
      }

      if (connection === 'connecting') {
        // Baileys re-emits 'connecting' on internal reconnects; don't clobber
        // an existing 'qr' status — the QR stays valid for the superadmin page.
        if (session.status !== 'qr') setStatus(session, 'initializing');
      }

      if (connection === 'open') {
        clearTimeout(session.reconnectTimer);
        session.reconnectAttempts = 0;
        session.qrDataUri = null;
        session.readyAt = Date.now();
        setStatus(session, 'ready');
        console.log(`${LOG} [${sessionId}] connected`);
      }

      if (connection === 'close') {
        handleConnectionClose(sessionId, session, lastDisconnect);
      }
    } catch (e) {
      console.error(`${LOG} [${sessionId}] connection.update handler failed: ${e.message}`);
    }
  });

  return sock;
}

/**
 * Sekali scan, selamanya: kredensial TIDAK PERNAH dihapus otomatis.
 * - loggedOut (device di-unlink dari HP / di-re-register): tandai disconnected
 *   dengan pesan jelas — superadmin yang memutuskan hapus + scan ulang.
 * - Semua sebab lain: auto-reconnect dengan backoff memakai kredensial
 *   yang sama, tanpa QR ulang.
 */
function handleConnectionClose(sessionId, session, lastDisconnect) {
  const statusCode = lastDisconnect?.error?.output?.statusCode;
  const message = lastDisconnect?.error?.message || String(lastDisconnect?.error ?? 'unknown');
  console.log(`${LOG} [${sessionId}] closed (code=${statusCode ?? '?'}): ${message}`);
  session.sock = null;

  if (statusCode === DisconnectReason.loggedOut) {
    setStatus(
      session,
      'disconnected',
      'Sesi ditutup oleh WhatsApp (logged out / device di-unlink). Hapus sesi lalu scan QR baru.',
    );
    return;
  }

  setStatus(session, 'disconnected', message);
  scheduleReconnect(sessionId, session);
}

function scheduleReconnect(sessionId, session) {
  if (session.reconnectTimer) return;
  const attempt = session.reconnectAttempts || 0;
  const delay = Math.min(3000 * Math.pow(2, attempt), 60_000);
  session.reconnectAttempts = attempt + 1;
  session.reconnectTimer = setTimeout(() => {
    session.reconnectTimer = null;
    restartSocket(sessionId, session).catch((e) => {
      console.error(`${LOG} [${sessionId}] reconnect failed: ${e.message}`);
      scheduleReconnect(sessionId, session);
    });
  }, delay);
}

async function restartSocket(sessionId, session) {
  console.log(`${LOG} [${sessionId}] reconnecting (attempt ${session.reconnectAttempts})...`);
  setStatus(session, 'initializing', null);
  await startSocket(sessionId, session);
}

async function bootSession(sessionId) {
  const existing = sessions.get(sessionId);
  if (existing) return existing;

  const session = {
    sock: null,
    status: 'initializing',
    qrDataUri: null,
    error: null,
    reconnectAttempts: 0,
    reconnectTimer: null,
  };
  sessions.set(sessionId, session);

  try {
    await startSocket(sessionId, session);
  } catch (e) {
    setStatus(session, 'error', e.message || String(e));
    console.error(`${LOG} [${sessionId}] boot failed: ${e && e.stack ? e.stack : e}`);
  }

  return session;
}

async function destroySession(sessionId) {
  const session = sessions.get(sessionId);
  if (session) {
    clearTimeout(session.reconnectTimer);
    session.reconnectTimer = null;
    if (session.sock) {
      try {
        // logout() revokes this linked device on WhatsApp servers; harmless
        // if the socket is already dead.
        await session.sock.logout();
      } catch (_) {
        try { session.sock.end(undefined); } catch (_) {}
      }
      session.sock = null;
    }
    sessions.delete(sessionId);
  }
  // Only the superadmin reaches this endpoint — wiping persisted auth is
  // exactly what "Hapus sesi & scan ulang" means.
  fs.rmSync(authDirFor(sessionId), { recursive: true, force: true });
  console.log(`${LOG} [${sessionId}] session deleted by superadmin`);
}

function discoverPersistedSessions() {
  if (!fs.existsSync(SESSION_DIR)) return [];
  return fs
    .readdirSync(SESSION_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(SESSION_DIR, d.name, 'creds.json')))
    .map((d) => d.name);
}

/**
 * Normalisasi nomor tujuan → JID user WhatsApp.
 *   0812… / 812… → 62812… (DEFAULT_COUNTRY_CODE)
 *   62812… / 9665… → dipakai apa adanya
 */
function toJid(input) {
  let digits = String(input || '').replace(/\D+/g, '');
  if (!digits) return null;
  if (digits.startsWith('0')) digits = DEFAULT_COUNTRY_CODE + digits.slice(1);
  else if (!digits.startsWith(DEFAULT_COUNTRY_CODE) && digits.length <= 13) {
    digits = DEFAULT_COUNTRY_CODE + digits;
  }
  return `${digits}@s.whatsapp.net`;
}

async function withTimeoutOrThrow(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

function requireReady(session) {
  if (!session) throw Object.assign(new Error('session not found'), { http: 404 });
  if (session.status !== 'ready' || !session.sock) {
    throw Object.assign(
      new Error(`session not ready (status: ${session.status})${session.error ? `: ${session.error}` : ''}`),
      { http: 409 },
    );
  }
}

/**
 * Tunggu sampai kunci enkripsi selesai sync ke HP penerima.
 *
 * Pesan pertama yang dikirim langsung setelah session `open` (fresh scan /
 * reconnect) bisa muncul sebagai "menunggu pesan ini" di HP penerima karena
 * WhatsApp belum selesai mendistribusikan sender key ke perangkat baru.
 * Delay singkat setelah `open` menyelesaikannya; kirim-kirim berikutnya
 * tidak terdampak (readyAt sudah lewat).
 */
const SEND_SETTLE_DELAY_MS = parseInt(process.env.SEND_SETTLE_DELAY_MS || '8000', 10);

async function waitForKeysToSettle(session) {
  if (!session.readyAt) return;
  const elapsed = Date.now() - session.readyAt;
  if (elapsed >= SEND_SETTLE_DELAY_MS) return;
  const waitMs = SEND_SETTLE_DELAY_MS - elapsed;
  console.log(`${LOG} waiting ${waitMs}ms for key sync after connection open`);
  await new Promise((resolve) => setTimeout(resolve, waitMs));
}

function serializeSendResult(result, jid, body) {
  return {
    id: result?.key?.id ?? null,
    to: jid,
    body: body ?? '',
    timestamp: result?.messageTimestamp ?? null,
  };
}

/* ------------------------------------------------------------------ */
/* HTTP API                                                            */
/* ------------------------------------------------------------------ */

const app = express();
app.use(express.json({ limit: '1mb' }));

// Railway healthcheck — intentionally unauthenticated.
app.get('/health', (_, res) => {
  res.json({ ok: true, sessions: sessions.size, uptime: process.uptime() });
});

app.use(async (req, res, next) => {
  const allowed = await assertSuperadmin(req, res);
  if (allowed) next();
});

app.get('/sessions', (_, res) => {
  const listed = new Set();
  const out = [];
  for (const [id, s] of sessions.entries()) {
    listed.add(id);
    out.push({ id, status: s.status });
  }
  for (const id of discoverPersistedSessions()) {
    if (!listed.has(id)) out.push({ id, status: 'disconnected' });
  }
  res.json(out);
});

app.post('/sessions/:id/start', async (req, res, next) => {
  const id = sanitizeSessionId(req.params.id);
  if (!id) return res.status(400).json({ error: 'invalid session id' });
  try {
    const s = await bootSession(id);
    res.json({ id, status: s.status, qr: s.qrDataUri, error: s.error || null });
  } catch (e) {
    next(e);
  }
});

app.get('/sessions/:id/status', (req, res, next) => {
  const id = sanitizeSessionId(req.params.id);
  if (!id) return res.status(400).json({ error: 'invalid session id' });
  try {
    const s = sessions.get(id);
    if (!s) throw Object.assign(new Error('session not found'), { http: 404 });
    res.json({ id, status: s.status, error: s.error || null });
  } catch (e) {
    next(e);
  }
});

app.get('/sessions/:id/qr', (req, res, next) => {
  const id = sanitizeSessionId(req.params.id);
  if (!id) return res.status(400).json({ error: 'invalid session id' });
  try {
    const s = sessions.get(id);
    if (!s) throw Object.assign(new Error('session not found'), { http: 404 });
    res.json({ status: s.status, qr: s.qrDataUri });
  } catch (e) {
    next(e);
  }
});

app.delete('/sessions/:id', async (req, res, next) => {
  const id = sanitizeSessionId(req.params.id);
  if (!id) return res.status(400).json({ error: 'invalid session id' });
  try {
    await destroySession(id);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// Send a plain text message — used by Laravel to deliver OTP codes.
app.post('/sessions/:id/messages', async (req, res, next) => {
  const id = sanitizeSessionId(req.params.id);
  if (!id) return res.status(400).json({ error: 'invalid session id' });
  try {
    const session = sessions.get(id);
    requireReady(session);

    const body = req.body || {};
    if (!body.to) return res.status(400).json({ error: 'field `to` is required' });

    const jid = toJid(body.to);
    if (!jid) return res.status(400).json({ error: 'field `to` bukan nomor yang valid' });

    await waitForKeysToSettle(session);

    const result = await withTimeoutOrThrow(
      session.sock.sendMessage(jid, { text: body.body ?? '' }),
      30_000,
      `sendMessage to ${jid}`,
    );
    res.json(serializeSendResult(result, jid, body.body));
  } catch (e) {
    next(e);
  }
});

// Centralized error handler — turns thrown { http } errors into HTTP responses.
app.use((err, _req, res, _next) => {
  console.error(`${LOG} error: ${err && err.stack ? err.stack : err}`);
  const status = err.http || 500;
  res.status(status).json({ error: err.message || 'internal error' });
});

const server = app.listen(PORT, HOST, () => {
  console.log(`${LOG} listening on http://${HOST}:${PORT}`);

  // Sekali scan, selamanya: bangun ulang semua session tersimpan saat proses
  // hidup lagi (redeploy, crash, reboot) tanpa perlu QR ulang.
  if (!AUTO_START_SESSIONS) return;
  for (const id of discoverPersistedSessions()) {
    bootSession(id)
      .then(() => console.log(`${LOG} auto-started persisted session ${id}`))
      .catch((e) => console.error(`${LOG} failed to auto-start ${id}: ${e.message}`));
  }
});

function shutdown(signal) {
  console.log(`${LOG} caught ${signal}, shutting down...`);
  for (const session of sessions.values()) {
    clearTimeout(session.reconnectTimer);
    try { session.sock?.end(new Error('sidecar shutting down')); } catch (_) {}
  }
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
