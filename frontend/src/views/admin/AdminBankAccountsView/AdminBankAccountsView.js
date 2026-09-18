import { ref, reactive, onMounted } from 'vue';
import NoticeModal from '../../../components/common/NoticeModal/NoticeModal.vue';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner.vue';
import { useNoticeModal } from '../../../composables/useNoticeModal.js';
import { bankAccountService } from '../../../services/bankAccountService.js';
import './AdminBankAccountsView.css';

export default {
  name: 'AdminBankAccountsView',
  components: { NoticeModal, LoadingSpinner },
  setup() {
    const account = ref(null);
    const isPageLoading = ref(false);

    const isModalOpen = ref(false);
    const isEditMode = ref(false);
    const isSaving = ref(false);
    const accountToDelete = ref(null);
    const accountToEdit = ref(null);
    const isDeleting = ref(false);

    const formData = reactive({
      bank_name: '',
      account_number: '',
      account_name: '',
    });

    const formErrors = reactive({
      bank_name: '',
      account_number: '',
      account_name: '',
    });

    const { isNoticeVisible, noticeType, noticeTitle, noticeMessage, noticeDetail, noticeConfirmText, showSuccess, showFailed, hideNotice } = useNoticeModal();

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

    const fillForm = (data) => {
      formData.bank_name = data?.bankName || '';
      formData.account_number = data?.accountNumber || '';
      formData.account_name = data?.accountName || '';
    };

    const clearFormErrors = () => {
      formErrors.bank_name = '';
      formErrors.account_number = '';
      formErrors.account_name = '';
    };

    const loadData = async () => {
      isPageLoading.value = true;
      try {
        const accounts = await bankAccountService.getBankAccounts({ withAuth: true });
        account.value = accounts[0] || null;
      } catch (error) {
        account.value = null;
        showFailed({ title: 'Gagal Memuat Data', message: error.message || 'Gagal mengambil data rekening bank.', confirmText: 'Tutup' });
      } finally {
        isPageLoading.value = false;
      }
    };

    onMounted(() => {
      loadData();
    });

    const openAddModal = () => {
      isEditMode.value = false;
      fillForm(null);
      clearFormErrors();
      isModalOpen.value = true;
    };

    // Konfirmasi sebelum membuka form edit.
    const confirmEdit = () => {
      accountToEdit.value = account.value;
    };

    const cancelEdit = () => {
      accountToEdit.value = null;
    };

    const executeEdit = () => {
      accountToEdit.value = null;
      isEditMode.value = true;
      fillForm(account.value);
      clearFormErrors();
      isModalOpen.value = true;
    };

    const closeFormModal = () => {
      if (isSaving.value) return;
      isModalOpen.value = false;
    };

    const validateForm = () => {
      clearFormErrors();
      let isValid = true;

      if (!formData.bank_name.trim()) {
        formErrors.bank_name = 'Nama bank wajib diisi.';
        isValid = false;
      }

      if (!formData.account_number.trim()) {
        formErrors.account_number = 'Nomor rekening wajib diisi.';
        isValid = false;
      }

      if (!formData.account_name.trim()) {
        formErrors.account_name = 'Nama pemilik rekening wajib diisi.';
        isValid = false;
      }

      return isValid;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      isSaving.value = true;
      const payload = {
        bank_name: formData.bank_name.trim(),
        account_number: formData.account_number.trim(),
        account_name: formData.account_name.trim(),
        is_active: true,
      };

      try {
        let response;
        if (isEditMode.value && account.value) {
          response = await bankAccountService.updateBankAccount(account.value.id, payload);
        } else {
          // Batasi hanya 1 akun bank: cek ulang sebelum membuat.
          const existing = await bankAccountService.getBankAccounts({ withAuth: true });
          if (existing.length > 0) {
            account.value = existing[0];
            isModalOpen.value = false;
            showFailed({
              title: 'Gagal Menambahkan Rekening',
              message: 'Hanya satu akun bank yang diizinkan. Silakan edit atau hapus rekening yang sudah ada.',
              confirmText: 'Tutup',
            });
            return;
          }
          response = await bankAccountService.createBankAccount(payload);
        }

        isModalOpen.value = false;
        await loadData();

        showSuccess({
          title: isEditMode.value ? 'Rekening Berhasil Diperbarui' : 'Rekening Berhasil Ditambahkan',
          message: response?.message || 'Data rekening bank berhasil disimpan.',
          confirmText: 'Selesai',
        });
      } catch (error) {
        showFailed({
          title: isEditMode.value ? 'Gagal Memperbarui Rekening' : 'Gagal Menambahkan Rekening',
          message: error.message || 'Terjadi kesalahan saat menyimpan data.',
          confirmText: 'Tutup',
        });
      } finally {
        isSaving.value = false;
      }
    };

    const confirmDelete = () => {
      accountToDelete.value = account.value;
    };

    const cancelDelete = () => {
      if (isDeleting.value) return;
      accountToDelete.value = null;
    };

    const executeDelete = async () => {
      if (!accountToDelete.value) return;

      isDeleting.value = true;
      const target = accountToDelete.value;

      try {
        await bankAccountService.deleteBankAccount(target.id);
        accountToDelete.value = null;
        await loadData();

        showSuccess({
          title: 'Rekening Berhasil Dihapus',
          message: `Rekening ${target.bankName} berhasil dihapus.`,
          confirmText: 'Selesai',
        });
      } catch (error) {
        accountToDelete.value = null;
        showFailed({
          title: 'Gagal Menghapus Rekening',
          message: error.message || 'Terjadi kesalahan saat menghapus data.',
          confirmText: 'Tutup',
        });
      } finally {
        isDeleting.value = false;
      }
    };

    return {
      account,
      isPageLoading,
      isModalOpen,
      isEditMode,
      isSaving,
      formData,
      formErrors,
      accountToDelete,
      accountToEdit,
      isDeleting,
      isNoticeVisible,
      noticeType,
      noticeTitle,
      noticeMessage,
      noticeDetail,
      noticeConfirmText,
      hideNotice,
      formatDate,
      openAddModal,
      confirmEdit,
      cancelEdit,
      executeEdit,
      closeFormModal,
      handleSubmit,
      confirmDelete,
      cancelDelete,
      executeDelete,
    };
  },
};
