import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import StatusBadge from '../../../components/admin/StatusBadge/StatusBadge.vue';
import PrintableReceipt from '../../../components/admin/PrintableReceipt/PrintableReceipt.vue';
import PaymentProofViewer from '../../../components/admin/PaymentProofViewer/PaymentProofViewer.vue';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner.vue';
import { orderService } from '../../../services/orderService.js';
import { orderStatusRealtimeService } from '../../../services/orderStatusRealtimeService.js';
import './AdminOrderDetailView.css';

export default {
  name: 'AdminOrderDetailView',
  components: { StatusBadge, PrintableReceipt, PaymentProofViewer, LoadingSpinner },
  setup() {
    const route = useRoute();
    const order = ref(null);
    const isPrintOpen = ref(false);
    const isProofViewerOpen = ref(false);
    const isSubmitting = ref(false);
    const confirmModal = ref(null); // { title, message, action }

    // Status sesuai database: pending, preparing, ready (completed = semua selesai)
    const statusSteps = [
      { key: 'pending', label: 'Pending' },
      { key: 'preparing', label: 'Diproses' },
      { key: 'ready', label: 'Selesai' }
    ];

    const loadOrder = async () => {
      try {
        const data = await orderService.getOrderById(route.params.id);
        order.value = data;
      } catch (error) {
        console.error('Load order error:', error);
      }
    };

    // Realtime: bukti bayar masuk / perubahan status dari server otomatis refresh halaman
    const handleRealtimeStatus = () => {
      loadOrder();
    };

    onMounted(() => {
      loadOrder();
      orderStatusRealtimeService.subscribe(route.params.id, handleRealtimeStatus);
    });

    onUnmounted(() => {
      orderStatusRealtimeService.stop();
    });

    const currentStatus = computed(() => order.value?.status || 'pending');
    const isCancelled = computed(() => currentStatus.value === 'cancelled');
    const currentStepIndex = computed(() => {
      const idx = statusSteps.findIndex(s => s.key === currentStatus.value);
      // completed: semua bulatan done; status lain fallback ke 0
      if (currentStatus.value === 'completed') return statusSteps.length;
      return idx === -1 ? 0 : idx;
    });
    const paymentStatus = computed(() => order.value?.payment_status || 'unpaid');

    // Tombol Konfirmasi Bayar & Tolak Pesanan muncul saat member sudah kirim bukti bayar
    const showPaymentActions = computed(() => {
      return Boolean(order.value?.payment_receipt_url) && paymentStatus.value === 'awaiting_verification';
    });

    // Tombol tahapan hanya muncul setelah pembayaran dikonfirmasi (paid)
    // preparing -> "Pesanan Siap" (ke ready), ready -> "Pesanan diambil" (ke completed)
    const stageButton = computed(() => {
      if (paymentStatus.value !== 'paid') return null;
      switch (currentStatus.value) {
        case 'preparing': return { label: 'Pesanan Siap', next: 'ready' };
        case 'ready': return { label: 'Pesanan diambil', next: 'completed' };
        default: return null;
      }
    });

    const canAct = computed(() => !['completed', 'cancelled'].includes(currentStatus.value) && !isSubmitting.value);

    const applyOrder = (res) => {
      const data = res?.data || res;
      if (data) order.value = data;
    };

    const handleImgError = (event) => {
      event.target.src = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600';
    };

    const runStatusChange = async (payload) => {
      try {
        const res = await orderService.updateOrderStatus(order.value.id, payload);
        applyOrder(res);
      } catch (error) {
        alert(error.message || 'Gagal memperbarui status pesanan');
        await loadOrder();
      } finally {
        isSubmitting.value = false;
      }
    };

    const confirmStage = () => {
      const next = stageButton.value?.next;
      if (!next) return;
      isSubmitting.value = true;
      confirmModal.value = null;
      runStatusChange({ status: next });
    };

    const confirmCancel = () => {
      isSubmitting.value = true;
      confirmModal.value = null;
      runStatusChange({ status: 'cancelled' });
    };

    const confirmApprove = () => {
      isSubmitting.value = true;
      confirmModal.value = null;
      isProofViewerOpen.value = false;
      // Konfirmasi & terima bayar: payment_status=paid dan status pesanan=preparing
      runStatusChange({ status: 'preparing', payment_status: 'paid' });
    };

    const confirmReject = () => {
      isSubmitting.value = true;
      confirmModal.value = null;
      isProofViewerOpen.value = false;
      // Tolak bukti: status pesanan menjadi cancelled
      runStatusChange({ status: 'cancelled' });
    };

    // Modal konfirmasi
    const askStage = () => {
      if (!stageButton.value) return;
      confirmModal.value = {
        title: 'Konfirmasi Tahapan',
        message: `Apakah anda yakin akan mengubah status pesanan ini menjadi "${stageButton.value.label}"?`,
        action: 'stage'
      };
    };

    const askCancel = () => {
      confirmModal.value = {
        title: 'Batalkan Pesanan',
        message: `Apakah anda yakin akan menghapus data ini "${order.value?.id}"? Status pesanan akan menjadi cancelled.`,
        action: 'cancel'
      };
    };

    const askApprove = () => {
      confirmModal.value = {
        title: 'Konfirmasi Pembayaran',
        message: `Apakah anda yakin akan menerima pembayaran pesanan "${order.value?.id}"? Status pembayaran menjadi paid dan status pesanan menjadi preparing.`,
        action: 'approve'
      };
    };

    const askReject = () => {
      confirmModal.value = {
        title: 'Tolak Pesanan',
        message: `Apakah anda yakin akan menolak bukti transfer pesanan "${order.value?.id}"? Status pesanan akan menjadi cancelled.`,
        action: 'reject'
      };
    };

    const executeConfirm = () => {
      switch (confirmModal.value?.action) {
        case 'stage': confirmStage(); break;
        case 'cancel': confirmCancel(); break;
        case 'approve': confirmApprove(); break;
        case 'reject': confirmReject(); break;
        default: confirmModal.value = null;
      }
    };

    return { order, isPrintOpen, isProofViewerOpen, isSubmitting, confirmModal, statusSteps, isCancelled, currentStatus, currentStepIndex, paymentStatus, showPaymentActions, stageButton, canAct, askStage, askCancel, askApprove, askReject, executeConfirm, handleImgError, loadOrder };
  }
};
