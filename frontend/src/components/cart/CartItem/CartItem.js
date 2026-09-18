import { computed } from 'vue';
import { useCartStore } from '../../../stores/cart.js';
import QuantityControl from '../../common/QuantityControl/QuantityControl.vue';
import { ResolveImageUrl } from '../../../composables/Image.js';
import './CartItem.css';

export default {
  name: 'CartItem',
  components: { QuantityControl },
  props: { item: { type: Object, required: true } },
  setup(props) {
    const cartStore = useCartStore();

    const categoryDisplayName = computed(() => {
      if (props.item?.categoryName) return props.item.categoryName;
      if (typeof props.item?.category === 'object' && props.item.category?.name) return props.item.category.name;
      if (typeof props.item?.category === 'string' && props.item.category && props.item.category !== 'restaurant' && props.item.category !== 'raw') {
        return props.item.category;
      }
      return '';
    });

    return { cartStore, ResolveImageUrl, categoryDisplayName };
  }
};
