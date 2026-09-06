<template>
  <AuthLayout
    title="Welcome back"
    subtitle="Sign in to your account"
    description="Silakan masuk untuk melanjutkan pemesanan."
  >
    <form @submit.prevent="handleLogin" class="auth-form" novalidate>
      <div v-if="errorMessage" class="global-error-box" role="alert">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/>
          <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="12" cy="16" r="1" fill="currentColor"/>
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <AuthInput
        id="login-phone"
        label="Nomor HP"
        type="tel"
        placeholder="Contoh: +821234567890"
        v-model="phone"
        :error="phoneError"
        @input="handlePhoneInput"
        required
        autocomplete="tel"
        inputmode="numeric"
      />

      <AuthInput
        id="login-password"
        label="Kata Sandi"
        type="password"
        placeholder="Masukkan kata sandi Anda"
        v-model="password"
        :error="passwordError"
        required
        autocomplete="current-password"
      />

      <div class="auth-options-row">
        <label class="remember-me-label">
          <input type="checkbox" v-model="rememberMe" class="auth-checkbox" />
          <span>Ingat saya</span>
        </label>
        <a href="#" class="forgot-password-link" @click.prevent="handleForgotPassword">Lupa kata sandi?</a>
      </div>

      <AuthButton text="SIGN IN" :loading="isLoading" type="submit" variant="primary" />

      <AuthDivider text="or" />

      <router-link to="/" class="guest-btn-link">
        <AuthButton text="Continue as Guest" type="button" variant="secondary" />
      </router-link>

      <div class="auth-footer-nav">
        <span>Don't have an account?</span>
        <router-link to="/register" class="auth-switch-link">Create one</router-link>
      </div>
    </form>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthLayout from '../components/auth/AuthLayout.vue';
import AuthInput from '../components/auth/AuthInput.vue';
import AuthButton from '../components/auth/AuthButton.vue';
import AuthDivider from '../components/auth/AuthDivider.vue';
import { useAuthStore } from '../stores/auth.js';

const router = useRouter();
const authStore = useAuthStore();

const phone = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const phoneError = ref('');
const passwordError = ref('');

const handlePhoneInput = (event) => {
  phone.value = event.target.value.replace(/\D/g, '');
};

const validateForm = () => {
  let isValid = true;
  phoneError.value = '';
  passwordError.value = '';
  errorMessage.value = '';

  const inputVal = phone.value.trim();
  if (!inputVal) {
    phoneError.value = 'Nomor HP wajib diisi';
    isValid = false;
  }

  if (!password.value) {
    passwordError.value = 'Kata sandi wajib diisi';
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  try {
    await authStore.login(phone.value.trim(), password.value);
    router.push('/');
  } catch (err) {
    errorMessage.value = err.message || 'Login gagal. Periksa nomor HP dan kata sandi Anda.';
  } finally {
    isLoading.value = false;
  }
};

const handleForgotPassword = () => {
  alert('Fitur lupa kata sandi akan diintegrasikan dengan API backend.');
};
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

.auth-options-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -6px;
  margin-bottom: 24px;
  font-size: 0.86rem;
}

.remember-me-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ink);
  cursor: pointer;
}

.auth-checkbox {
  width: 17px;
  height: 17px;
  accent-color: var(--red);
  cursor: pointer;
}

.forgot-password-link {
  color: var(--red);
  font-size: 0.84rem;
  font-weight: 700;
  text-decoration: none;
  transition: color var(--ease);
}

.forgot-password-link:hover {
  color: var(--red-dark);
  text-decoration: underline;
}

.guest-btn-link {
  display: block;
  width: 100%;
  text-decoration: none;
}

.auth-footer-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
  font-size: 0.9rem;
  color: var(--muted);
}

.auth-switch-link {
  color: var(--red);
  font-weight: 750;
  text-decoration: none;
  transition: color var(--ease);
}

.auth-switch-link:hover {
  color: var(--red-dark);
  text-decoration: underline;
}
</style>
