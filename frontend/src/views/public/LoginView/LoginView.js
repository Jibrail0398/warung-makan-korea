import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AuthLayout from '../../../components/auth/AuthLayout/AuthLayout.vue';
import AuthInput from '../../../components/auth/AuthInput/AuthInput.vue';
import AuthButton from '../../../components/auth/AuthButton/AuthButton.vue';
import AuthDivider from '../../../components/auth/AuthDivider/AuthDivider.vue';
import { authService } from '../../../services/authService.js';
import './LoginView.css';

export default {
  name: 'LoginView',
  components: { AuthLayout, AuthInput, AuthButton, AuthDivider },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const identifier = ref('');
    const password = ref('');
    const isLoading = ref(false);
    const errorMessage = ref(route.query.message || '');
    const identifierError = ref('');
    const passwordError = ref('');
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
          alert('Login berhasil!');
          router.push('/admin/dashboard');
          return;
        }

        router.replace({ path: '/verify-otp', state: { phone: identifier.value.trim() } });
      } catch (err) {
        errorMessage.value = err.message;
      } finally {
        isLoading.value = false;
      }
    };
    const handleForgotPassword = () => { alert('Silakan hubungi kasir atau administrator untuk reset kata sandi akun Anda.'); };
    return { identifier, password, isLoading, errorMessage, identifierError, passwordError, handleLogin, handleForgotPassword };
  }
};
