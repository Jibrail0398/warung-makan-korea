import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from '../../../components/layout/AppHeader/AppHeader.vue';
import AppFooter from '../../../components/layout/AppFooter/AppFooter.vue';
import ToastNotification from '../../../components/common/ToastNotification/ToastNotification.vue';
import { orderService } from '../../../services/orderService.js';
import { orderStatusRealtimeService } from '../../../services/orderStatusRealtimeService.js';
import { generateReceiptPdf } from '../../../utils/receiptPdf.js';
import { useToast } from '../../../composables/useToast.js';
import './OrderHistoryDetailView.css';

export default {
  name: 'OrderHistoryDetailView',
  components: { AppHeader, AppFooter, ToastNotification },
  setup() {
    const route = useRoute();
    const { isToastVisible, toastMessage, showToast } = useToast();
    const order = ref({});
    const isLoading = ref(true);
    const loadError = ref('');
    const orderId = computed(() => route.params.id);
    const isAuthenticated = computed(() => Boolean(localStorage.getItem('warung-auth-key')));
    const items = computed(() => order.value.items || []);
    const paymentStatus = computed(() => ['unpaid', 'awaiting_verification', 'paid'].includes(order.value.payment_status) ? order.value.payment_status : 'unpaid');
    const isRejected = computed(() => order.value.status === 'cancelled' && paymentStatus.value === 'unpaid');
    const paymentStatusLabel = computed(() => {
      if (isRejected.value) return 'Bukti bayar ditolak';
      return { unpaid: 'Unpaid', awaiting_verification: 'Menunggu konfirmasi', paid: 'Paid' }[paymentStatus.value];
    });
    const paymentStatusDescription = computed(() => {
      if (isRejected.value) return 'Bukti bayar ditolak oleh kasir. Silakan hubungi kasir atau buat pesanan baru.';
      return {
        unpaid: 'Pembayaran belum diterima. Silakan lakukan transfer sesuai instruksi checkout.',
        awaiting_verification: 'Bukti transfer sudah diterima dan sedang diperiksa oleh kasir.',
        paid: 'Pembayaran pesanan ini sudah dikonfirmasi oleh kasir.'
      }[paymentStatus.value];
    });
    const totalQuantity = computed(() => items.value.reduce((sum, item) => sum + Number(item.quantity || 0), 0));
    const isPaid = computed(() => paymentStatus.value === 'paid');

    async function loadOrder() {
      isLoading.value = true; loadError.value = '';
      try { order.value = await orderService.getOrderById(orderId.value); } catch (error) { loadError.value = error.message || 'Detail pesanan tidak dapat dimuat.'; } finally { isLoading.value = false; }
    }

    // Realtime: subscribe channel unik per nomor pesanan
    function handleRealtimeStatus(data) {
      if (!order.value || order.value.id !== data?.id) return;
      order.value = { ...order.value, status: data.status, payment_status: data.payment_status };
      showToast('Status pesanan Anda diperbarui', 2500);
    }

    function formatPrice(value) { return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(Number(value) || 0); }
    function formatDateTime(value) { if (!value) return 'Waktu pesanan tidak tersedia'; return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); }
    function handleDownloadReceipt() {
      // Struk kertas A6 — desain sama dengan struk sisi admin
      generateReceiptPdf(order.value).save(`struk-${order.value.id}.pdf`);
      showToast('Struk berhasil diunduh');
    }
    onMounted(() => {
      loadOrder();
      orderStatusRealtimeService.subscribe(orderId.value, handleRealtimeStatus);
    });
    watch(orderId, () => {
      loadOrder();
      orderStatusRealtimeService.subscribe(orderId.value, handleRealtimeStatus);
    });
    onUnmounted(() => {
      orderStatusRealtimeService.stop();
    });
    return { order, isLoading, loadError, items, paymentStatus, paymentStatusLabel, paymentStatusDescription, totalQuantity, isPaid, isToastVisible, toastMessage, formatPrice, formatDateTime, handleDownloadReceipt };
  }
};
