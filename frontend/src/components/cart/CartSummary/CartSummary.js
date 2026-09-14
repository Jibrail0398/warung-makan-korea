import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../../../stores/cart.js';
import { useAuthStore } from '../../../stores/auth.js';
import { orderService } from '../../../services/orderService.js';
import NoticeModal from '../../common/NoticeModal/NoticeModal.vue';
import { useNoticeModal } from '../../../composables/useNoticeModal.js';
import './CartSummary.css';

export default {
  name: 'CartSummary',
  components: { NoticeModal },
  setup() {
    const cartStore = useCartStore();
    const authStore = useAuthStore();
    const router = useRouter();
    const { isNoticeVisible, noticeType, noticeTitle, noticeMessage, noticeDetail, noticeConfirmText, showSuccess, showFailed, hideNotice } = useNoticeModal();
    const orderType = ref('dine-in');
    const scheduleType = ref('now');
    const scheduleDate = ref('');
    const scheduleTime = ref('');
    const guestName = ref('');
    const orderNote = ref('');
    const phoneNumber = ref('');
    const orderTypeOpen = ref(false);
    const scheduleOpen = ref(false);
    const isSubmitting = ref(false);
    const createdOrder = ref(null);
    const isLoggedIn = computed(() => authStore.isAuthenticated || !!localStorage.getItem('warung-token') || !!localStorage.getItem('token'));
    const orderTypeOptions = [{ value: 'dine-in', label: 'Dine-in' }, { value: 'takeaway', label: 'Takeaway' }, { value: 'delivery', label: 'Delivery' }];
    const scheduleOptions = [{ value: 'now', label: 'As soon as possible' }, { value: 'schedule', label: 'Schedule for later' }];
    const orderTypeLabel = computed(() => { const opt = orderTypeOptions.find(o => o.value === orderType.value); return opt?.label || 'Dine-in'; });
    const scheduleLabel = computed(() => { const opt = scheduleOptions.find(o => o.value === scheduleType.value); return opt?.label || 'As soon as possible'; });
    function selectOrderType(val) { orderType.value = val; orderTypeOpen.value = false; }
    function selectSchedule(val) { scheduleType.value = val; scheduleOpen.value = false; if (val === 'now') { scheduleDate.value = ''; scheduleTime.value = ''; } }
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
