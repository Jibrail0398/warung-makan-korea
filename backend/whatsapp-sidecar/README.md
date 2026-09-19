# WhatsApp Sidecar (Baileys)

Service Node ringan yang menggantikan whatsapp-web.js: WebSocket murni via
[Baileys](https://github.com/WhiskeySockets/Baileys) **tanpa Chromium/Puppeteer**
(~100–200 MB RAM vs ~500+ MB).

Fungsi (semua yang dibutuhkan aplikasi Anekarasa Resto):

- Manajemen session WhatsApp: QR pairing, status, hapus session.
- **Sekali scan, selamanya** — kredensial disimpan di disk dan tidak pernah
  dihapus otomatis. Auto-reconnect + auto-start saat proses hidup lagi
  (redeploy/crash/reboot) tanpa scan ulang. Session hanya hilang jika
  superadmin menghapusnya (endpoint `DELETE /sessions/:id`).
- Kirim pesan teks (dipakai Laravel untuk mengirim OTP register).

## API

Semua endpoint (kecuali `/health`) wajib
`Authorization: Bearer <access_token>` — token JWT Laravel (HS256, `JWT_SECRET`
yang sama) dan **hanya lolos jika claim `role` = `superadmin`**. Token tanpa
claim role divalidasi via introspection `GET {LARAVEL_URL}/api/user`.

| Method | Path | Keterangan |
|---|---|---|
| GET | `/health` | Healthcheck (tanpa auth) |
| GET | `/sessions` | Daftar `[{id, status}]` |
| POST | `/sessions/:id/start` | Boot session (QR mulai di-generate) |
| GET | `/sessions/:id/status` | `{id, status, error}` |
| GET | `/sessions/:id/qr` | `{status, qr}` — QR berupa data URI |
| DELETE | `/sessions/:id` | Hapus session + kredensial (scan ulang nanti) |
| POST | `/sessions/:id/messages` | `{to, body}` — kirim teks (OTP) |

Status: `initializing` → `qr` → `ready`; `disconnected` saat terputus
(logged out oleh WhatsApp juga hanya `disconnected` — kredensial tidak dihapus).

## Environment

### Sidecar (service Node ini)

| Var | Default | Keterangan |
|---|---|---|
| `PORT` | `3000` | Railway mengisi otomatis |
| `HOST` | `127.0.0.1` | Di Railway wajib `0.0.0.0` (di-set railpack.json) |
| `JWT_SECRET` | — | **Wajib.** Sama dengan `JWT_SECRET` Laravel. Untuk verifikasi lokal tanda tangan + claim role. |
| `LARAVEL_URL` | — | Fallback introspection token tanpa claim role (mis. `https://warung-makan-korea-production.up.railway.app`). Kosongkan jika semua token dijamin memiliki claim `role`. |
| `SESSION_DIR` | `./sessions` | Lokasi kredensial. Di Railway: `/data/sessions` (Volume). |
| `AUTO_START_SESSIONS` | `true` | Boot session tersimpan saat proses hidup. |
| `DEFAULT_COUNTRY_CODE` | `62` | Normalisasi `0812…` → `62812…` |
| `SEND_SETTLE_DELAY_MS` | `8000` | Delay sebelum kirim pertama setelah session `open`, agar kunci enkripsi selesai sync (mencegah OTP muncul "menunggu pesan ini" di HP penerima). |
| `ROLE_CACHE_TTL` | `60` | Detik cache hasil introspection. |

### Laravel

| Var | Keterangan |
|---|---|
| `WHATSAPP_SIDECAR_URL` | Base URL sidecar. Lokal: `http://127.0.0.1:3000`. Railway: `http://whatsapp-sidecar.railway.internal:<port>`. |
| `WHATSAPP_SIDECAR_TIMEOUT` | Timeout HTTP Laravel → sidecar (detik, default 30). |
| `WHATSAPP_WEB_SESSION` | Nama session tetap, default `warung-korea`. |
| `WHATSAPP_WEB_READY_*` | Polling sampai `ready` (sudah ada default). |

Hapus semua var lama `WHATSAPP_WEB_HOST`, `WHATSAPP_WEB_PORT`, `WHATSAPP_WEB_TOKEN`,
`WHATSAPP_UI_*`, `WHATSAPP_WEB_ENABLED`, `WA_API_URL` — tidak dipakai lagi.

## Deploy di Railway

1. **Service baru** → *New Service → GitHub Repo* → set **Root Directory:
   `backend/whatsapp-sidecar`** (railpack.json di folder itu otomatis dipakai).
2. **Volume**: tambahkan Volume dan mount ke `/data`, lalu set env
   `SESSION_DIR=/data/sessions`. Tanpa Volume, tiap deploy/restart memaksa
   scan ulang (filesystem container ephemeral).
3. Env sidecar:
   - `JWT_SECRET` = nilai `JWT_SECRET` milik service Laravel (copy).
   - `LARAVEL_URL` = `https://warung-makan-korea-production.up.railway.app`
     (opsional, untuk fallback introspection).
   - `HOST=0.0.0.0` dan `AUTO_START_SESSIONS=true` sudah di-set railpack.json.
4. Di service **Laravel**, set:
   - `WHATSAPP_SIDECAR_URL=http://whatsapp-sidecar.railway.internal:<port>`
     (port dari tab Settings/Networking service sidecar; cek dulu private
     networking aktif di kedua service — jika tidak, pakai URL publik sidecar).
   - Hapus var `WHATSAPP_WEB_HOST/PORT/TOKEN/ENABLED` dan `WHATSAPP_UI_*`.
5. Deploy kedua service. Halaman superadmin
   `https://warung-makan-korea-production.up.railway.app/admin/whatsapp-sessions`
   → tombol **Aktifkan kembali** → QR muncul → scan dari *Linked devices*.
6. Verifikasi Volume: setelah deploy ulang, status tetap `ready` tanpa scan.

## Deploy di VPS

Tidak ada dependensi khusus Railway. Contoh docker-compose:

```yaml
services:
  whatsapp-sidecar:
    build: ./backend/whatsapp-sidecar   # atau image node + npm ci
    command: node index.js
    environment:
      - HOST=0.0.0.0
      - JWT_SECRET=${JWT_SECRET}
      - LARAVEL_URL=https://domain-laravel-anda
      - SESSION_DIR=/data/sessions
    volumes:
      - ./data/whatsapp-sessions:/data/sessions   # sekali scan, selamanya
    ports:
      - "127.0.0.1:3000:3000"
```

Atau tanpa Docker: `npm ci && pm2 start index.js --name wa-sidecar`.

## Catatan

- Node >= 20 (Baileys 6.7.24 butuh Node 20+; `railpack.json` & `engines` sudah
  pin Node 20), hanya 4 dependensi runtime: `express`, `qrcode`, `jsonwebtoken`,
  `@whiskeysockets/baileys@6.7.24` (stable).
- Sidecar berdiri sendiri; Laravel memanggilnya via HTTP. Semua request
  Laravel → sidecar membawa access_token superadmin: controller session
  meneruskan token superadmin asli, dan pengiriman OTP menggunakan token
  service yang diterbitkan Laravel sendiri (klaim `role: superadmin`).
- Risiko: akun WhatsApp pribadi yang mengirim OTP otomatis tetap berpotensi
  dibanned WhatsApp (risiko arsitektur, bukan spesifik Baileys).

## Troubleshooting

**OTP muncul "menunggu pesan ini" di HP penerima** — kunci enkripsi belum
selesai sync. Sidecar sudah men-delay kirim pertama setelah `open`
(`SEND_SETTLE_DELAY_MS`, default 8 detik). Jika masih terjadi: hapus session
(`DELETE /sessions/:id` dari halaman superadmin) lalu scan ulang — session
lama dari masa transaksi ganda/deploys berturut-turut bisa punya key state
yang tidak konsisten. Scan ulang sekali + delay = pesan langsung terbaca.

**Frontend gagal navigasi: "Failed to fetch dynamically imported module"** —
browser memegang bundle lama setelah redeploy (chunk hash berubah).
Solusi user: hard refresh (Ctrl+Shift+R) / clear site data. Pencegahan
jangka panjang: pastikan `index.html` di-serve dengan `Cache-Control: no-cache`.
