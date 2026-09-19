<template>
  <AuthLayout title="Daftar Akun">
    <form @submit.prevent="handleRegister" class="auth-form" novalidate>
      <div v-if="errorMessage" class="global-error-box" role="alert"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg><span>{{ errorMessage }}</span></div>
      <AuthInput id="register-name" label="Nama Lengkap" type="text" placeholder="Masukkan nama lengkap Anda" v-model="name" :error="nameError" required autocomplete="name" />
      <AuthInput id="register-phone" label="Nomor HP" type="tel" placeholder="Contoh: 0812-3456-7890" :modelValue="formattedPhone" @update:modelValue="handlePhoneInput" :formatter="formatPhoneDisplay" :maxlength="15" :error="phoneError" required autocomplete="tel" inputmode="numeric" />
      <AuthInput id="register-password" label="Kata Sandi" type="password" placeholder="Minimal 6 karakter" v-model="password" :error="passwordError" required autocomplete="new-password" />
      <AuthInput id="register-confirm-password" label="Konfirmasi Password" type="password" placeholder="Ulangi kata sandi Anda" v-model="passwordConfirmation" :error="confirmPasswordError" required autocomplete="new-password" />
      <div class="terms-field-wrap" :class="{ 'has-error': termsError }"><label class="terms-checkbox-label"></label><p v-if="termsError" id="terms-error" class="error-text" role="alert">{{ termsError }}</p></div>
      <AuthButton text="KIRIM OTP" :loading="isLoading" type="submit" variant="primary" />
      <AuthDivider text="or" />
      <router-link to="/" class="guest-btn-link"><AuthButton text="Continue as Guest" type="button" variant="secondary" /></router-link>
      <div class="auth-footer-nav"><span>Already have an account?</span><router-link to="/login" class="auth-switch-link">Login</router-link></div>
    </form>
  </AuthLayout>
</template>

<script>
import RegisterViewScript from './RegisterView.js';
export default { ...RegisterViewScript };
</script>
