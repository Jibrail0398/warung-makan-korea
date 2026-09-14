import { ref, computed, onMounted, watch } from 'vue';
import { useCartStore } from '../../../stores/cart.js';
import { categoriesService } from '../../../services/categoriesService.js';

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

    // Kategori yang diambil langsung dari API (GET /api/categories)
    const apiCategories = ref([]);

    // Gabungkan: prioritaskan data dari API, fallback ke prop dari parent
    const categoryList = computed(() => {
      if (apiCategories.value.length > 0) {
        return apiCategories.value;
      }
      return props.availableSubcategories;
    });

    async function loadCategories() {
      try {
        const categories = await categoriesService.getCategories();
        apiCategories.value = categories || [];
        console.log( `Isi categories pada menusection:${JSON.stringify(categories)}`)
      } catch (error) {
        // Jika API gagal, tetap gunakan prop dari parent
        apiCategories.value = [];
      }
    }

    onMounted(() => {
      loadCategories();
    });

    // Refetch kategori jika API berhasil dimuat ulang dari parent
    watch(() => props.availableSubcategories, () => {
      if (apiCategories.value.length === 0 && props.availableSubcategories.length > 0) {
        loadCategories();
      }
    });

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
      categoryList,
      setSubcategory,
      navigateToProduct,
      handleIncrease,
      handleDecrease
    };
  }
};
