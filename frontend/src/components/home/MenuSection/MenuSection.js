import { watch } from 'vue';
import { useCartStore } from '../../../stores/cart.js';

export default {
  name: 'MenuSection',
  props: {
    products: {
      type: Array,
      default: () => []
    },
    currentCategory: {
      type: String,
      default: 'all'
    },
    availableSubcategories: {
      type: Array,
      default: () => []
    },
    currentSubcategory: {
      type: [String, Number],
      default: 'all'
    },
    searchQuery: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    currentPage: {
      type: Number,
      default: 1
    },
    lastPage: {
      type: Number,
      default: 1
    }
  },
  emits: [
    'update:searchQuery',
    'selectCategory',
    'update:currentSubcategory',
    'changePage',
    'resetFilters',
    'showToast'
  ],
  setup(props, { emit }) {
    const cartStore = useCartStore();

    function setSubcategory(subcategory) {
      emit('update:currentSubcategory', subcategory);
    }

    watch(
      () => props.products,
      (items) => cartStore.registerProducts(items),
      { immediate: true }
    );

    function navigateToProduct(id) {
      window.location.href = `/products/${id}`;
    }

    function handleIncrease(product) {
      const currentQty = cartStore.getQuantity(product.id);
      cartStore.increaseQuantity(product);
      emit(
        'showToast',
        currentQty === 0
          ? `${product.name} berhasil ditambahkan`
          : `${product.name} jumlahnya bertambah`
      );
    }

    function handleDecrease(product) {
      const currentQty = cartStore.getQuantity(product.id);
      cartStore.decreaseQuantity(product);
      if (currentQty <= 1) {
        emit('showToast', `${product.name} dihapus dari keranjang`);
      } else {
        emit('showToast', `${product.name} jumlahnya berkurang`);
      }
    }

    return {
      cartStore,
      setSubcategory,
      navigateToProduct,
      handleIncrease,
      handleDecrease
    };
  }
};
