import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import StatusBadge from '../../../components/admin/StatusBadge.vue';
import PrintableReceipt from '../../../components/admin/PrintableReceipt.vue';
import PaymentProofViewer from '../../../components/admin/PaymentProofViewer.vue';
import './AdminOrderDetailView.css';

export default {
  name: 'AdminOrderDetailView',
  components: { StatusBadge, PrintableReceipt, PaymentProofViewer },
  setup() {
    const route = useRoute();
    const order = ref(null);
    const isPrintOpen = ref(false);
    const isProofViewerOpen = ref(false);
    const statusSteps = [
      { key: 'verification', label: 'Verifikasi' },
      { key: 'processing', label: 'Diproses' },
      { key: 'ready', label: 'Siap' },
      { key: 'completed', label: 'Selesai' }
    ];

    const loadOrder = async () => {
      const id = route.params.id;
      order.value = {
        id: id || 'WN-10230', orderNumber: `#${id || 'WN-10230'}`, date: '2026-08-27', time: '17:35',
        customer: { name: 'Andi Pratama', phone: '+82 10 9988 7766' }, orderType: 'Takeaway',
        note: 'Bungkus rapi, pisahkan kuah.', status: 'Payment Verification', paymentMethod: 'Bank Transfer',
        paymentStatus: 'Waiting Verification',
        paymentProof: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=900',
        items: [{ id: 2, name: 'Rendang', price: 15000, quantity: 1, subtotal: 15000, category: 'restaurant' }],
        total: 15000
      };
    };

    onMounted(() => { loadOrder(); });

    const isCancelled = computed(() => (order.value?.status || '').toLowerCase() === 'cancelled');
    const currentStepIndex = computed(() => {
      const s = (order.value?.status || '').toLowerCase();
      if (s === 'completed' || s === 'selesai') return 3;
      if (s === 'ready' || s === 'siap') return 2;
      if (s === 'processing' || s === 'diproses' || s === 'in progress') return 1;
      return 0;
    });

    const changeStatus = async (newStatus) => {
      if (!order.value) return;
      await new Promise(r => setTimeout(r, 300));
      order.value = { ...order.value, status: newStatus };
    };

    const handleVerifyProof = async (isApproved) => {
      if (!order.value) return;
      await new Promise(r => setTimeout(r, 300));
      order.value = { ...order.value, paymentStatus: isApproved ? 'Verified' : 'Rejected' };
      isProofViewerOpen.value = false;
    };

    return { order, isPrintOpen, isProofViewerOpen, statusSteps, isCancelled, currentStepIndex, changeStatus, handleVerifyProof };
  }
};
