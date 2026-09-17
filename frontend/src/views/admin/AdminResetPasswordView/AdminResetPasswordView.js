import { ref, reactive } from 'vue';
import './AdminResetPasswordView.css';

export default {
  name: 'AdminResetPasswordView',
  setup() {
    const currentPassword = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');
    const isSubmitting = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');

    const formErrors = reactive({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const clearFormErrors = () => {
      formErrors.currentPassword = '';
      formErrors.newPassword = '';
      formErrors.confirmPassword = '';
    };

    const validateForm = () => {
      clearFormErrors();
      let isValid = true;
      if (!currentPassword.value) {
        formErrors.currentPassword = 'Kata sandi saat ini wajib diisi.';
        isValid = false;
      }
      if (!newPassword.value) {
        formErrors.newPassword = 'Kata sandi baru wajib diisi.';
        isValid = false;
      } else if (newPassword.value.length < 6) {
        formErrors.newPassword = 'Kata sandi baru minimal 6 karakter.';
        isValid = false;
      }
      if (!confirmPassword.value) {
        formErrors.confirmPassword = 'Konfirmasi kata sandi baru wajib diisi.';
        isValid = false;
      } else if (newPassword.value !== confirmPassword.value) {
        formErrors.confirmPassword = 'Konfirmasi kata sandi baru tidak cocok.';
        isValid = false;
      }
      return isValid;
    };

    const handleResetPassword = async () => {
      successMessage.value = '';
      errorMessage.value = '';
      if (!validateForm()) return;

      isSubmitting.value = true;
      try {
        await new Promise(r => setTimeout(r, 500));
        errorMessage.value = 'Fitur reset password belum tersedia. Silakan hubungi administrator.';
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      currentPassword,
      newPassword,
      confirmPassword,
      formErrors,
      clearFormErrors,
      isSubmitting,
      successMessage,
      errorMessage,
      handleResetPassword
    };
  }
};
