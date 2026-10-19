import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../../../stores/cart.js';
import { useAuthStore } from '../../../stores/auth.js';
import { orderService } from '../../../services/orderService.js';
import { useNoticeModal } from '../../../composables/useNoticeModal.js';
import './CartSummary.css';

export default {
  name: 'CartSummary',
  setup() {
    const cartStore = useCartStore();
    const authStore = useAuthStore();
    const router = useRouter();
    const { isNoticeVisible, noticeType, noticeTitle, noticeMessage, noticeDetail, noticeConfirmText, showSuccess, showFailed, hideNotice } = useNoticeModal();
    const guestName = ref('');
    const phoneNumber = ref('');
    const isSubmitting = ref(false);
    const createdOrder = ref(null);
    const isLoggedIn = computed(() => authStore.isAuthenticated || !!localStorage.getItem('warung-token') || !!localStorage.getItem('token'));
    async function proceedToCheckout() {
      if (cartStore.cartItems.length === 0 || isSubmitting.value) return;
      const customer = authStore.user;
      const customerName = isLoggedIn.value ? customer?.name : guestName.value.trim();
      const customerPhone = isLoggedIn.value ? (customer?.phone_number || customer?.phone) : phoneNumber.value.trim();
      if (!customerName || !customerPhone) { showFailed({ title: 'Data belum lengkap', message: 'Nama dan nomor telepon diperlukan sebelum checkout.', detail: 'Lengkapi kedua data tersebut agar pesanan dapat dibuat.' }); return; }
      isSubmitting.value = true;
      try {
        const order = await orderService.createOrder({ customer_name: customerName, customer_phone: customerPhone, user_id: isLoggedIn.value ? customer?.id : undefined, items: cartStore.cartItems.map(item => ({ product_id: item.id, quantity: item.quantity })) });
        createdOrder.value = order;
        showSuccess({ title: 'Pesanan berhasil dibuat', message: 'Pesanan Anda sudah tercatat dan siap dilanjutkan ke pembayaran.', detail: `Nomor pesanan: ${order.id}`, confirmText: 'Lanjut ke pembayaran' });
      } catch (error) { showFailed({ title: 'Pesanan gagal dibuat', message: 'Kami belum dapat memproses pesanan Anda.', detail: error.message || 'Periksa koneksi lalu coba lagi.' }); } finally { isSubmitting.value = false; }
    }
    function handleNoticeClose() { hideNotice(); }
    async function handleNoticeConfirm() { const nextOrder = createdOrder.value; hideNotice(); if (noticeType.value === 'success' && nextOrder?.id) await router.push({ path: '/checkout', query: { order: nextOrder.id } }); }
    return { cartStore, authStore, isNoticeVisible, noticeType, noticeTitle, noticeMessage, noticeDetail, noticeConfirmText, guestName, phoneNumber, isSubmitting, isLoggedIn, proceedToCheckout, handleNoticeClose, handleNoticeConfirm };
  }
};
