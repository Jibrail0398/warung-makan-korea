<template>
  <div class="reset-password-page">
    <header class="page-header">
      <div>
        <p class="page-eyebrow">KEAMANAN AKUN</p>
        <h1 class="page-title">Reset Password Akun Admin</h1>
        <p class="page-description">
          Perbarui kata sandi akun Admin / Kasir Anda untuk menjaga keamanan akses sistem.
        </p>
      </div>
    </header>

    <div class="form-container-grid">
      <!-- Reset Password Form Card -->
      <section class="card form-card">
        <form @submit.prevent="handleResetPassword" class="password-form" novalidate>
          <div v-if="successMessage" class="alert-box alert-success" role="status">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8" />
              <polyline points="16 9 10 15 7 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>{{ successMessage }}</span>
          </div>

          <div v-if="errorMessage" class="alert-box alert-danger" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8" />
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>

          <div class="form-group">
            <label for="current-pwd" class="form-label required">Kata Sandi Saat Ini</label>
            <input
              id="current-pwd"
              type="password"
              v-model="currentPassword"
              class="form-input"
              placeholder="Masukkan kata sandi saat ini"
              required
            />
          </div>

          <div class="form-group">
            <label for="new-pwd" class="form-label required">Kata Sandi Baru</label>
            <input
              id="new-pwd"
              type="password"
              v-model="newPassword"
              class="form-input"
              placeholder="Minimal 6 karakter kombinasi"
              required
            />
          </div>

          <div class="form-group">
            <label for="confirm-pwd" class="form-label required">Konfirmasi Kata Sandi Baru</label>
            <input
              id="confirm-pwd"
              type="password"
              v-model="confirmPassword"
              class="form-input"
              placeholder="Ketik ulang kata sandi baru"
              required
            />
          </div>

          <button
            type="submit"
            class="btn-submit"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Memproses...' : 'Perbarui Kata Sandi' }}
          </button>
        </form>
      </section>

      <!-- Security Guidance Card -->
      <section class="card guidance-card">
        <h3 class="guidance-title">Panduan Keamanan Kata Sandi</h3>
        <ul class="guidance-list">
          <li>Gunakan minimal 6 hingga 12 karakter unik.</li>
          <li>Kombinasikan huruf besar, huruf kecil, dan angka.</li>
          <li>Jangan gunakan tanggal lahir atau nomor telepon Anda.</li>
          <li>Hindari menggunakan kata sandi yang sama dengan akun lain.</li>
          <li>Jangan membagikan kredensial login kasir kepada pihak luar.</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAdminAuthStore } from '../../stores/adminAuth.js';
import { adminService } from '../../services/adminService.js';

const adminAuthStore = useAdminAuthStore();

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const handleResetPassword = async () => {
  successMessage.value = '';
  errorMessage.value = '';

  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    errorMessage.value = 'Semua field kata sandi wajib diisi.';
    return;
  }

  if (newPassword.value.length < 6) {
    errorMessage.value = 'Kata sandi baru minimal 6 karakter.';
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Konfirmasi kata sandi baru tidak cocok.';
    return;
  }

  isSubmitting.value = true;
  try {
    await adminAuthStore.changePassword(currentPassword.value, newPassword.value);
    adminService.logActivity('Admin', 'RESET_PASSWORD', 'Admin Self Reset Password');
    successMessage.value = 'Kata sandi berhasil diperbarui!';
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (err) {
    errorMessage.value = err.message || 'Gagal mengubah kata sandi.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.reset-password-page {
  width: 100%;
}

.page-header {
  margin-bottom: 28px;
}

.page-eyebrow {
  margin: 0 0 6px;
  color: var(--red);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.page-title {
  margin: 0;
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(26px, 3.2vw, 34px);
  font-weight: 500;
  letter-spacing: -0.03em;
}

.page-description {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 0.86rem;
}

.form-container-grid {
  display: grid;
  grid-template-columns: minmax(0, 520px) minmax(280px, 1fr);
  gap: 24px;
  align-items: start;
}

.card {
  padding: 28px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid var(--line);
  box-shadow: 0 2px 10px rgba(36, 25, 18, 0.04);
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.alert-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: var(--r-sm);
  font-size: 0.84rem;
  font-weight: 600;
}

.alert-success {
  background: #edf7ee;
  border: 1px solid #bbf7d0;
  color: var(--success);
}

.alert-danger {
  background: #fef2f2;
  border: 1px solid #fca5a5;
  color: #dc2626;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--ink);
}

.form-label.required::after {
  content: " *";
  color: var(--red);
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: #fff;
  color: var(--ink);
  font-size: 0.86rem;
  outline: none;
  transition: border-color var(--ease);
}

.form-input:focus {
  border-color: var(--red);
}

.btn-submit {
  height: 44px;
  border-radius: var(--r-sm);
  background: var(--red);
  color: #fff;
  font-size: 0.84rem;
  font-weight: 750;
  cursor: pointer;
  margin-top: 8px;
  transition: all var(--ease);
}

.btn-submit:hover:not(:disabled) {
  background: var(--red-dark);
}

.guidance-title {
  margin: 0 0 14px;
  font-size: 1.05rem;
  font-family: Georgia, "Times New Roman", serif;
  color: var(--ink);
}

.guidance-list {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: var(--muted);
  font-size: 0.84rem;
  line-height: 1.5;
}

@media (max-width: 860px) {
  .form-container-grid {
    grid-template-columns: 1fr;
  }
}
</style>
