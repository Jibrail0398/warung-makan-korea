import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth.js';
import { authService } from '../../../services/authService.js';
import './AdminLoginView.css';

export default {
  name: 'AdminLoginView',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const phoneNumber = ref('');
    const password = ref('');
    const rememberMe = ref(true);
    const showPassword = ref(false);
    const isLoading = ref(false);
    const errorMessage = ref('');

    const handleLogin = async () => {
      if (!phoneNumber.value.trim() || !password.value) {
        errorMessage.value = 'Mohon isi nomor HP dan kata sandi';
        return;
      }
      isLoading.value = true;
      errorMessage.value = '';
      try {
        const rawPhone = phoneNumber.value.replace(/\D/g, '');
        await authService.login({ phone_number: rawPhone, password: password.value });
        await authStore.hydrate();
        router.push('/admin/dashboard');
      } catch (err) {
        errorMessage.value = err.message || 'Login gagal. Periksa kredensial Anda.';
      } finally {
        isLoading.value = false;
      }
    };

    return { phoneNumber, password, rememberMe, showPassword, isLoading, errorMessage, handleLogin };
  }
};
