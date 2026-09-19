<template>
  <AuthLayout title="Masuk ke Akun">
    <form @submit.prevent="handleLogin" class="auth-form" novalidate>
      <div v-if="errorMessage" class="global-error-box" role="alert"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg><span>{{ errorMessage }}</span></div>
      <AuthInput id="login-identifier" label="Handphone" type="text" placeholder="example: +821022334455" v-model="identifier" :error="identifierError" required autocomplete="username" />
      <AuthInput id="login-password" label="Kata Sandi" type="password" placeholder="Masukkan kata sandi Anda" v-model="password" :error="passwordError" required autocomplete="current-password" />
      <div class="auth-options-row"><label class="remember-me-label"></label></div>
      <AuthButton :text="isLoading ? 'MEMVERIFIKASI...' : 'Log in'" :loading="isLoading" type="submit" variant="primary" />
      <AuthDivider text="atau" />
      <router-link to="/" class="guest-btn-link"><AuthButton text="Lanjutkan sebagai Guest (Tanpa Login)" type="button" variant="secondary" /></router-link>
      <div class="auth-footer-nav"><span>Belum memiliki akun Pelanggan?</span><router-link to="/register" class="auth-switch-link">Daftar Sekarang</router-link></div>
    </form>
    <NoticeModal :visible="isNoticeVisible" :type="noticeType" :title="noticeTitle" :message="noticeMessage" :detail="noticeDetail" :confirm-text="noticeConfirmText" @close="handleNoticeClose" @confirm="handleNoticeConfirm" />
  </AuthLayout>
</template>

<script>
import LoginViewScript from './LoginView.js';
export default { ...LoginViewScript };
</script>
