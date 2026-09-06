<template>
  <AuthLayout
    title="Verifikasi nomor HP"
    subtitle="Masukkan kode OTP yang telah dikirim ke nomor +8212-****-789"
  >
    <form @submit.prevent="handleVerifyOtp" class="auth-form" novalidate>
      <div v-if="errorMessage" class="global-error-box" role="alert">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/>
          <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="12" cy="16" r="1" fill="currentColor"/>
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- 6-digit OTP Input Group -->
      <div class="otp-container" @paste="handlePaste">
        <input
          v-for="(digit, index) in otpDigits"
          :key="index"
          :ref="el => inputRefs[index] = el"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="1"
          class="otp-box"
          :class="{ 'has-value': digit !== '', 'has-error': !!errorMessage }"
          v-model="otpDigits[index]"
          @input="handleDigitInput(index, $event)"
          @keydown="handleKeyDown(index, $event)"
          :aria-label="`OTP Digit ${index + 1}`"
          autocomplete="one-time-code"
        />
      </div>

      <!-- Resend Timer Row -->
      <div class="resend-row">
        <template v-if="timer > 0">
          <span class="resend-text">Belum menerima kode? Kirim ulang dalam </span>
          <strong class="timer-count">00:{{ formattedTimer }}</strong>
        </template>
        <template v-else>
          <span class="resend-text">Belum menerima kode? </span>
          <button type="button" class="resend-btn" @click="resendOtp">Kirim ulang OTP</button>
        </template>
      </div>

      <AuthButton text="VERIFIKASI OTP" :loading="isLoading" type="submit" variant="primary" />

      <AuthDivider text="or" />

      <div class="auth-footer-nav">
        <router-link to="/register" class="back-link">
          &larr; Kembali ke pendaftaran
        </router-link>
      </div>
    </form>
  </AuthLayout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthLayout from '../components/auth/AuthLayout.vue';
import AuthButton from '../components/auth/AuthButton.vue';
import AuthDivider from '../components/auth/AuthDivider.vue';
import { authService } from '../services/authService.js';

const route = useRoute();
const router = useRouter();

const rawPhone = route.query.phone || '+82 10-1234-5678';

const otpDigits = ref(['', '', '', '', '', '']);
const inputRefs = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');

const timer = ref(45);
let timerInterval = null;

const formattedTimer = computed(() => {
  return String(timer.value).padStart(2, '0');
});

const startTimer = () => {
  timer.value = 45;
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value -= 1;
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
};

const resendOtp = async () => {
  errorMessage.value = '';
  otpDigits.value = ['', '', '', '', '', ''];
  await authService.sendOtp(rawPhone);
  startTimer();
  if (inputRefs.value[0]) {
    inputRefs.value[0].focus();
  }
};

const handleDigitInput = (index, event) => {
  const val = event.target.value.replace(/\D/g, '');
  otpDigits.value[index] = val ? val.slice(-1) : '';

  if (val && index < 5) {
    inputRefs.value[index + 1]?.focus();
  }
};

const handleKeyDown = (index, event) => {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus();
  }
};

const handlePaste = (event) => {
  event.preventDefault();
  const pasteData = (event.clipboardData || window.clipboardData).getData('text').trim();
  const digitsOnly = pasteData.replace(/\D/g, '').slice(0, 6);

  if (digitsOnly.length > 0) {
    for (let i = 0; i < 6; i++) {
      otpDigits.value[i] = digitsOnly[i] || '';
    }
    const nextIndex = Math.min(digitsOnly.length, 5);
    inputRefs.value[nextIndex]?.focus();
  }
};

const handleVerifyOtp = async () => {
  errorMessage.value = '';
  const code = otpDigits.value.join('');

  if (code.length < 6) {
    errorMessage.value = 'Silakan masukkan 6 digit kode OTP secara lengkap.';
    return;
  }

  isLoading.value = true;
  try {
    await authService.verifyOtp(rawPhone, code);
    alert('Verifikasi OTP Berhasil! Akun Anda telah aktif.');
    router.push('/login');
  } catch (err) {
    errorMessage.value = err.message || 'Kode OTP salah. Silakan periksa kembali.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  startTimer();
  setTimeout(() => {
    inputRefs.value[0]?.focus();
  }, 150);
});

onBeforeUnmount(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
}

.global-error-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  margin-bottom: 20px;
  border: 1px solid #fca5a5;
  border-radius: var(--r-sm);
  background: #fef2f2;
  color: #dc2626;
  font-size: 0.86rem;
  font-weight: 600;
}

.otp-container {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  margin: 12px 0 24px;
}

.otp-box {
  width: 48px;
  height: 54px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--paper);
  color: var(--ink);
  font-family: Inter, sans-serif;
  font-size: 1.35rem;
  font-weight: 750;
  text-align: center;
  outline: none;
  transition: border-color var(--ease), box-shadow var(--ease);
}

.otp-box:focus {
  border-color: var(--red);
  box-shadow: 0 0 0 4px rgba(165, 29, 45, .08);
}

.otp-box.has-value {
  border-color: #a51d2d;
  background: #fff;
}

.otp-box.has-error {
  border-color: #dc2626;
}

.resend-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 24px;
  font-size: 0.88rem;
  color: var(--muted);
}

.timer-count {
  color: var(--red);
  font-weight: 750;
}

.resend-btn {
  border: none;
  background: none;
  color: var(--red);
  font-weight: 750;
  font-size: 0.88rem;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  transition: color var(--ease);
}

.resend-btn:hover {
  color: var(--red-dark);
}

.auth-footer-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  font-size: 0.9rem;
}

.back-link {
  color: var(--muted);
  font-weight: 700;
  text-decoration: none;
  transition: color var(--ease);
}

.back-link:hover {
  color: var(--red);
}

@media (max-width: 480px) {
  .otp-container {
    gap: 6px;
  }
  .otp-box {
    width: 40px;
    height: 48px;
    font-size: 1.15rem;
  }
}
</style>
