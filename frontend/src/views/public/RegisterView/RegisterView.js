import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthLayout from '../../../components/auth/AuthLayout/AuthLayout.vue';
import AuthInput from '../../../components/auth/AuthInput/AuthInput.vue';
import AuthButton from '../../../components/auth/AuthButton/AuthButton.vue';
import AuthDivider from '../../../components/auth/AuthDivider/AuthDivider.vue';
import { authService } from '../../../services/authService.js';
import './RegisterView.css';

export default {
  name: 'RegisterView',
  components: { AuthLayout, AuthInput, AuthButton, AuthDivider },
  setup() {
    const router = useRouter();
    const name = ref(''); const phone = ref(''); const password = ref(''); const passwordConfirmation = ref('');
    const isLoading = ref(false); const errorMessage = ref('');
    const nameError = ref(''); const phoneError = ref(''); const passwordError = ref(''); const confirmPasswordError = ref(''); const termsError = ref('');
    const formatPhoneDisplay = (value) => { const digits = String(value).replace(/\D/g, ''); const parts = digits.match(/.{1,4}/g); return parts ? parts.join('-') : ''; };
    const formattedPhone = computed(() => formatPhoneDisplay(phone.value));
    const handlePhoneInput = (value) => { phone.value = value.replace(/\D/g, '').slice(0, 14); };
    const validateForm = () => { let isValid = true; nameError.value = ''; phoneError.value = ''; passwordError.value = ''; confirmPasswordError.value = ''; termsError.value = ''; errorMessage.value = ''; if (!name.value.trim()) { nameError.value = 'Nama lengkap wajib diisi'; isValid = false; } const pv = phone.value.trim(); if (!pv) { phoneError.value = 'Nomor HP wajib diisi'; isValid = false; } else if (pv.length < 11 || pv.length > 14) { phoneError.value = 'Nomor HP harus 11-14 digit'; isValid = false; } if (!password.value) { passwordError.value = 'Kata sandi wajib diisi'; isValid = false; } else if (password.value.length < 6) { passwordError.value = 'Kata sandi minimal 6 karakter'; isValid = false; } if (!passwordConfirmation.value) { confirmPasswordError.value = 'Konfirmasi password wajib diisi'; isValid = false; } else if (passwordConfirmation.value !== password.value) { confirmPasswordError.value = 'Kata sandi tidak cocok'; isValid = false; } return isValid; };
    const handleRegister = async () => { if (!validateForm()) return; isLoading.value = true; try { await authService.register({ name: name.value.trim(), phone_number: phone.value.trim(), password: password.value }); router.push({ path: '/verify-otp', state: { phone: phone.value.trim() } }); } catch (err) { errorMessage.value = err.message || 'Gagal mengirim OTP. Silakan coba lagi.'; } finally { isLoading.value = false; } };
    return { name, phone, password, passwordConfirmation, isLoading, errorMessage, nameError, phoneError, passwordError, confirmPasswordError, termsError, formatPhoneDisplay, formattedPhone, handlePhoneInput, handleRegister };
  }
};
