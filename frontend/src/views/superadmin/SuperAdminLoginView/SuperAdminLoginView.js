import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth.js';
import { authService } from '../../../services/authService.js';
import './SuperAdminLoginView.css';

export default {
  name: 'SuperAdminLoginView',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const phoneNumber = ref('');
    const password = ref('');
    const isLoading = ref(false);
    const errorMessage = ref('');
    const handleLogin = async () => { if (!phoneNumber.value.trim() || !password.value) { errorMessage.value = 'Nomor HP dan kata sandi wajib diisi.'; return; } isLoading.value = true; errorMessage.value = ''; try { const rawPhone = phoneNumber.value.replace(/\D/g, ''); await authService.login({ phone_number: rawPhone, password: password.value }); await authStore.hydrate(); router.push('/admin/dashboard'); } catch (err) { errorMessage.value = err.message || 'Autentikasi gagal.'; } finally { isLoading.value = false; } };
    return { phoneNumber, password, isLoading, errorMessage, handleLogin };
  }
};
