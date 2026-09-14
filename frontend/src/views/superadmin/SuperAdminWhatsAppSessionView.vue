<template>
  <div class="whatsapp-session-page">
    <header class="page-header">
      <div>
        
        <h1 class="page-title">Active session</h1>
        <p class="page-description">
          Hubungkan satu nomor WhatsApp operasional untuk kebutuhan aplikasi.
        </p>
      </div>
      <button class="refresh-button" type="button" :disabled="isLoading" title="Refresh status" @click="loadSession">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 11a8 8 0 0 0-14.9-4M4 5v4h4M4 13a8 8 0 0 0 14.9 4M20 19v-4h-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>Refresh</span>
      </button>
    </header>

    <div v-if="errorMessage" class="feedback feedback-error" role="alert">
      <strong>Sidecar tidak tersedia.</strong>
      <span>{{ errorMessage }}</span>
    </div>

    <section class="session-card" aria-labelledby="session-title">
      <div class="session-card-header">
        <div class="session-identity">
          <div class="whatsapp-mark" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20.5 11.5a8.5 8.5 0 0 1-12.58 7.45L3.5 20l1.1-4.13A8.5 8.5 0 1 1 20.5 11.5Z" stroke="currentColor" stroke-width="1.7" />
              <path d="M8.2 8.2c.25-.3.52-.31.76-.05l.62.7c.2.23.22.45.07.7l-.3.48c.5 1.02 1.32 1.84 2.34 2.34l.48-.3c.25-.15.47-.13.7.07l.7.62c.26.24.25.51-.05.76-.45.4-1.1.5-1.68.28a8.1 8.1 0 0 1-4.32-4.32c-.22-.58-.12-1.23.28-1.68Z" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div class="session-name-row">
              <h2 id="session-title">{{ session.id }}</h2>
              <span class="fixed-label">FIXED SESSION</span>
            </div>
            <p>WhatsApp Web sidecar</p>
          </div>
        </div>
        <span class="status-pill" :class="statusClass">
          <span class="status-dot" aria-hidden="true"></span>
          {{ statusLabel }}
        </span>
      </div>

      <div class="session-card-body">
        <div class="status-copy">
          <p class="body-label">Connection status</p>
          <h3>{{ statusTitle }}</h3>
          <p>{{ statusDescription }}</p>
        </div>

        <div v-if="isQrState" class="qr-panel">
          <div class="qr-frame">
            <img v-if="session.qr" :src="session.qr" alt="QR code WhatsApp untuk dipindai" />
            <div v-else class="qr-placeholder" aria-live="polite">
              <span class="spinner"></span>
              <span>Menunggu QR code...</span>
            </div>
          </div>
          <div class="qr-instructions">
            <strong>Scan QR code dari WhatsApp</strong>
            <span>Buka WhatsApp di ponsel, pilih Linked devices, lalu tautkan perangkat.</span>
          </div>
        </div>

        <div v-else class="status-illustration" :class="statusClass" aria-hidden="true">
          <svg v-if="isReady" width="42" height="42" viewBox="0 0 24 24" fill="none">
            <path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg v-else width="42" height="42" viewBox="0 0 24 24" fill="none">
            <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <path d="M10.3 3.7 2.4 17.4a2 2 0 0 0 1.73 3h15.74a2 2 0 0 0 1.73-3L13.7 3.7a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="1.6" />
          </svg>
        </div>
      </div>

      <div class="session-card-footer">
        <span class="footer-note">Session ID: <strong>{{ session.id }}</strong></span>
        <button
          v-if="!isReady && !isQrState"
          class="primary-button"
          type="button"
          :disabled="isStarting"
          @click="startSession"
        >
          <span v-if="isStarting" class="button-spinner"></span>
          <span>{{ isStarting ? 'Mengaktifkan...' : 'Aktifkan kembali' }}</span>
        </button>
      </div>
    </section>

    <p class="page-note">Nama session dikunci dari konfigurasi backend dan tidak dapat dibuat dari halaman ini.</p>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { whatsappSessionService } from '../../services/whatsappSessionService.js';

const defaultSession = { id: 'warung-korea', status: 'disconnected', qr: null };
const session = ref({ ...defaultSession });
const isLoading = ref(true);
const isStarting = ref(false);
const errorMessage = ref('');
let pollTimer;

const isReady = computed(() => ['ready', 'authenticated'].includes(session.value.status));
const isQrState = computed(() => session.value.status === 'qr');
const statusClass = computed(() => {
  if (isReady.value) return 'status-ready';
  if (isQrState.value) return 'status-qr';
  if (session.value.status === 'initializing') return 'status-loading';
  return 'status-offline';
});
const statusLabel = computed(() => ({
  ready: 'Active',
  authenticated: 'Active',
  qr: 'Needs scan',
  initializing: 'Starting',
  disconnected: 'Disconnected',
  auth_failure: 'Auth failure',
  error: 'Error',
}[session.value.status] || 'Offline'));
const statusTitle = computed(() => {
  if (isReady.value) return 'WhatsApp is connected';
  if (isQrState.value) return 'Scan to connect this number';
  if (session.value.status === 'initializing') return 'Starting WhatsApp session';
  return 'Session is not active';
});
const statusDescription = computed(() => {
  if (isReady.value) return 'The application can now use this number for WhatsApp operations.';
  if (isQrState.value) return 'The QR code will refresh automatically while the sidecar waits for pairing.';
  if (session.value.status === 'initializing') return 'The sidecar is preparing the session. This can take a few seconds.';
  return 'The saved session can be restored without deleting its authentication data.';
});

const loadSession = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    session.value = { ...defaultSession, ...(await whatsappSessionService.get()) };
  } catch (error) {
    errorMessage.value = error.response?.data?.message || error.message || 'Gagal membaca status session.';
  } finally {
    isLoading.value = false;
  }
};

const startSession = async () => {
  isStarting.value = true;
  errorMessage.value = '';

  try {
    session.value = { ...defaultSession, ...(await whatsappSessionService.start()) };
  } catch (error) {
    errorMessage.value = error.response?.data?.message || error.message || 'Gagal mengaktifkan session.';
  } finally {
    isStarting.value = false;
  }
};

onMounted(async () => {
  await loadSession();
  pollTimer = window.setInterval(loadSession, 4000);
});

onBeforeUnmount(() => {
  window.clearInterval(pollTimer);
});
</script>

<style scoped>
.whatsapp-session-page {
  width: min(100%, 1200px);
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.page-eyebrow {
  margin: 0 0 6px;
  color: #2563eb;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.page-title {
  margin: 0;
  color: var(--ink);
  font-family: inherit;
  font-size: clamp(28px, 3.2vw, 36px);
  font-weight: 750;
  letter-spacing: -0.025em;
}

.page-description {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.55;
}

.refresh-button,
.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  border-radius: var(--r-sm);
  font-size: 0.8rem;
  font-weight: 750;
  cursor: pointer;
  transition: all var(--ease);
}

.refresh-button {
  padding: 0 14px;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink);
}

.refresh-button:hover:not(:disabled) {
  border-color: var(--ink);
}

button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.feedback {
  display: flex;
  gap: 8px;
  padding: 13px 16px;
  margin-bottom: 16px;
  border: 1px solid;
  border-radius: var(--r-sm);
  font-size: 0.82rem;
}

.feedback-error {
  border-color: #fecaca;
  background: #fff1f2;
  color: #991b1b;
}

.session-card {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 12px 30px rgba(36, 25, 18, 0.04);
}

.session-card-header,
.session-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 22px 26px;
}

.session-card-header {
  border-bottom: 1px solid var(--line);
}

.session-identity {
  display: flex;
  align-items: center;
  gap: 13px;
}

.whatsapp-mark {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 12px;
  background: #e9f8ef;
  color: #15803d;
}

.session-name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.session-name-row h2 {
  margin: 0;
  color: var(--ink);
  font-size: 1.14rem;
  font-weight: 750;
  letter-spacing: -0.012em;
}

.session-identity p,
.status-copy p,
.qr-instructions span,
.page-note {
  color: var(--muted);
}

.session-identity p {
  margin: 4px 0 0;
  font-size: 0.82rem;
}

.fixed-label {
  padding: 4px 7px;
  border-radius: 4px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.status-ready { color: #15803d; background: #f0fdf4; }
.status-qr { color: #b45309; background: #fffbeb; }
.status-loading { color: #2563eb; background: #eff6ff; }
.status-offline { color: #b91c1c; background: #fef2f2; }

.session-card-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: 32px;
  min-height: 250px;
  padding: 30px 26px;
}

.body-label {
  margin: 0 0 8px;
  color: #2563eb !important;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.status-copy h3 {
  margin: 0;
  color: var(--ink);
  font-family: inherit;
  font-size: 1.5rem;
  font-weight: 750;
  letter-spacing: -0.02em;
}

.status-copy p:last-child {
  max-width: 470px;
  margin: 9px 0 0;
  font-size: 0.92rem;
  line-height: 1.6;
}

.status-illustration {
  display: grid;
  width: 150px;
  height: 150px;
  place-items: center;
  justify-self: center;
  border-radius: 50%;
}

.status-illustration.status-ready { background: #dcfce7; }
.status-illustration.status-offline { background: #fee2e2; }
.status-illustration.status-loading { background: #dbeafe; }

.qr-panel {
  display: flex;
  align-items: center;
  gap: 18px;
  justify-content: center;
  min-width: 0;
}

.qr-frame {
  display: grid;
  width: 182px;
  height: 182px;
  flex: 0 0 182px;
  place-items: center;
  border: 1px solid #dbe4dc;
  background: #fff;
}

.qr-frame img {
  display: block;
  width: 168px;
  height: 168px;
  object-fit: contain;
}

.qr-placeholder {
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 16px;
  color: var(--muted);
  font-size: 0.72rem;
  text-align: center;
}

.spinner,
.button-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #dbe4dc;
  border-top-color: #15803d;
  border-radius: 50%;
  animation: spin 700ms linear infinite;
}

.qr-instructions {
  display: grid;
  gap: 6px;
  max-width: 165px;
  font-size: 0.82rem;
  line-height: 1.45;
}

.session-card-footer {
  border-top: 1px solid var(--line);
  background: #fcfbfa;
}

.footer-note,
.page-note {
  font-size: 0.76rem;
}

.footer-note { color: var(--muted); }
.footer-note strong { color: var(--ink); }

.primary-button {
  padding: 0 16px;
  border: 1px solid #b91c1c;
  background: var(--red);
  color: #fff;
}

.primary-button:hover:not(:disabled) {
  background: #991b1b;
}

.button-spinner {
  width: 14px;
  height: 14px;
  border-color: rgba(255,255,255,0.35);
  border-top-color: #fff;
}

.page-note {
  margin: 14px 0 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 700px) {
  .whatsapp-session-page {
    padding: 20px 14px;
  }

  .page-header,
  .session-card-header,
  .session-card-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .session-card-body {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 24px 18px;
  }

  .status-illustration {
    justify-self: center;
  }

  .qr-panel {
    width: 100%;
    flex-direction: column;
    justify-content: center;
    gap: 14px;
  }

  .qr-instructions {
    max-width: 280px;
    text-align: center;
  }

  .session-card-header,
  .session-card-footer {
    padding: 18px;
  }

  .session-card-header {
    gap: 14px;
  }

  .session-card-footer {
    align-items: stretch;
  }

  .primary-button,
  .refresh-button {
    width: 100%;
  }
}

@media (min-width: 701px) and (max-width: 1050px) {
  .whatsapp-session-page {
    padding: 24px 20px;
  }

  .session-card-body {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .qr-panel {
    justify-content: flex-start;
  }
}
</style>
