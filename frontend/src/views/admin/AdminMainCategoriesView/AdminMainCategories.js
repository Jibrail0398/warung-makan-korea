import { ref, onMounted, reactive } from 'vue';
import MainCategoryModal from '../../../components/admin/MainCategoryModal/MainCategoryModal.vue';
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
    const categoryToUpdate = ref(null);
    const pendingUpdateData = ref(null);

    const notificationModal = reactive({
      isOpen: false,
      isSuccess: true,
      message: ''
    });

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
        pendingUpdateData.value = catData;
        categoryToUpdate.value = { ...selectedCategory.value, name: catData.name };
        isModalOpen.value = false;
      } else {
        try {
          const res = await categoriesService.createCategory({ name: catData.name });
          await loadData();
          notificationModal.isSuccess = true;
          notificationModal.message = res?.message || 'Kategori berhasil dibuat';
          notificationModal.isOpen = true;
          isModalOpen.value = false;
        } catch (error) {
          notificationModal.isSuccess = false;
          notificationModal.message = error.message || 'Gagal membuat kategori';
          notificationModal.isOpen = true;
          isModalOpen.value = false;
        }
      }
    };

    const executeUpdate = async () => {
      if (!categoryToUpdate.value) return;
      try {
        await categoriesService.updateCategory(categoryToUpdate.value.id, { name: categoryToUpdate.value.name });
        await loadData();
        notificationModal.isSuccess = true;
        notificationModal.message = 'Kategori berhasil diperbarui';
        notificationModal.isOpen = true;
      } catch (error) {
        notificationModal.isSuccess = false;
        notificationModal.message = error.message || 'Gagal memperbarui kategori';
        notificationModal.isOpen = true;
      }
      categoryToUpdate.value = null;
      pendingUpdateData.value = null;
    };

    const closeNotification = () => {
      notificationModal.isOpen = false;
    };

    const confirmDelete = (cat) => {
      categoryToDelete.value = cat;
    };

    const executeDelete = async () => {
      if (!categoryToDelete.value) return;
      try {
        await categoriesService.deleteCategory(categoryToDelete.value.id);
        await loadData();
        notificationModal.isSuccess = true;
        notificationModal.message = 'Kategori berhasil dihapus';
        notificationModal.isOpen = true;
      } catch (error) {
        notificationModal.isSuccess = false;
        notificationModal.message = error.message || 'Gagal menghapus kategori';
        notificationModal.isOpen = true;
      }
      categoryToDelete.value = null;
    };

    return {
      mainCategories,
      isModalOpen,
      isEditMode,
      selectedCategory,
      categoryToDelete,
      categoryToUpdate,
      notificationModal,
      openAddModal,
      openEditModal,
      handleSaveMainCategory,
      executeUpdate,
      closeNotification,
      confirmDelete,
      executeDelete
    };
  }
};
