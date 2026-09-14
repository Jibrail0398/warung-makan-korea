import AppHeader from '../../../components/layout/AppHeader/AppHeader.vue';
import PaymentInfoCard from '../../../components/checkout/PaymentInfoCard/PaymentInfoCard.vue';
import PaymentProofUpload from '../../../components/checkout/PaymentProofUpload/PaymentProofUpload.vue';
import ToastNotification from '../../../components/common/ToastNotification/ToastNotification.vue';
import { useCartStore } from '../../../stores/cart.js';
import { useToast } from '../../../composables/useToast.js';
import { ResolveImageUrl } from '../../../composables/Image.js';
import './CheckoutView.css';

export default {
  name: 'CheckoutView',
  components: { AppHeader, PaymentInfoCard, PaymentProofUpload, ToastNotification },
  setup() {
    const cartStore = useCartStore();
    const { isToastVisible, toastMessage, showToast } = useToast();
    return { cartStore, isToastVisible, toastMessage, showToast, ResolveImageUrl };
  }
};
