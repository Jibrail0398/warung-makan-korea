<template>
  <div class="admin-login-page">
    <div class="login-card">
      <div class="login-header">
        <div class="brand-badge">WN</div>
        <h1 class="login-title">Portal Admin & Kasir</h1>
        <p class="login-subtitle">Warung Nusantara — Indonesia in Korea</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form" novalidate>
        <div v-if="errorMessage" class="error-box" role="alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <circle cx="12" cy="16" r="1" fill="currentColor"/>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <div class="form-group">
          <label for="admin-identifier" class="form-label">Username atau Email</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.8" />
            </svg>
            <input
              id="admin-identifier"
              type="text"
              v-model="identifier"
              class="form-input"
              placeholder="admin / kasir / email@warungnusantara.kr"
              required
              autocomplete="username"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="admin-password" class="form-label">Kata Sandi</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="1.8" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="1.8" />
            </svg>
            <input
              id="admin-password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              class="form-input with-action"
              placeholder="Masukkan kata sandi"
              required
              autocomplete="current-password"
            />
            <button
              type="button"
              class="toggle-pwd-btn"
              @click="showPassword = !showPassword"
              aria-label="Tampilkan / Sembunyikan password"
            >
              <svg v-if="showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.8" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8" />
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div class="form-actions-row">
          <label class="remember-label">
            <input type="checkbox" v-model="rememberMe" class="remember-checkbox" />
            <span>Ingat akun di perangkat ini</span>
          </label>
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="isLoading">Memverifikasi...</span>
          <span v-else>MASUK KE DASHBOARD</span>
        </button>

        <div class="login-footer-links">
          <router-link to="/super-admin/login" class="secondary-link">
            Akses Super Admin (Developer) →
          </router-link>
          <router-link to="/" class="secondary-link">
            ← Kembali ke Website Pelanggan
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminAuthStore } from '../../stores/adminAuth.js';

const router = useRouter();
const adminAuthStore = useAdminAuthStore();

const identifier = ref('admin');
const password = ref('admin123');
const rememberMe = ref(true);
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  if (!identifier.value.trim() || !password.value) {
    errorMessage.value = 'Mohon isi username/email dan kata sandi';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    await adminAuthStore.loginAdmin(identifier.value.trim(), password.value);
    router.push('/admin/dashboard');
  } catch (err) {
    errorMessage.value = err.message || 'Login gagal. Periksa kredensial Anda.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--soft);
  color: var(--ink);
}

.login-card {
  width: 100%;
  max-width: 440px;
  padding: 40px 36px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: #ffffff;
  box-shadow: var(--shadow);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.brand-badge {
  display: inline-grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: var(--r-sm);
  background: var(--red);
  color: #fff;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.15rem;
  font-weight: 800;
  margin-bottom: 14px;
  box-shadow: 0 4px 14px rgba(165, 29, 45, 0.25);
}

.login-title {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.02em;
}

.login-subtitle {
  margin: 6px 0 0;
  font-size: 0.8rem;
  color: var(--muted);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.error-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-radius: var(--r-sm);
  background: #fef2f2;
  border: 1px solid #fca5a5;
  color: #dc2626;
  font-size: 0.84rem;
  font-weight: 600;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-label {
  font-size: 0.78rem;
  font-weight: 750;
  color: var(--ink);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  width: 17px;
  height: 17px;
  color: var(--muted);
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 12px 14px 12px 42px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: #ffffff;
  color: var(--ink);
  font-size: 0.88rem;
  outline: none;
  transition: border-color var(--ease);
}

.form-input:focus {
  border-color: var(--red);
}

.with-action {
  padding-right: 42px;
}

.toggle-pwd-btn {
  position: absolute;
  right: 12px;
  padding: 6px;
  color: var(--muted);
  cursor: pointer;
}

.toggle-pwd-btn:hover {
  color: var(--ink);
}

.form-actions-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
}

.remember-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  cursor: pointer;
}

.remember-checkbox {
  accent-color: var(--red);
  width: 16px;
  height: 16px;
}

.submit-btn {
  width: 100%;
  min-height: 46px;
  border-radius: var(--r-sm);
  background: var(--red);
  color: #fff;
  font-size: 0.84rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background var(--ease), transform var(--ease);
}

.submit-btn:hover:not(:disabled) {
  background: var(--red-dark);
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.login-footer-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.secondary-link {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--muted);
  text-decoration: none;
  transition: color var(--ease);
}

.secondary-link:hover {
  color: var(--red);
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 22px;
  }
}
</style>
