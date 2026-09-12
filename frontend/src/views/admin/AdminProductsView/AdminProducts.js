import { ref, computed, onMounted } from 'vue';
import ProductModal from '../../../components/admin/ProductModal.vue';
import "./AdminProducts.css"

export default {
  name: 'AdminProductsView',
  components: {
    ProductModal
  },
  setup() {
    const products = ref([]);
    const mainCategories = ref([]);
    const categories = ref([]);

    const selectedTab = ref('all');
    const selectedSubcatFilter = ref('all');
    const searchQuery = ref('');
    const statusFilter = ref('all');

    const isModalOpen = ref(false);
    const isEditMode = ref(false);
    const selectedProduct = ref(null);
    const productToDelete = ref(null);

    const loadData = async () => {
      try {
        products.value = [];
        mainCategories.value = [];
        categories.value = [];
      } catch (err) {
        console.error('Failed to load products data:', err);
      }
    };

    onMounted(() => {
      loadData();
    });

    const countByType = (type) => {
      return products.value.filter(p => {
        if (p.mainCategoryId) return type === 'restaurant' ? p.mainCategoryId === 1 : p.mainCategoryId === 2;
        return p.category === type;
      }).length;
    };

    const availableSubcategories = computed(() => {
      if (selectedTab.value === 'all') return categories.value;
      const targetMainId = selectedTab.value === 'restaurant' ? 1 : 2;
      return categories.value.filter(sc => {
        if (sc.mainCategoryId) return Number(sc.mainCategoryId) === targetMainId;
        return selectedTab.value === 'restaurant' ? sc.type === 'restaurant' : sc.type === 'raw';
      });
    });

    const getSubcatName = (subcatId) => {
      const found = categories.value.find(c => Number(c.id) === Number(subcatId));
      return found?.name || 'General';
    };

    const filteredProducts = computed(() => {
      return products.value.filter(product => {
        // Kategori Besar Tab Filter
        let tabMatch = selectedTab.value === 'all';
        if (!tabMatch) {
          if (selectedTab.value === 'restaurant') {
            tabMatch = product.category === 'restaurant' || product.mainCategoryId === 1;
          } else if (selectedTab.value === 'raw') {
            tabMatch = product.category === 'raw' || product.mainCategoryId === 2;
          }
        }

        // Subkategori Dropdown Filter
        let subcatMatch = selectedSubcatFilter.value === 'all';
        if (!subcatMatch) {
          subcatMatch = String(product.subcategoryId || product.categoryId) === String(selectedSubcatFilter.value);
        }

        // Search query
        const q = searchQuery.value.trim().toLowerCase();
        const searchMatch = !q || (product.name + ' ' + (product.description || '')).toLowerCase().includes(q);

        // Status filter
        const statusMatch = statusFilter.value === 'all' || product.status === statusFilter.value;

        return tabMatch && subcatMatch && searchMatch && statusMatch;
      });
    });

    const openAddModal = () => {
      isEditMode.value = false;
      selectedProduct.value = null;
      isModalOpen.value = true;
    };

    const openEditModal = (product) => {
      isEditMode.value = true;
      selectedProduct.value = { ...product };
      isModalOpen.value = true;
    };

    const handleSaveProduct = async (productData) => {
      if (isEditMode.value && selectedProduct.value) {
        await new Promise(r => setTimeout(r, 300));
      } else {
        await new Promise(r => setTimeout(r, 300));
      }
      isModalOpen.value = false;
      await loadData();
    };

    const toggleStatus = async (product) => {
      await new Promise(r => setTimeout(r, 300));
      await loadData();
    };

    const confirmDelete = (product) => {
      productToDelete.value = product;
    };

    const executeDelete = async () => {
      if (!productToDelete.value) return;
      await new Promise(r => setTimeout(r, 300));
      productToDelete.value = null;
      await loadData();
    };

    const handleImgError = (event) => {
      event.target.src = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600';
    };

    return {
      products,
      mainCategories,
      categories,
      selectedTab,
      selectedSubcatFilter,
      searchQuery,
      statusFilter,
      isModalOpen,
      isEditMode,
      selectedProduct,
      productToDelete,
      countByType,
      availableSubcategories,
      getSubcatName,
      filteredProducts,
      openAddModal,
      openEditModal,
      handleSaveProduct,
      toggleStatus,
      confirmDelete,
      executeDelete,
      handleImgError
    };
  }
};
