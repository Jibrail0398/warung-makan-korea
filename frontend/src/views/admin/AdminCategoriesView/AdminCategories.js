import { ref, computed, onMounted } from 'vue';
import CategoryModal from '../../../components/admin/CategoryModal/CategoryModal.vue';
import './AdminCategories.css';

export default {
  name: 'AdminCategoriesView',
  components: {
    CategoryModal
  },
  setup() {
    const categories = ref([]);
    const mainCategories = ref([]);
    const products = ref([]);

    const selectedMainCatFilter = ref('all');
    const searchQuery = ref('');

    const isModalOpen = ref(false);
    const isEditMode = ref(false);
    const selectedCategory = ref(null);
    const categoryToDelete = ref(null);

    const loadData = async () => {
      categories.value = [];
      mainCategories.value = [];
      products.value = [];
    };

    onMounted(() => {
      loadData();
    });

    const getMainCatName = (mainCatId) => {
      const found = mainCategories.value.find(mc => Number(mc.id) === Number(mainCatId));
      if (found) return found.name;
      return Number(mainCatId) === 2 ? 'Raw Material' : 'Restaurant Menu';
    };

    const countByMainCat = (mainCatId) => {
      return categories.value.filter(c => {
        const pId = c.mainCategoryId || (c.type === 'raw' ? 2 : 1);
        return Number(pId) === Number(mainCatId);
      }).length;
    };

    const filteredCategoriesWithCount = computed(() => {
      const query = searchQuery.value.trim().toLowerCase();

      return categories.value
        .filter(cat => {
          // Main category filter
          const pId = cat.mainCategoryId || (cat.type === 'raw' ? 2 : 1);
          let matchMain = true;
          if (selectedMainCatFilter.value === 'restaurant') {
            matchMain = Number(pId) === 1;
          } else if (selectedMainCatFilter.value === 'raw') {
            matchMain = Number(pId) === 2;
          }

          // Search query
          const matchQuery = !query || 
            (cat.name + ' ' + (cat.description || '')).toLowerCase().includes(query);

          return matchMain && matchQuery;
        })
        .map(cat => {
          const count = products.value.filter(p => {
            if (p.subcategoryId) return Number(p.subcategoryId) === Number(cat.id);
            return Number(p.categoryId) === Number(cat.id);
          }).length;

          return {
            ...cat,
            productCount: count
          };
        });
    });

    const openAddModal = () => {
      isEditMode.value = false;
      selectedCategory.value = null;
      isModalOpen.value = true;
    };

    const openEditModal = (cat) => {
      isEditMode.value = true;
      selectedCategory.value = { ...cat };
      isModalOpen.value = true;
    };

    const handleSaveCategory = async (catData) => {
      if (isEditMode.value && selectedCategory.value) {
        const idx = categories.value.findIndex(c => c.id === selectedCategory.value.id);
        if (idx !== -1) {
          categories.value[idx] = { ...categories.value[idx], ...catData };
        }
      } else {
        categories.value.push({ id: Date.now(), ...catData, productCount: 0 });
      }
      isModalOpen.value = false;
    };

    const confirmDelete = (cat) => {
      categoryToDelete.value = cat;
    };

    const executeDelete = async () => {
      if (!categoryToDelete.value) return;
      categories.value = categories.value.filter(c => c.id !== categoryToDelete.value.id);
      categoryToDelete.value = null;
    };

    return {
      categories,
      mainCategories,
      products,
      selectedMainCatFilter,
      searchQuery,
      isModalOpen,
      isEditMode,
      selectedCategory,
      categoryToDelete,
      getMainCatName,
      countByMainCat,
      filteredCategoriesWithCount,
      openAddModal,
      openEditModal,
      handleSaveCategory,
      confirmDelete,
      executeDelete
    };
  }
};
