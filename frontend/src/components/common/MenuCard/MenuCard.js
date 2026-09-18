import { computed } from 'vue';
import QuantityControl from '../QuantityControl/QuantityControl.vue';
import { ResolveImageUrl } from '../../../composables/Image.js';
import './MenuCard.css';

export default {
  name: 'MenuCard',
  components: { QuantityControl },
  props: { product: { type: Object, required: true }, quantity: { type: Number, default: 0 } },
  emits: ['select', 'increase', 'decrease'],
  setup(props) {
    const categoryDisplayName = computed(() => {
      if (props.product?.categoryName) return props.product.categoryName;
      if (typeof props.product?.category === 'object' && props.product.category?.name) return props.product.category.name;
      if (typeof props.product?.category === 'string' && props.product.category && props.product.category !== 'restaurant' && props.product.category !== 'raw') {
        return props.product.category;
      }
      return '';
    });

    return { ResolveImageUrl, categoryDisplayName };
  }
};
