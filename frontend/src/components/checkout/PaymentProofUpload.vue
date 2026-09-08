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
    :disabled="!previewUrl || isSubmitting"
    @click="confirmPayment"
  >
    <span v-if="!isSubmitting">Konfirmasi Pembayaran</span>
    <span v-else>Mengirim...</span>
    <svg v-if="!isSubmitting" width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { orderService } from '../../services/orderService.js';
import { useCartStore } from '../../stores/cart.js';
import { useOrderStore } from '../../stores/order.js';

const emit = defineEmits(['showToast']);
const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();

const previewUrl = ref('');
const uploadedFile = ref(null);
const isSubmitting = ref(false);

function handleFileUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    emit('showToast', 'File harus berupa gambar');
    return;
  }

  uploadedFile.value = file;
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
  previewUrl.value = URL.createObjectURL(file);
  emit('showToast', 'Bukti transfer berhasil dipilih');
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
    emit('showToast', 'Upload bukti transfer terlebih dahulu', 3000, 'error');
    return;
  }

  isSubmitting.value = true;
  try {
    const orderId = localStorage.getItem('warung-order-id');
    if (!orderId) throw new Error('Order tidak ditemukan. Silakan ulangi checkout.');

    const res = await orderService.uploadReceipt(uploadedFile.value);
    
    orderStore.currentOrder = res;
    
    cartStore.clearCart();
    emit('showToast', res.message || 'Pesanan berhasil dikirim!');

    setTimeout(() => {
      router.push(`/orders/${orderId}`);
    }, 1000);
  } catch (err) {
    emit('showToast', err.message || 'Gagal mengirim konfirmasi', 3000, 'error');
  } finally {
    isSubmitting.value = false;
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
