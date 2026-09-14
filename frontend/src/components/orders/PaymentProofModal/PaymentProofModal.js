import { ref, computed } from 'vue';
import './PaymentProofModal.css';

export default {
  name: 'PaymentProofModal',
  props: { order: { type: Object, default: () => ({}) } },
  emits: ['download', 'print'],
  setup(props) {
    const showModal = ref(false);
    const hasProof = computed(() => Boolean(props.order.paymentProof));
    const proofImage = computed(() => props.order.paymentProof || 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=900');
    return { showModal, hasProof, proofImage };
  }
};
