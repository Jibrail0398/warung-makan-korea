import { ref, onMounted } from 'vue';
import MainCategoryModal from '../../../components/admin/MainCategoryModal.vue';
import { categoriesService } from '../../../services/categoriesService.js';
import './AdminMainCategories.css';

export default {
  name: 'AdminMainCategoriesView',
  components: {
    MainCategoryModal
  },
  setup() {
    const mainCategories = ref([]);

    const isModalOpen = ref(false);
    const isEditMode = ref(false);
    const selectedCategory = ref(null);
    const categoryToDelete = ref(null);

    const loadData = async () => {
      try {
        const categories = await categoriesService.getCategories();
        mainCategories.value = categories;
      } catch (error) {
        console.error(error);
        mainCategories.value = [];
      }
    };

    onMounted(() => {
      loadData();
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
        mainCategories.value.push({ id: Date.now(), ...catData, slug: catData.name.toLowerCase().replace(/\s+/g, '-') });
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
      isModalOpen,
      isEditMode,
      selectedCategory,
      categoryToDelete,
      openAddModal,
      openEditModal,
      handleSaveMainCategory,
      confirmDelete,
      executeDelete
    };
  }
};
