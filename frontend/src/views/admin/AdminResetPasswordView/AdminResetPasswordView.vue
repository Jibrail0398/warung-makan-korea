<template>
  <div class="reset-password-page">
    <header class="page-header"><div><h1 class="page-title">Reset Password Akun Admin</h1></div></header>
    <div class="form-container-grid">
      <section class="card form-card">
        <form @submit.prevent="handleResetPassword" class="password-form" novalidate>
          <div v-if="successMessage" class="alert-box alert-success" role="status"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8" /><polyline points="16 9 10 15 7 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg><span>{{ successMessage }}</span></div>
          <div v-if="errorMessage" class="alert-box alert-danger" role="alert"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8" /><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><circle cx="12" cy="16" r="1" fill="currentColor" /></svg><span>{{ errorMessage }}</span></div>
          <div class="form-group">
            <label for="current-pwd" class="form-label required">Kata Sandi Saat Ini</label>
            <input
              id="current-pwd"
              type="password"
              v-model="currentPassword"
              class="form-input"
              :class="{ 'input-error': formErrors.currentPassword }"
              placeholder="Masukkan kata sandi saat ini"
              :disabled="isSubmitting"
              @input="formErrors.currentPassword = ''"
              required
            />
            <small v-if="formErrors.currentPassword" class="field-error">{{ formErrors.currentPassword }}</small>
          </div>
          <div class="form-group">
            <label for="new-pwd" class="form-label required">Kata Sandi Baru</label>
            <input
              id="new-pwd"
              type="password"
              v-model="newPassword"
              class="form-input"
              :class="{ 'input-error': formErrors.newPassword }"
              placeholder="Minimal 6 karakter"
              :disabled="isSubmitting"
              @input="formErrors.newPassword = ''"
              required
            />
            <small v-if="formErrors.newPassword" class="field-error">{{ formErrors.newPassword }}</small>
          </div>
          <div class="form-group">
            <label for="confirm-pwd" class="form-label required">Konfirmasi Kata Sandi Baru</label>
            <input
              id="confirm-pwd"
              type="password"
              v-model="confirmPassword"
              class="form-input"
              :class="{ 'input-error': formErrors.confirmPassword }"
              placeholder="Ketik ulang kata sandi baru"
              :disabled="isSubmitting"
              @input="formErrors.confirmPassword = ''"
              required
            />
            <small v-if="formErrors.confirmPassword" class="field-error">{{ formErrors.confirmPassword }}</small>
          </div>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            <LoadingSpinner v-if="isSubmitting" size="sm" color="white" text="Memproses..." inline />
            <span v-else>Perbarui Kata Sandi</span>
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner.vue';
import AdminResetPasswordScript from './AdminResetPasswordView.js';

export default {
  ...AdminResetPasswordScript,
  components: {
    LoadingSpinner,
    ...AdminResetPasswordScript.components
  }
};
</script>
