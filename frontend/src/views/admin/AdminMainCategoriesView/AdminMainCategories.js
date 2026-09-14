import { ref, computed, onMounted } from 'vue';
import MainCategoryModal from '../../../components/admin/MainCategoryModal.vue';
import './AdminMainCategories.css';

export default {
  name: 'AdminMainCategoriesView',
  components: {
    MainCategoryModal
  },
  setup() {
    const mainCategories = ref([]);
    const subcategories = ref([]);
    const products = ref([]);

    const isModalOpen = ref(false);
    const isEditMode = ref(false);
    const selectedCategory = ref(null);
    const categoryToDelete = ref(null);

    const loadData = async () => {
      mainCategories.value = [
        { id: 1, name: 'Restaurant Menu', code: 'restaurant', description: 'Menu makanan siap santap untuk pelanggan restoran.' },
        { id: 2, name: 'Raw Material', code: 'raw', description: 'Bahan mentah dan bahan baku dapur.' }
      ];
      subcategories.value = [];
      products.value = [];
    };

    onMounted(() => {
      loadData();
    });

    const getSubcategoriesFor = (mainCatId) => {
      return subcategories.value.filter(sc => Number(sc.mainCategoryId) === Number(mainCatId));
    };

    const mainCategoriesWithCounts = computed(() => {
      return mainCategories.value.map(mc => {
        const subcats = subcategories.value.filter(sc => Number(sc.mainCategoryId) === Number(mc.id));
        const prodCount = products.value.filter(p => {
          if (p.mainCategoryId) return Number(p.mainCategoryId) === Number(mc.id);
          return mc.id === 1 ? p.category === 'restaurant' : p.category === 'raw';
        }).length;

        return {
          ...mc,
          subcategoryCount: subcats.length,
          productCount: prodCount
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

    const handleSaveMainCategory = async (catData) => {
      if (isEditMode.value && selectedCategory.value) {
        const idx = mainCategories.value.findIndex(mc => mc.id === selectedCategory.value.id);
        if (idx !== -1) {
          mainCategories.value[idx] = { ...mainCategories.value[idx], ...catData };
        }
      } else {
        mainCategories.value.push({ id: Date.now(), ...catData });
      }
      isModalOpen.value = false;
    };

    const confirmDelete = (cat) => {
      categoryToDelete.value = cat;
    };

    const executeDelete = async () => {
      if (!categoryToDelete.value) return;
      mainCategories.value = mainCategories.value.filter(mc => mc.id !== categoryToDelete.value.id);
      categoryToDelete.value = null;
    };

    return {
      mainCategories,
      subcategories,
      products,
      isModalOpen,
      isEditMode,
      selectedCategory,
      categoryToDelete,
      getSubcategoriesFor,
      mainCategoriesWithCounts,
      openAddModal,
      openEditModal,
      handleSaveMainCategory,
      confirmDelete,
      executeDelete
    };
  }
};
