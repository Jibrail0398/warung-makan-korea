import { ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { orderService } from '../../../services/orderService.js';
import { useCartStore } from '../../../stores/cart.js';
import { useOrderStore } from '../../../stores/order.js';
import NoticeModal from '../../common/NoticeModal/NoticeModal.vue';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner.vue';
import { useNoticeModal } from '../../../composables/useNoticeModal.js';
import './PaymentProofUpload.css';

export default {
  name: 'PaymentProofUpload',
  components: { NoticeModal, LoadingSpinner },
  setup() {
    const router = useRouter();
    const cartStore = useCartStore();
    const orderStore = useOrderStore();
    const { isNoticeVisible, noticeType, noticeTitle, noticeMessage, noticeDetail, noticeConfirmText, showSuccess, showFailed, hideNotice } = useNoticeModal();
    const previewUrl = ref('');
    const uploadedFile = ref(null);
    const isSubmitting = ref(false);
    const submittedOrderId = ref('');

    function handleFileUpload(event) {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { showFailed({ title: 'Format file tidak didukung', message: 'Bukti pembayaran harus berupa file JPG, PNG, atau WebP.', detail: `Format file yang dipilih: ${file.type || 'tidak diketahui'}. Silakan pilih file dengan format yang sesuai.` }); return; }
      if (file.size > 10 * 1024 * 1024) { showFailed({ title: 'Ukuran file terlalu besar', message: 'Ukuran bukti pembayaran maksimal 10 MB.', detail: `Ukuran file yang dipilih: ${(file.size / 1024 / 1024).toFixed(2)} MB. Kompres file lalu coba lagi.` }); return; }
      uploadedFile.value = file;
      if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
      previewUrl.value = URL.createObjectURL(file);
    }

    function removeFile() {
      if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
      previewUrl.value = '';
      uploadedFile.value = null;
      const input = document.getElementById('paymentProof');
      if (input) input.value = '';
    }

    async function confirmPayment() {
      if (!previewUrl.value && !uploadedFile.value) { showFailed({ title: 'Bukti pembayaran belum dipilih', message: 'Pilih dan tinjau bukti transfer sebelum melakukan konfirmasi.', detail: 'File yang didukung adalah JPG, PNG atau WebP dengan ukuran maksimal 10 MB.' }); return; }
      isSubmitting.value = true;
      try {
        const orderId = localStorage.getItem('warung-order-id');
        if (!orderId) throw new Error('Order tidak ditemukan. Silakan kembali ke keranjang dan buat pesanan baru.');
        const res = await orderService.uploadReceipt(uploadedFile.value);
        orderStore.currentOrder = res;
        submittedOrderId.value = orderId;
        cartStore.clearCart();
        showSuccess({ title: 'Pembayaran berhasil dikonfirmasi', message: 'Bukti pembayaran Anda berhasil dikirim dan sedang menunggu verifikasi.', detail: `Nomor pesanan: ${orderId}`, confirmText: 'Lihat detail pesanan' });
      } catch (err) { showFailed({ title: 'Pembayaran gagal dikonfirmasi', message: 'Bukti pembayaran belum berhasil dikirim ke server.', detail: err.message || 'Terjadi kesalahan yang tidak diketahui. Periksa koneksi lalu coba lagi.' }); } finally { isSubmitting.value = false; }
    }

    function handleNoticeClose() { hideNotice(); }
    async function handleNoticeConfirm() { const orderId = submittedOrderId.value; hideNotice(); if (noticeType.value === 'success' && orderId) await router.push(`/orders/${orderId}`); }

    onBeforeUnmount(() => { if (previewUrl.value) URL.revokeObjectURL(previewUrl.value); });

    return { previewUrl, isSubmitting, isNoticeVisible, noticeType, noticeTitle, noticeMessage, noticeDetail, noticeConfirmText, handleFileUpload, removeFile, confirmPayment, handleNoticeClose, handleNoticeConfirm };
  }
};
