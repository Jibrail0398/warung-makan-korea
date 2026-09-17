<template>
  <div class="upload-section">
    <div class="upload-heading"><div><span class="section-label">Payment receipt</span><h3>Bukti Transfer</h3></div></div>
    <label v-if="!previewUrl" class="upload-box" for="paymentProof">
      <input id="paymentProof" type="file" accept="image/png,image/jpeg,image/webp" :disabled="isSubmitting" @change="handleFileUpload" />
      <span class="upload-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 16V4m0 0-4 4m4-4 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg></span>
      <strong>+ Upload Bukti</strong><small>JPG, PNG atau WebP</small>
    </label>
    <div v-else class="preview-wrapper">
      <div class="preview-header"><div><span class="section-label">Uploaded receipt</span><strong>Bukti pembayaran</strong></div><button type="button" class="remove-upload" :disabled="isSubmitting" @click="removeFile">Remove</button></div>
      <div class="preview-image"><img :src="previewUrl" alt="Preview bukti transfer" /></div>
    </div>
  </div>
  <button type="button" class="confirm-button" :disabled="isSubmitting" @click="confirmPayment">
    <LoadingSpinner v-if="isSubmitting" size="sm" color="white" text="Mengunggah & Konfirmasi..." inline />
    <template v-else>
      <span>Konfirmasi Pembayaran</span>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </template>
  </button>
  <NoticeModal :visible="isNoticeVisible" :type="noticeType" :title="noticeTitle" :message="noticeMessage" :detail="noticeDetail" :confirm-text="noticeConfirmText" @close="handleNoticeClose" @confirm="handleNoticeConfirm" />
</template>

<script>
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner.vue';
import PaymentProofUploadScript from './PaymentProofUpload.js';

export default {
  components: {
    LoadingSpinner
  },
  ...PaymentProofUploadScript
};
</script>
