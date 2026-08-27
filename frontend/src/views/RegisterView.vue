<template>
  <AuthLayout
    title="Create your account"
    subtitle="Join us and start ordering your favorite Indonesian food."
    description="Daftar untuk menikmati berbagai kuliner khas Indonesia di Korea."
  >
    <form @submit.prevent="handleRegister" class="auth-form" novalidate>
      <div v-if="errorMessage" class="global-error-box" role="alert">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/>
          <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="12" cy="16" r="1" fill="currentColor"/>
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <AuthInput
        id="register-name"
        label="Nama Lengkap"
        type="text"
        placeholder="Masukkan nama lengkap Anda"
        v-model="name"
        :error="nameError"
        required
        autocomplete="name"
      />

      <AuthInput
        id="register-phone"
        label="Nomor HP"
        type="tel"
        placeholder="Contoh: 081234567890"
        v-model="phone"
        :error="phoneError"
        @input="handlePhoneInput"
        required
        autocomplete="tel"
        inputmode="numeric"
      />

      <AuthInput
        id="register-password"
        label="Kata Sandi"
        type="password"
        placeholder="Minimal 6 karakter"
        v-model="password"
        :error="passwordError"
        required
        autocomplete="new-password"
      />

      <AuthInput
        id="register-confirm-password"
        label="Konfirmasi Password"
        type="password"
        placeholder="Ulangi kata sandi Anda"
        v-model="passwordConfirmation"
        :error="confirmPasswordError"
        required
        autocomplete="new-password"
      />

      <div class="terms-field-wrap" :class="{ 'has-error': termsError }">
        <label class="terms-checkbox-label">
          <input
            type="checkbox"
            v-model="agreeTerms"
            class="auth-checkbox"
            :aria-invalid="!!termsError"
            :aria-describedby="termsError ? 'terms-error' : null"
          />
          <span class="checkbox-text">
            Saya menyetujui <a href="#" @click.prevent class="terms-link">Syarat &amp; Ketentuan</a>
          </span>
        </label>
        <p v-if="termsError" id="terms-error" class="error-text" role="alert">
          {{ termsError }}
        </p>
      </div>

      <AuthButton text="KIRIM OTP" :loading="isLoading" type="submit" variant="primary" />

      <AuthDivider text="or" />

      <router-link to="/" class="guest-btn-link">
        <AuthButton text="Continue as Guest" type="button" variant="secondary" />
      </router-link>

      <div class="auth-footer-nav">
        <span>Already have an account?</span>
        <router-link to="/login" class="auth-switch-link">Login</router-link>
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
import { authService } from '../services/authService.js';

const router = useRouter();

const name = ref('');
const phone = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const agreeTerms = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const nameError = ref('');
const phoneError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');
const termsError = ref('');

const handlePhoneInput = (event) => {
  phone.value = event.target.value.replace(/\D/g, '');
};

const validateForm = () => {
  let isValid = true;
  nameError.value = '';
  phoneError.value = '';
  passwordError.value = '';
  confirmPasswordError.value = '';
  termsError.value = '';
  errorMessage.value = '';

  if (!name.value.trim()) {
    nameError.value = 'Nama lengkap wajib diisi';
    isValid = false;
  }

  const phoneVal = phone.value.trim();
  if (!phoneVal) {
    phoneError.value = 'Nomor HP wajib diisi';
    isValid = false;
  }

  if (!password.value) {
    passwordError.value = 'Kata sandi wajib diisi';
    isValid = false;
  } else if (password.value.length < 6) {
    passwordError.value = 'Kata sandi minimal 6 karakter';
    isValid = false;
  }

  if (!passwordConfirmation.value) {
    confirmPasswordError.value = 'Konfirmasi password wajib diisi';
    isValid = false;
  } else if (passwordConfirmation.value !== password.value) {
    confirmPasswordError.value = 'Kata sandi tidak cocok';
    isValid = false;
  }

  if (!agreeTerms.value) {
    termsError.value = 'Anda harus menyetujui Syarat & Ketentuan';
    isValid = false;
  }

  return isValid;
};

const handleRegister = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  try {
    await authService.register({
      name: name.value.trim(),
      phone: phone.value.trim(),
      password: password.value
    });

    router.push({
      path: '/verify-otp',
      query: { phone: phone.value.trim() }
    });
  } catch (err) {
    errorMessage.value = err.message || 'Gagal mengirim OTP. Silakan coba lagi.';
  } finally {
    isLoading.value = false;
  }
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

.terms-field-wrap {
  margin-bottom: 24px;
}

.terms-checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.88rem;
  color: var(--ink);
  cursor: pointer;
}

.auth-checkbox {
  width: 17px;
  height: 17px;
  accent-color: var(--red);
  cursor: pointer;
}

.checkbox-text {
  font-size: 0.86rem;
  color: var(--muted);
}

.terms-link {
  color: var(--red);
  font-weight: 700;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

.error-text {
  margin-top: 6px;
  font-size: 0.8rem;
  color: #dc2626;
  font-weight: 600;
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
