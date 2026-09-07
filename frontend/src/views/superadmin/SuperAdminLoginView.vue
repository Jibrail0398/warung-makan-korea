<template>
  <div class="superadmin-login-page">
    <div class="login-card">
      <div class="security-badge">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.8" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="1.8" />
        </svg>
        <span>INTERNAL DEVELOPER ACCESS ONLY</span>
      </div>

      <div class="login-header">
        <h1 class="login-title">Super Admin Console</h1>
        <p class="login-subtitle">Akses sistem backend developer & audit logs Warung Nusantara.</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form" novalidate>
        <div v-if="errorMessage" class="error-box" role="alert">
          {{ errorMessage }}
        </div>

        <div class="form-group">
          <label for="sa-user" class="form-label">Developer Username</label>
          <input
            id="sa-user"
            type="text"
            v-model="username"
            class="form-input"
            placeholder="superadmin"
            required
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label for="sa-pwd" class="form-label">Security Key / Password</label>
          <input
            id="sa-pwd"
            type="password"
            v-model="password"
            class="form-input"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="isLoading">Authenticating...</span>
          <span v-else>ENTER SUPER ADMIN CONSOLE</span>
        </button>

        <div class="footer-nav">
          <router-link to="/admin/login" class="nav-link">
            ← Kembali ke Portal Kasir / Admin
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

const username = ref('superadmin');
const password = ref('super123');
const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  if (!username.value.trim() || !password.value) {
    errorMessage.value = 'Kredensial developer wajib diisi.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    await adminAuthStore.loginSuperAdmin(username.value.trim(), password.value);
    router.push('/super-admin/dashboard');
  } catch (err) {
    errorMessage.value = err.message || 'Autentikasi Super Admin gagal.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.superadmin-login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #0f172a;
  color: #f8fafc;
}

.login-card {
  width: 100%;
  max-width: 440px;
  padding: 38px 32px;
  border-radius: 16px;
  background: #1e293b;
  border: 1px solid #334155;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.security-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(220, 38, 38, 0.2);
  border: 1px solid rgba(220, 38, 38, 0.4);
  color: #fca5a5;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  margin-bottom: 18px;
}

.login-title {
  margin: 0 0 6px;
  font-size: 1.55rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #fff;
}

.login-subtitle {
  margin: 0 0 24px;
  font-size: 0.8rem;
  color: #94a3b8;
  line-height: 1.5;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.error-box {
  padding: 10px 14px;
  border-radius: var(--r-sm);
  background: rgba(220, 38, 38, 0.2);
  border: 1px solid #ef4444;
  color: #fca5a5;
  font-size: 0.82rem;
  font-weight: 600;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: #cbd5e1;
}

.form-input {
  width: 100%;
  padding: 11px 14px;
  border-radius: var(--r-sm);
  border: 1px solid #334155;
  background: #0f172a;
  color: #fff;
  font-size: 0.88rem;
  outline: none;
  transition: border-color var(--ease);
}

.form-input:focus {
  border-color: #38bdf8;
}

.submit-btn {
  height: 44px;
  border-radius: var(--r-sm);
  background: #2563eb;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  cursor: pointer;
  margin-top: 6px;
  transition: all var(--ease);
}

.submit-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.footer-nav {
  text-align: center;
  margin-top: 14px;
  padding-top: 16px;
  border-top: 1px solid #334155;
}

.nav-link {
  font-size: 0.8rem;
  color: #94a3b8;
  text-decoration: none;
  font-weight: 600;
}

.nav-link:hover {
  color: #38bdf8;
  text-decoration: underline;
}
</style>
