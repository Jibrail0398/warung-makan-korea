import { ref, reactive, computed, onMounted } from 'vue';
import NoticeModal from '../../../components/common/NoticeModal/NoticeModal.vue';
import { useNoticeModal } from '../../../composables/useNoticeModal.js';
import { usersService } from '../../../services/usersService.js';
import './SuperAdminManagementView.css';

const ROLE_LABELS = {
  superadmin: 'Superadmin',
  admin: 'Admin',
  member: 'Member',
};

export default {
  name: 'SuperAdminManagementView',
  components: { NoticeModal },
  setup() {
    const users = ref([]);
    const isPageLoading = ref(false);
    const pagination = reactive({
      currentPage: 1,
      lastPage: 1,
      total: 0,
      perPage: 0,
    });

    const isModalOpen = ref(false);
    const isEditMode = ref(false);
    const isSaving = ref(false);
    const selectedUser = ref(null);

    const formData = reactive({
      name: '',
      phone_number: '',
      role: 'admin',
    });

    const formErrors = reactive({
      name: '',
      phone_number: '',
    });

    const userToDelete = ref(null);
    const isDeleting = ref(false);

    const { isNoticeVisible, noticeType, noticeTitle, noticeMessage, noticeDetail, noticeConfirmText, showSuccess, showFailed, hideNotice } = useNoticeModal();

    const loadData = async (page = 1) => {
      isPageLoading.value = true;
      try {
        const result = await usersService.getUsers(page);
        users.value = result.users;
        pagination.currentPage = result.pagination.currentPage;
        pagination.lastPage = result.pagination.lastPage;
        pagination.total = result.pagination.total;
        pagination.perPage = result.pagination.perPage;
      } catch (error) {
        users.value = [];
        showFailed({ title: 'Gagal Memuat Data', message: error.message || 'Gagal mengambil daftar pengguna.', confirmText: 'Tutup' });
      } finally {
        isPageLoading.value = false;
      }
    };

    const getPageNumbers = computed(() => {
      const pages = [];
      const start = Math.max(1, pagination.currentPage - 2);
      const end = Math.min(pagination.lastPage, pagination.currentPage + 2);
      for (let i = start; i <= end; i += 1) pages.push(i);
      return pages;
    });

    const changePage = (page) => {
      if (page < 1 || page > pagination.lastPage || page === pagination.currentPage || isPageLoading.value) return;
      loadData(page);
    };

    onMounted(() => {
      loadData();
    });

    const roleLabel = (role) => ROLE_LABELS[role] || role || '-';

    const formatDate = (value) => {
      if (!value) return '-';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return '-';
      return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const clearFormErrors = () => {
      formErrors.name = '';
      formErrors.phone_number = '';
    };

    const resetForm = () => {
      formData.name = '';
      formData.phone_number = '';
      formData.role = 'admin';
      clearFormErrors();
    };

    const openAddModal = () => {
      isEditMode.value = false;
      selectedUser.value = null;
      resetForm();
      isModalOpen.value = true;
    };

    const openEditModal = async (user) => {
      isEditMode.value = true;
      selectedUser.value = { ...user };
      // Isi form dengan data sebelumnya agar tidak terhapus.
      formData.name = user.name || '';
      formData.phone_number = user.phone_number || '';
      formData.role = 'admin';
      clearFormErrors();
      isModalOpen.value = true;

      // Ambil detail terbaru dari endpoint GET /users/{user}.
      try {
        const response = await usersService.getUser(user.id);
        const detail = response?.data;
        if (detail) {
          selectedUser.value = detail;
          formData.name = detail.name || '';
          formData.phone_number = detail.phone_number || '';
          formData.role = 'admin';
        }
      } catch (error) {
        // Tetap pakai data baris tabel bila detail gagal dimuat.
      }
    };

    const closeFormModal = () => {
      if (isSaving.value) return;
      isModalOpen.value = false;
    };

    const validateForm = () => {
      clearFormErrors();
      let isValid = true;

      if (!formData.name.trim()) {
        formErrors.name = 'Nama lengkap wajib diisi.';
        isValid = false;
      }

      if (!formData.phone_number.trim()) {
        formErrors.phone_number = 'Nomor telepon wajib diisi.';
        isValid = false;
      }

      return isValid;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      isSaving.value = true;
      // Halaman ini dikhususkan untuk admin, jadi role selalu "admin".
      const payload = {
        name: formData.name.trim(),
        phone_number: formData.phone_number.trim(),
        role: 'admin',
      };

      try {
        const response = isEditMode.value && selectedUser.value
          ? await usersService.updateUser(selectedUser.value.id, payload)
          : await usersService.createUser(payload);

        isModalOpen.value = false;
        await loadData(isEditMode.value ? pagination.currentPage : 1);

        showSuccess({
          title: isEditMode.value ? 'Akun Berhasil Diperbarui' : 'Akun Berhasil Dibuat',
          message: response?.message || (isEditMode.value ? 'Data akun berhasil diperbarui.' : 'Akun baru berhasil ditambahkan.'),
          confirmText: 'Selesai',
        });
      } catch (error) {
        showFailed({
          title: isEditMode.value ? 'Gagal Memperbarui Akun' : 'Gagal Menambahkan Akun',
          message: error.message || 'Terjadi kesalahan saat menyimpan data.',
          confirmText: 'Tutup',
        });
      } finally {
        isSaving.value = false;
      }
    };

    const confirmDelete = (user) => {
      userToDelete.value = user;
    };

    const cancelDelete = () => {
      if (isDeleting.value) return;
      userToDelete.value = null;
    };

    const executeDelete = async () => {
      if (!userToDelete.value) return;

      isDeleting.value = true;
      const target = userToDelete.value;

      try {
        const response = await usersService.deleteUser(target.id);
        userToDelete.value = null;

        // Jika halaman terakhir menjadi kosong, mundur satu halaman.
        const nextPage = users.value.length === 1 && pagination.currentPage > 1
          ? pagination.currentPage - 1
          : pagination.currentPage;
        await loadData(nextPage);

        showSuccess({
          title: 'Akun Berhasil Dihapus',
          message: response?.message || `Data ${target.name} berhasil dihapus.`,
          confirmText: 'Selesai',
        });
      } catch (error) {
        userToDelete.value = null;
        showFailed({
          title: 'Gagal Menghapus Akun',
          message: error.message || 'Terjadi kesalahan saat menghapus data.',
          confirmText: 'Tutup',
        });
      } finally {
        isDeleting.value = false;
      }
    };

    return {
      users,
      isPageLoading,
      pagination,
      getPageNumbers,
      changePage,
      isModalOpen,
      isEditMode,
      isSaving,
      formData,
      formErrors,
      userToDelete,
      isDeleting,
      isNoticeVisible,
      noticeType,
      noticeTitle,
      noticeMessage,
      noticeDetail,
      noticeConfirmText,
      hideNotice,
      roleLabel,
      formatDate,
      openAddModal,
      openEditModal,
      closeFormModal,
      handleSubmit,
      confirmDelete,
      cancelDelete,
      executeDelete,
    };
  },
};
