import AppHeader from '../../../components/layout/AppHeader.vue';
import AppFooter from '../../../components/layout/AppFooter.vue';
import CartItem from '../../../components/cart/CartItem/CartItem.vue';
import CartSummary from '../../../components/cart/CartSummary/CartSummary.vue';
import ToastNotification from '../../../components/common/ToastNotification.vue';
import { useCartStore } from '../../../stores/cart.js';
import { useToast } from '../../../composables/useToast.js';
import './CartView.css';

export default {
  name: 'CartView',
  components: { AppHeader, AppFooter, CartItem, CartSummary, ToastNotification },
  setup() {
    const cartStore = useCartStore();
    const { isToastVisible, toastMessage, toastType, showToast } = useToast();
    return { cartStore, isToastVisible, toastMessage, toastType, showToast };
  }
};
