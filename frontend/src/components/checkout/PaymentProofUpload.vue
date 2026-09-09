<template>
  <div class="upload-section">
    <div class="upload-heading">
      <div>
        <span class="section-label">Payment receipt</span>
        <h3>Bukti Transfer</h3>
      </div>
    </div>

    <label v-if="!previewUrl" class="upload-box" for="paymentProof">
      <input
        id="paymentProof"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        @change="handleFileUpload"
      />
      <span class="upload-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 16V4m0 0-4 4m4-4 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </span>
      <strong>+ Upload Bukti</strong>
      <small>JPG, PNG atau WebP</small>
    </label>

    <!-- Preview -->
    <div v-else class="preview-wrapper">
      <div class="preview-header">
        <div>
          <span class="section-label">Uploaded receipt</span>
          <strong>Bukti pembayaran</strong>
        </div>
        <button type="button" class="remove-upload" @click="removeFile">
          Remove
        </button>
      </div>

      <div class="preview-image">
        <img :src="previewUrl" alt="Preview bukti transfer" />
      </div>
    </div>
  </div>

  <button
    type="button"
    class="confirm-button"
    :disabled="isSubmitting"
    @click="confirmPayment"
  >
    <span v-if="!isSubmitting">Konfirmasi Pembayaran</span>
    <span v-else>Mengirim...</span>
    <svg v-if="!isSubmitting" width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>

  <NoticeModal
    :visible="isNoticeVisible"
    :type="noticeType"
    :title="noticeTitle"
    :message="noticeMessage"
    :detail="noticeDetail"
    :confirm-text="noticeConfirmText"
    @close="handleNoticeClose"
    @confirm="handleNoticeConfirm"
  />
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { orderService } from '../../services/orderService.js';
import { useCartStore } from '../../stores/cart.js';
import { useOrderStore } from '../../stores/order.js';
import NoticeModal from '../common/NoticeModal.vue';
import { useNoticeModal } from '../../composables/useNoticeModal.js';

const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const {
  isNoticeVisible,
  noticeType,
  noticeTitle,
  noticeMessage,
  noticeDetail,
  noticeConfirmText,
  showSuccess,
  showFailed,
  hideNotice
} = useNoticeModal();

const previewUrl = ref('');
const uploadedFile = ref(null);
const isSubmitting = ref(false);
const submittedOrderId = ref('');

function handleFileUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    showFailed({
      title: 'Format file tidak didukung',
      message: 'Bukti pembayaran harus berupa file JPG atau PNG.',
      detail: `Format file yang dipilih: ${file.type || 'tidak diketahui'}. Silakan pilih file dengan format yang sesuai.`
    });
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    showFailed({
      title: 'Ukuran file terlalu besar',
      message: 'Ukuran bukti pembayaran maksimal 2 MB.',
      detail: `Ukuran file yang dipilih: ${(file.size / 1024 / 1024).toFixed(2)} MB. Kompres file lalu coba lagi.`
    });
    return;
  }

  uploadedFile.value = file;
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
  previewUrl.value = URL.createObjectURL(file);
}

function removeFile() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
  previewUrl.value = '';
  uploadedFile.value = null;

  const input = document.getElementById('paymentProof');
  if (input) input.value = '';
}

async function confirmPayment() {
  if (!previewUrl.value && !uploadedFile.value) {
    showFailed({
      title: 'Bukti pembayaran belum dipilih',
      message: 'Pilih dan tinjau bukti transfer sebelum melakukan konfirmasi.',
      detail: 'File yang didukung adalah JPG atau PNG dengan ukuran maksimal 2 MB.'
    });
    return;
  }

  isSubmitting.value = true;
  try {
    const orderId = localStorage.getItem('warung-order-id');
    if (!orderId) {
      throw new Error('Order tidak ditemukan. Silakan kembali ke keranjang dan buat pesanan baru.');
    }

    const res = await orderService.uploadReceipt(uploadedFile.value);
    
    orderStore.currentOrder = res;
    submittedOrderId.value = orderId;
    
    cartStore.clearCart();
    showSuccess({
      title: 'Pembayaran berhasil dikonfirmasi',
      message: 'Bukti pembayaran Anda berhasil dikirim dan sedang menunggu verifikasi.',
      detail: `Nomor pesanan: ${orderId}`,
      confirmText: 'Lihat detail pesanan'
    });
  } catch (err) {
    showFailed({
      title: 'Pembayaran gagal dikonfirmasi',
      message: 'Bukti pembayaran belum berhasil dikirim ke server.',
      detail: err.message || 'Terjadi kesalahan yang tidak diketahui. Periksa koneksi lalu coba lagi.'
    });
  } finally {
    isSubmitting.value = false;
  }
}

function handleNoticeClose() {
  hideNotice();
}

async function handleNoticeConfirm() {
  const orderId = submittedOrderId.value;
  hideNotice();

  if (noticeType.value === 'success' && orderId) {
    await router.push(`/orders/${orderId}`);
  }
}

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

<style scoped>
.section-label {
  display: block;
  color: var(--red);
  font-size: .7rem;
  font-weight: 800;
  letter-spacing: .15em;
  text-transform: uppercase;
}

.upload-section {
  margin-top: 28px;
  padding-top: 28px;
  border-top: 1px solid var(--line);
}

.upload-heading h3 {
  margin-top: 4px;
  margin-bottom: 16px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.25rem;
  font-weight: 500;
}

.upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 150px;
  padding: 24px;
  border: 2px dashed var(--line);
  border-radius: var(--r-md);
  background: var(--soft);
  cursor: pointer;
  transition: border-color var(--ease), background var(--ease);
}

.upload-box:hover {
  border-color: var(--red);
  background: #fdf8f8;
}

.upload-box input {
  display: none;
}

.upload-icon {
  color: var(--red);
}

.upload-box strong {
  font-size: 0.95rem;
  color: var(--ink);
}

.upload-box small {
  color: var(--muted);
  font-size: 0.76rem;
}

.preview-wrapper {
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  padding: 16px;
  background: var(--soft);
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.remove-upload {
  color: var(--red);
  font-size: 0.8rem;
  font-weight: 750;
  cursor: pointer;
}

.preview-image {
  max-height: 240px;
  overflow: hidden;
  border-radius: var(--r-sm);
}

.preview-image img {
  width: 100%;
  max-height: 240px;
  object-fit: contain;
}

.confirm-button {
  display: flex;
  width: 100%;
  min-height: 52px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 28px;
  border-radius: var(--r-sm);
  background: var(--red);
  color: #fff;
  font-size: 0.92rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  transition: background var(--ease), opacity var(--ease);
}

.confirm-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.confirm-button:not(:disabled):hover {
  background: var(--red-dark);
}
</style>
