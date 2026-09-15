import { ref, onMounted, onUnmounted } from 'vue';
import AppHeader from '../../../components/layout/AppHeader/AppHeader.vue';
import AppFooter from '../../../components/layout/AppFooter/AppFooter.vue';
import OrderTrackingProgress from '../../../components/orders/OrderTrackingProgress/OrderTrackingProgress.vue';
import OrderDetailCard from '../../../components/orders/OrderDetailCard/OrderDetailCard.vue';
import OrderPaymentCard from '../../../components/orders/OrderPaymentCard/OrderPaymentCard.vue';
import PaymentProofModal from '../../../components/orders/PaymentProofModal/PaymentProofModal.vue';
import ToastNotification from '../../../components/common/ToastNotification/ToastNotification.vue';
import { useOrderStore } from '../../../stores/order.js';
import { orderStatusRealtimeService } from '../../../services/orderStatusRealtimeService.js';
import { useToast } from '../../../composables/useToast.js';
import './OrdersView.css';

export default {
  name: 'OrdersView',
  components: { AppHeader, AppFooter, OrderTrackingProgress, OrderDetailCard, OrderPaymentCard, PaymentProofModal, ToastNotification },
  setup() {
    const orderStore = useOrderStore();
    const { isToastVisible, toastMessage, showToast } = useToast();
    const order = ref({});
    function handleDownloadReceipt() { showToast('Receipt download started'); }
    function handlePrintReceipt() { window.print(); }

    // Realtime: update status & pembayaran otomatis saat pekerja mengubahnya
    async function handleRealtimeStatus(data) {
      if (order.value?.id && data?.id !== order.value.id) return;
      // Refetch agar field lain (bukti bayar, dsb) ikut terbarui
      await orderStore.fetchActiveOrder();
      if (orderStore.currentOrder) order.value = orderStore.currentOrder;
      showToast('Status pesanan diperbarui', 2500);
    }

    onMounted(async () => {
      await orderStore.fetchActiveOrder();
      if (orderStore.currentOrder) order.value = orderStore.currentOrder;
      if (order.value?.id) {
        orderStatusRealtimeService.subscribe(order.value.id, handleRealtimeStatus);
      }
    });

    onUnmounted(() => {
      orderStatusRealtimeService.stop();
    });

    return { order, isToastVisible, toastMessage, handleDownloadReceipt, handlePrintReceipt };
  }
};
