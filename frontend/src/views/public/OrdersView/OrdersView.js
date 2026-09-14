import { ref, onMounted } from 'vue';
import AppHeader from '../../../components/layout/AppHeader.vue';
import AppFooter from '../../../components/layout/AppFooter.vue';
import OrderTrackingProgress from '../../../components/orders/OrderTrackingProgress.vue';
import OrderDetailCard from '../../../components/orders/OrderDetailCard.vue';
import OrderPaymentCard from '../../../components/orders/OrderPaymentCard.vue';
import PaymentProofModal from '../../../components/orders/PaymentProofModal.vue';
import ToastNotification from '../../../components/common/ToastNotification.vue';
import { useOrderStore } from '../../../stores/order.js';
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
    onMounted(async () => { await orderStore.fetchActiveOrder(); if (orderStore.currentOrder) order.value = orderStore.currentOrder; });
    return { order, isToastVisible, toastMessage, handleDownloadReceipt, handlePrintReceipt };
  }
};
