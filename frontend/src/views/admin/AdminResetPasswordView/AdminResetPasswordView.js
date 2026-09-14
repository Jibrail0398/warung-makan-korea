import { ref } from 'vue';
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

    const handleResetPassword = async () => {
      successMessage.value = '';
      errorMessage.value = '';
      if (!currentPassword.value || !newPassword.value || !confirmPassword.value) { errorMessage.value = 'Semua field kata sandi wajib diisi.'; return; }
      if (newPassword.value.length < 6) { errorMessage.value = 'Kata sandi baru minimal 6 karakter.'; return; }
      if (newPassword.value !== confirmPassword.value) { errorMessage.value = 'Konfirmasi kata sandi baru tidak cocok.'; return; }
      isSubmitting.value = true;
      try {
        await new Promise(r => setTimeout(r, 500));
        errorMessage.value = 'Fitur reset password belum tersedia. Silakan hubungi administrator.';
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
      } finally { isSubmitting.value = false; }
    };

    return { currentPassword, newPassword, confirmPassword, isSubmitting, successMessage, errorMessage, handleResetPassword };
  }
};
