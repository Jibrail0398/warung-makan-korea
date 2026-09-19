import { ref, computed, onMounted, watch } from 'vue';
import AppHeader from '../../../components/layout/AppHeader/AppHeader.vue';
import AppFooter from '../../../components/layout/AppFooter/AppFooter.vue';
import HeroSection from '../../../components/home/HeroSection/HeroSection.vue';
import PromoSection from '../../../components/home/PromoSection/PromoSection.vue';
import MenuSection from '../../../components/home/MenuSection/MenuSection.vue';
import AboutSection from '../../../components/home/AboutSection/AboutSection.vue';
import ToastNotification from '../../../components/common/ToastNotification/ToastNotification.vue';
import { productService } from '../../../services/productsService.js';
import { categoriesService } from '../../../services/categoriesService.js';
import { useToast } from '../../../composables/useToast.js';

export default {
  name: 'HomeView',
  components: { AppHeader, AppFooter, HeroSection, PromoSection, MenuSection, AboutSection, ToastNotification },
  setup() {
    const allProducts = ref([]);
    const subcategories = ref([]);
    const currentCategory = ref('');
    const currentSubcategory = ref(null);
    const searchQuery = ref('');
    const isLoading = ref(false);
    const pagination = ref({ currentPage: 1, lastPage: 1, total: 0, perPage: 0 });
    const { isToastVisible, toastMessage, showToast } = useToast();

    const availableSubcategories = computed(() => subcategories.value);

    // Menentukan kategori awal secara dinamis dari data kategori CRUD tanpa hardcode
    function resolveDefaultCategory(cats) {
      if (!Array.isArray(cats) || cats.length === 0) return null;
      const target = cats.find(c => {
        const name = (c.name || '').toLowerCase().trim();
        const slug = (c.slug || '').toLowerCase().trim();
        return name === 'menu restoran' || slug === 'menu-restoran' || name.includes('menu restoran') || slug.includes('menu-restoran');
      });
      return target ? target.id : cats[0].id;
    }

    const filteredProducts = computed(() => {
      const query = searchQuery.value.trim().toLowerCase();
      return allProducts.value.filter(product => {
        const subcategoryMatch = !currentSubcategory.value || currentSubcategory.value === 'all' || String(product.categoryId) === String(currentSubcategory.value);
        const searchMatch = !query || (product.name + ' ' + (product.description || '')).toLowerCase().includes(query);
        return subcategoryMatch && searchMatch;
      });
    });

    async function loadProducts(page = 1) {
      isLoading.value = true;
      try {
        const filters = {};
        if (currentSubcategory.value && currentSubcategory.value !== 'all') {
          filters.categoryId = currentSubcategory.value;
        }
        if (searchQuery.value.trim()) {
          filters.search = searchQuery.value.trim();
        }
        const result = await productService.getProducts(page, filters);
        allProducts.value = result.products;
        pagination.value = result.pagination;
      } catch (error) {
        allProducts.value = [];
        showToast(error.message || 'Gagal memuat produk');
      } finally {
        isLoading.value = false;
      }
    }

    function setCategory(category) {
      currentCategory.value = category;
      loadProducts(1);
    }

    function setSubcategory(subcategory) {
      currentSubcategory.value = subcategory;
      loadProducts(1);
    }

    function resetFilters() {
      searchQuery.value = '';
      currentSubcategory.value = resolveDefaultCategory(subcategories.value);
      loadProducts(1);
    }

    let searchDebounceTimer = null;
    watch(searchQuery, () => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        loadProducts(1);
      }, 350);
    });

    onMounted(async () => {
      try {
        const cats = await categoriesService.getCategories();
        subcategories.value = cats || [];
        const defaultCatId = resolveDefaultCategory(subcategories.value);
        if (defaultCatId !== null) {
          currentSubcategory.value = defaultCatId;
        }
      } catch (e) {
        subcategories.value = [];
      }
      await loadProducts(1);
    });

    return {
      allProducts,
      subcategories,
      currentCategory,
      currentSubcategory,
      searchQuery,
      isLoading,
      pagination,
      isToastVisible,
      toastMessage,
      showToast,
      availableSubcategories,
      filteredProducts,
      setCategory,
      setSubcategory,
      resetFilters,
      loadProducts
    };
  }
};
