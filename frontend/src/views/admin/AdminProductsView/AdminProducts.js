import { ref, computed, onMounted, reactive, watch } from 'vue';
import ProductModal from '../../../components/admin/ProductModal/ProductModal.vue';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner.vue';
import { productService } from '../../../services/productsService.js';
import "./AdminProducts.css"

export default {
  name: 'AdminProductsView',
  components: {
    ProductModal,
    LoadingSpinner
  },
  setup() {
    const products = ref([]);
    const categories = ref([]);

    const selectedTab = ref('all');
    const selectedSubcatFilter = ref('all');
    const searchQuery = ref('');
    const statusFilter = ref('all');

    const isModalOpen = ref(false);
    const isEditMode = ref(false);
    const selectedProduct = ref(null);
    const productToDelete = ref(null);

    const notificationModal = reactive({
      isOpen: false,
      isSuccess: true,
      message: ''
    });

    const pagination = reactive({
      currentPage: 1,
      lastPage: 1,
      total: 0,
      perPage: 0
    });

    const isPageLoading = ref(false);

    const loadData = async (page = 1) => {
      isPageLoading.value = true;
      try {
        const result = await productService.getAdminProducts(page, {
          search: searchQuery.value,
          categoryId: selectedSubcatFilter.value,
          status: statusFilter.value
        });
        products.value = result.products;
        pagination.currentPage = result.pagination.currentPage;
        pagination.lastPage = result.pagination.lastPage;
        pagination.total = result.pagination.total;
        pagination.perPage = result.pagination.perPage;
      } catch (err) {
        console.error('Failed to load products data:', err);
      } finally {
        isPageLoading.value = false;
      }
    };

    const changePage = (page) => {
      if (page < 1 || page > pagination.lastPage || page === pagination.currentPage || isPageLoading.value) return;
      loadData(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getPageNumbers = computed(() => {
      const pages = [];
      const start = Math.max(1, pagination.currentPage - 2);
      const end = Math.min(pagination.lastPage, pagination.currentPage + 2);
      for (let i = start; i <= end; i++) pages.push(i);
      return pages;
    });

    const loadCategories = async () => {
      try {
        categories.value = await productService.getCategories();
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };

    onMounted(() => {
      loadData();
      loadCategories();
    });

    const availableSubcategories = computed(() => categories.value);

    // Filter dikirim ke backend (server-side), bukan difilter di frontend
    watch([selectedSubcatFilter, statusFilter], () => {
      loadData(1);
    });

    let searchDebounceTimer = null;
    watch(searchQuery, () => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        loadData(1);
      }, 400);
    });

    const isSaving = ref(false);
    const isDeleting = ref(false);

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

    const handleSaveProduct = async (formData) => {
      isSaving.value = true;
      try {
        let res;
        if (isEditMode.value && selectedProduct.value) {
          res = await productService.updateProduct(selectedProduct.value.id, formData);
        } else {
          res = await productService.addProduct(formData);
        }
        notificationModal.isSuccess = true;
        notificationModal.message = res?.message || (isEditMode.value ? 'Produk berhasil diperbarui' : 'Produk berhasil ditambahkan');
        notificationModal.isOpen = true;
        isModalOpen.value = false;
        await loadData();
      } catch (err) {
        notificationModal.isSuccess = false;
        notificationModal.message = err.message || 'Gagal menyimpan produk';
        notificationModal.isOpen = true;
      } finally {
        isSaving.value = false;
      }
    };

    const closeNotification = () => {
      notificationModal.isOpen = false;
    };

    const toggleStatus = async (product) => {
      await new Promise(r => setTimeout(r, 300));
      await loadData();
    };

    const confirmDelete = (product) => {
      productToDelete.value = product;
    };

    const executeDelete = async () => {
      if (!productToDelete.value || isDeleting.value) return;
      isDeleting.value = true;
      try {
        const res = await productService.deleteProduct(productToDelete.value.id);
        notificationModal.isSuccess = true;
        notificationModal.message = res?.message || 'Produk berhasil dihapus';
        notificationModal.isOpen = true;
        productToDelete.value = null;
        await loadData();
      } catch (err) {
        notificationModal.isSuccess = false;
        notificationModal.message = err.message || 'Gagal menghapus produk';
        notificationModal.isOpen = true;
      } finally {
        isDeleting.value = false;
      }
    };

    const handleImgError = (event) => {
      event.target.src = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600';
    };

    return {
      products,
      categories,
      selectedTab,
      selectedSubcatFilter,
      searchQuery,
      statusFilter,
      isModalOpen,
      isEditMode,
      isSaving,
      isDeleting,
      selectedProduct,
      productToDelete,
      notificationModal,
      pagination,
      isPageLoading,
      getPageNumbers,
      changePage,
      availableSubcategories,
      openAddModal,
      openEditModal,
      handleSaveProduct,
      closeNotification,
      toggleStatus,
      confirmDelete,
      executeDelete,
      handleImgError
    };
  }
};
