<template>
  <AuthLayout
    title="Masuk ke Akun"
    subtitle="Warung Nusantara — Indonesia in Korea"
    description="Satu portal untuk Pelanggan, Kasir, Admin, dan Super Admin."
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

      <!-- Quick Role Fill Pills for easy testing -->
      <div class="role-selector-wrap">
        <span class="role-selector-label">Pilih Akun Demo / Role:</span>
        <div class="role-pills-row">
          <button
            type="button"
            class="role-pill"
            :class="{ active: selectedRolePreset === 'customer' }"
            @click="setRolePreset('customer')"
          >
            Pelanggan
          </button>
          <button
            type="button"
            class="role-pill"
            :class="{ active: selectedRolePreset === 'kasir' }"
            @click="setRolePreset('kasir')"
          >
            Kasir
          </button>
          <button
            type="button"
            class="role-pill"
            :class="{ active: selectedRolePreset === 'admin' }"
            @click="setRolePreset('admin')"
          >
            Admin
          </button>
          <button
            type="button"
            class="role-pill"
            :class="{ active: selectedRolePreset === 'superadmin' }"
            @click="setRolePreset('superadmin')"
          >
            Super Admin
          </button>
        </div>
      </div>

      <AuthInput
        id="login-identifier"
        label="Nomor HP (Korea) / Username / Email"
        type="text"
        placeholder="Contoh: +82 10 2233 4455 atau admin / kasir"
        v-model="identifier"
        :error="identifierError"
        required
        autocomplete="username"
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
          <span>Ingat saya di perangkat ini</span>
        </label>
        <a href="#" class="forgot-password-link" @click.prevent="handleForgotPassword">Lupa kata sandi?</a>
      </div>

      <AuthButton
        :text="isLoading ? 'MEMVERIFIKASI...' : 'MASUK KE SISTEM'"
        :loading="isLoading"
        type="submit"
        variant="primary"
      />

      <AuthDivider text="atau" />

      <router-link to="/" class="guest-btn-link">
        <AuthButton text="Lanjutkan sebagai Guest (Tanpa Login)" type="button" variant="secondary" />
      </router-link>

      <div class="auth-footer-nav">
        <span>Belum memiliki akun Pelanggan?</span>
        <router-link to="/register" class="auth-switch-link">Daftar Sekarang</router-link>
      </div>
    </form>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AuthLayout from '../components/auth/AuthLayout.vue';
import AuthInput from '../components/auth/AuthInput.vue';
import AuthButton from '../components/auth/AuthButton.vue';
import AuthDivider from '../components/auth/AuthDivider.vue';
import { useAuthStore } from '../stores/auth.js';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const identifier = ref('+82 10 2233 4455');
const password = ref('password123');
const rememberMe = ref(true);
const isLoading = ref(false);
const errorMessage = ref('');

const identifierError = ref('');
const passwordError = ref('');
const selectedRolePreset = ref('customer');

const setRolePreset = (preset) => {
  selectedRolePreset.value = preset;
  errorMessage.value = '';
  identifierError.value = '';
  passwordError.value = '';

  if (preset === 'customer') {
    identifier.value = '+82 10 2233 4455';
    password.value = 'password123';
  } else if (preset === 'kasir') {
    identifier.value = 'kasir_dina';
    password.value = 'kasir123';
  } else if (preset === 'admin') {
    identifier.value = 'admin_kelvin';
    password.value = 'admin123';
  } else if (preset === 'superadmin') {
    identifier.value = 'superadmin';
    password.value = 'superadmin123';
  }
};

const validateForm = () => {
  let isValid = true;
  identifierError.value = '';
  passwordError.value = '';
  errorMessage.value = '';

  const inputVal = identifier.value.trim();
  if (!inputVal) {
    identifierError.value = 'Nomor HP atau Username wajib diisi';
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
  errorMessage.value = '';

  try {
    const res = await authStore.login(identifier.value.trim(), password.value);
    
    // Redirect based on role
    const userRole = res.role;
    if (userRole === 'Super Admin') {
      router.push('/super-admin/dashboard');
    } else if (userRole === 'Admin' || userRole === 'Kasir') {
      // If cashier directly, can go to POS or dashboard
      router.push('/admin/dashboard');
    } else {
      // Customer redirect to target or home
      const redirectPath = route.query.redirect || '/';
      router.push(redirectPath);
    }
  } catch (err) {
    errorMessage.value = err.message || 'Login gagal. Periksa nomor HP / kredensial dan kata sandi Anda.';
  } finally {
    isLoading.value = false;
  }
};

const handleForgotPassword = () => {
  alert('Silakan hubungi kasir atau administrator untuk reset kata sandi akun Anda.');
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

.role-selector-wrap {
  margin-bottom: 18px;
  padding: 12px 14px;
  background: var(--soft);
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
}

.role-selector-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 750;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
}

.role-pills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.role-pill {
  padding: 5px 10px;
  border-radius: 6px;
  background: #ffffff;
  border: 1px solid var(--line);
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--ink);
  cursor: pointer;
  transition: all var(--ease);
}

.role-pill:hover {
  border-color: var(--red);
  color: var(--red);
}

.role-pill.active {
  background: var(--red);
  color: #ffffff;
  border-color: var(--red);
}

.auth-options-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -6px;
  margin-bottom: 24px;
  font-size: 0.86rem;
  flex-wrap: wrap;
  gap: 10px;
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
  flex-wrap: wrap;
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

