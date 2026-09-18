<template>
  <div class="admin-login-page">
    <div class="login-card">
      <div class="login-header">
        <div class="brand-badge">AR</div>
        <h1 class="login-title">Portal Admin & Kasir</h1>
        <p class="login-subtitle">Aneka Rasa Restoran — Indonesia in Korea</p>
      </div>
      <form @submit.prevent="handleLogin" class="login-form" novalidate>
        <div v-if="errorMessage" class="error-box" role="alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>
          <span>{{ errorMessage }}</span>
        </div>
        <div class="form-group">
          <label for="admin-phone" class="form-label">Nomor HP</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <input id="admin-phone" type="tel" v-model="phoneNumber" class="form-input" placeholder="0812-3456-7890" required autocomplete="tel" inputmode="numeric" />
          </div>
        </div>
        <div class="form-group">
          <label for="admin-password" class="form-label">Kata Sandi</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="1.8" /><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="1.8" /></svg>
            <input id="admin-password" :type="showPassword ? 'text' : 'password'" v-model="password" class="form-input with-action" placeholder="Masukkan kata sandi" required autocomplete="current-password" />
            <button type="button" class="toggle-pwd-btn" @click="showPassword = !showPassword" aria-label="Tampilkan / Sembunyikan password">
              <svg v-if="showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.8" /><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8" /></svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
            </button>
          </div>
        </div>
        <div class="form-actions-row">
          <label class="remember-label"><input type="checkbox" v-model="rememberMe" class="remember-checkbox" /><span>Ingat akun di perangkat ini</span></label>
        </div>
        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="isLoading">Memverifikasi...</span><span v-else>MASUK KE DASHBOARD</span>
        </button>
        <div class="login-footer-links">
          <router-link to="/super-admin/login" class="secondary-link">Akses Super Admin (Developer) →</router-link>
          <router-link to="/" class="secondary-link">← Kembali ke Website Pelanggan</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import AdminLoginScript from './AdminLoginView.js';
export default { ...AdminLoginScript };
</script>
