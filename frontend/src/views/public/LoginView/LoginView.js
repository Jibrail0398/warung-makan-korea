import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AuthLayout from '../../../components/auth/AuthLayout/AuthLayout.vue';
import AuthInput from '../../../components/auth/AuthInput/AuthInput.vue';
import AuthButton from '../../../components/auth/AuthButton/AuthButton.vue';
import AuthDivider from '../../../components/auth/AuthDivider/AuthDivider.vue';
import NoticeModal from '../../../components/common/NoticeModal/NoticeModal.vue';
import { useNoticeModal } from '../../../composables/useNoticeModal.js';
import { authService } from '../../../services/authService.js';
import './LoginView.css';

export default {
  name: 'LoginView',
  components: { AuthLayout, AuthInput, AuthButton, AuthDivider, NoticeModal },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const identifier = ref('');
    const password = ref('');
    const isLoading = ref(false);
    const errorMessage = ref(route.query.message || '');
    const identifierError = ref('');
    const passwordError = ref('');
    const { isNoticeVisible, noticeType, noticeTitle, noticeMessage, noticeDetail, noticeConfirmText, showSuccess, showFailed, hideNotice } = useNoticeModal();
    let pendingRoute = null;

    const validateForm = () => { let isValid = true; identifierError.value = ''; passwordError.value = ''; errorMessage.value = ''; if (!identifier.value.trim()) { identifierError.value = 'Nomor HP atau Username wajib diisi'; isValid = false; } if (!password.value) { passwordError.value = 'Kata sandi wajib diisi'; isValid = false; } return isValid; };

    const handleLogin = async () => {
      if (!validateForm()) return;
      isLoading.value = true;
      errorMessage.value = '';
      try {
        const response = await authService.login({ phone_number: identifier.value.trim(), password: password.value });
        const authData = response?.data;

        // Superadmin langsung mendapatkan token tanpa verifikasi OTP.
        if (authData?.access_token) {
          const encodedAuthData = await authService.encode(authData);
          localStorage.setItem('warung-auth-data', encodedAuthData);
          pendingRoute = '/admin/audit-logs';
          showSuccess({ title: 'Login Berhasil', message: 'Anda berhasil masuk. Lanjutkan untuk membuka halaman Audit Log.', confirmText: 'Lanjut ke Audit Log' });
          return;
        }

        router.replace({ path: '/verify-otp', state: { phone: identifier.value.trim() } });
      } catch (err) {
        if (err.status === 401) {
          showFailed({ title: 'Login Gagal', message: 'Nomor handphone atau password salah.', confirmText: 'Coba Lagi' });
        } else {
          showFailed({ title: 'Login Gagal', message: err.message || 'Terjadi kesalahan saat memproses login.', confirmText: 'Tutup' });
        }
      } finally {
        isLoading.value = false;
      }
    };

    const handleNoticeConfirm = () => { const target = pendingRoute; pendingRoute = null; hideNotice(); if (target) router.push(target); };
    const handleNoticeClose = () => { const target = pendingRoute; pendingRoute = null; hideNotice(); if (target) router.push(target); };

    const handleForgotPassword = () => { alert('Silakan hubungi kasir atau administrator untuk reset kata sandi akun Anda.'); };
    return { identifier, password, isLoading, errorMessage, identifierError, passwordError, isNoticeVisible, noticeType, noticeTitle, noticeMessage, noticeDetail, noticeConfirmText, handleLogin, handleNoticeConfirm, handleNoticeClose, handleForgotPassword };
  }
};
