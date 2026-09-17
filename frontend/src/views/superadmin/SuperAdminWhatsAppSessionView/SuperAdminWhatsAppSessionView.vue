<template>
  <div class="whatsapp-session-page">
    <header class="page-header"><div><h1 class="page-title">Active session</h1><p class="page-description">Hubungkan satu nomor WhatsApp operasional untuk kebutuhan aplikasi.</p></div></header>
    <div v-if="errorMessage" class="feedback feedback-error" role="alert"><strong>Sidecar tidak tersedia.</strong><span>{{ errorMessage }}</span></div>
    <section class="session-card" aria-labelledby="session-title">
      <div class="session-card-header">
        <div class="session-identity">
          <div class="whatsapp-mark" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.58 7.45L3.5 20l1.1-4.13A8.5 8.5 0 1 1 20.5 11.5Z" stroke="currentColor" stroke-width="1.7" /><path d="M8.2 8.2c.25-.3.52-.31.76-.05l.62.7c.2.23.22.45.07.7l-.3.48c.5 1.02 1.32 1.84 2.34 2.34l.48-.3c.25-.15.47-.13.7.07l.7.62c.26.24.25.51-.05.76-.45.4-1.1.5-1.68.28a8.1 8.1 0 0 1-4.32-4.32c-.22-.58-.12-1.23.28-1.68Z" fill="currentColor" /></svg></div>
          <div><div class="session-name-row"><h2 id="session-title">{{ session.id }}</h2><span class="fixed-label">FIXED SESSION</span></div><p>WhatsApp Web sidecar</p></div>
        </div>
        <span class="status-pill" :class="statusClass"><span class="status-dot" aria-hidden="true"></span>{{ statusLabel }}</span>
      </div>
      <div class="session-card-body">
        <div class="status-copy"><p class="body-label">Connection status</p><h3>{{ statusTitle }}</h3><p>{{ statusDescription }}</p></div>
        <div v-if="isQrState" class="qr-panel">
          <div class="qr-frame">
            <img v-if="session.qr" :src="session.qr" alt="QR code WhatsApp untuk dipindai" />
            <div v-else class="qr-placeholder" aria-live="polite">
              <LoadingSpinner size="sm" color="primary" text="Menunggu QR code..." center />
            </div>
          </div>
          <div class="qr-instructions"><strong>Scan QR code dari WhatsApp</strong><span>Buka WhatsApp di ponsel, pilih Linked devices, lalu tautkan perangkat.</span></div>
        </div>
        <div v-else class="status-illustration" :class="statusClass" aria-hidden="true">
          <svg v-if="isReady" width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          <svg v-else width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" /><path d="M10.3 3.7 2.4 17.4a2 2 0 0 0 1.73 3h15.74a2 2 0 0 0 1.73-3L13.7 3.7a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="1.6" /></svg>
        </div>
      </div>
      <div class="session-card-footer">
        <span class="footer-note">Session ID: <strong>{{ session.id }}</strong></span>
        <button v-if="!isReady && !isQrState" class="primary-button" type="button" :disabled="isStarting || isDeleting" @click="startSession">
          <LoadingSpinner v-if="isStarting" size="sm" color="white" text="Mengaktifkan..." inline />
          <span v-else>Aktifkan kembali</span>
        </button>
        <button class="danger-button" type="button" :disabled="isDeleting || isStarting" @click="destroySession">
          <LoadingSpinner v-if="isDeleting" size="sm" color="white" text="Menghapus..." inline />
          <span v-else>Hapus sesi & scan ulang</span>
        </button>
      </div>
    </section>
    <p class="page-note">Nama session dikunci dari konfigurasi backend dan tidak dapat dibuat dari halaman ini.</p>
  </div>
</template>

<script>
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner.vue';
import SuperAdminWhatsAppSessionScript from './SuperAdminWhatsAppSessionView.js';

export default {
  ...SuperAdminWhatsAppSessionScript,
  components: {
    LoadingSpinner,
    ...SuperAdminWhatsAppSessionScript.components
  }
};
</script>
