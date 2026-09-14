import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import AuthLayout from '../../../components/auth/AuthLayout.vue';
import AuthButton from '../../../components/auth/AuthButton.vue';
import AuthDivider from '../../../components/auth/AuthDivider.vue';
import { authService } from '../../../services/authService.js';
import './VerifyOtpView.css';

export default {
  name: 'VerifyOtpView',
  components: { AuthLayout, AuthButton, AuthDivider },
  setup() {
    const router = useRouter();
    const rawPhone = history.state?.phone || '';
    const subtitle = `Masukkan kode OTP yang telah dikirim ke nomor ${rawPhone}`;
    const otpDigits = ref(['', '', '', '', '', '']);
    const inputRefs = ref([]);
    const isLoading = ref(false);
    const errorMessage = ref('');
    const timer = ref(45);
    let timerInterval = null;
    const formattedTimer = computed(() => String(timer.value).padStart(2, '0'));
    const startTimer = () => { timer.value = 45; if (timerInterval) clearInterval(timerInterval); timerInterval = setInterval(() => { if (timer.value > 0) timer.value -= 1; else clearInterval(timerInterval); }, 1000); };
    onMounted(() => { if (!rawPhone) { alert('Sesi tidak valid atau telah berakhir. Silakan daftar kembali.'); router.replace({ path: '/register' }); } startTimer(); setTimeout(() => { inputRefs.value[0]?.focus(); }, 150); });
    onBeforeUnmount(() => { if (timerInterval) clearInterval(timerInterval); });
    const resendOtp = async () => { errorMessage.value = ''; otpDigits.value = ['', '', '', '', '', '']; await authService.sendOtp(rawPhone); startTimer(); if (inputRefs.value[0]) inputRefs.value[0].focus(); };
    const handleDigitInput = (index, event) => { const val = event.target.value.replace(/\D/g, ''); otpDigits.value[index] = val ? val.slice(-1) : ''; if (val && index < 5) inputRefs.value[index + 1]?.focus(); };
    const handleKeyDown = (index, event) => { if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) inputRefs.value[index - 1]?.focus(); };
    const handlePaste = (event) => { event.preventDefault(); const pd = (event.clipboardData || window.clipboardData).getData('text').trim(); const d = pd.replace(/\D/g, '').slice(0, 6); if (d.length > 0) { for (let i = 0; i < 6; i++) otpDigits.value[i] = d[i] || ''; inputRefs.value[Math.min(d.length, 5)]?.focus(); } };
    const handleVerifyOtp = async () => { errorMessage.value = ''; const code = otpDigits.value.join(''); if (code.length < 6) { errorMessage.value = 'Silakan masukkan 6 digit kode OTP secara lengkap.'; return; } isLoading.value = true; try { const response = await authService.verifyOtp(rawPhone, code); const authData = response.data; const encodedAuthData = await authService.encode(authData); localStorage.setItem('warung-auth-data', encodedAuthData); const decodedAuthData = await authService.decode(encodedAuthData); const role = decodedAuthData?.user?.role?.toLowerCase(); alert('Verifikasi OTP Berhasil!.'); if (role === 'member') router.push('/'); else if (role === 'admin' || role === 'superadmin') router.push('/admin/dashboard'); } catch (err) { errorMessage.value = err.message || 'Kode OTP salah. Silakan periksa kembali.'; } finally { isLoading.value = false; } };
    return { subtitle, otpDigits, inputRefs, isLoading, errorMessage, timer, formattedTimer, resendOtp, handleDigitInput, handleKeyDown, handlePaste, handleVerifyOtp };
  }
};
