import QuantityControl from '../QuantityControl/QuantityControl.vue';
import { ResolveImageUrl } from '../../../composables/Image.js';
import './MenuCard.css';

export default {
  name: 'MenuCard',
  components: { QuantityControl },
  props: { product: { type: Object, required: true }, quantity: { type: Number, default: 0 } },
  emits: ['select', 'increase', 'decrease'],
  setup() {
    return { ResolveImageUrl };
  }
};
