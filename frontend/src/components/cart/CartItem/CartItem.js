import { useCartStore } from '../../../stores/cart.js';
import QuantityControl from '../../common/QuantityControl/QuantityControl.vue';
import { ResolveImageUrl } from '../../../composables/Image.js';
import './CartItem.css';

export default {
  name: 'CartItem',
  components: { QuantityControl },
  props: { item: { type: Object, required: true } },
  setup() {
    const cartStore = useCartStore();
    return { cartStore, ResolveImageUrl };
  }
};
