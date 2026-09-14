<template>
  <div class="reset-password-page">
    <header class="page-header"><div><p class="page-eyebrow">KEAMANAN AKUN</p><h1 class="page-title">Reset Password Akun Admin</h1><p class="page-description">Perbarui kata sandi akun Admin / Kasir Anda untuk menjaga keamanan akses sistem.</p></div></header>
    <div class="form-container-grid">
      <section class="card form-card">
        <form @submit.prevent="handleResetPassword" class="password-form" novalidate>
          <div v-if="successMessage" class="alert-box alert-success" role="status"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8" /><polyline points="16 9 10 15 7 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg><span>{{ successMessage }}</span></div>
          <div v-if="errorMessage" class="alert-box alert-danger" role="alert"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8" /><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><circle cx="12" cy="16" r="1" fill="currentColor" /></svg><span>{{ errorMessage }}</span></div>
          <div class="form-group"><label for="current-pwd" class="form-label required">Kata Sandi Saat Ini</label><input id="current-pwd" type="password" v-model="currentPassword" class="form-input" placeholder="Masukkan kata sandi saat ini" required /></div>
          <div class="form-group"><label for="new-pwd" class="form-label required">Kata Sandi Baru</label><input id="new-pwd" type="password" v-model="newPassword" class="form-input" placeholder="Minimal 6 karakter kombinasi" required /></div>
          <div class="form-group"><label for="confirm-pwd" class="form-label required">Konfirmasi Kata Sandi Baru</label><input id="confirm-pwd" type="password" v-model="confirmPassword" class="form-input" placeholder="Ketik ulang kata sandi baru" required /></div>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">{{ isSubmitting ? 'Memproses...' : 'Perbarui Kata Sandi' }}</button>
        </form>
      </section>
      <section class="card guidance-card">
        <h3 class="guidance-title">Panduan Keamanan Kata Sandi</h3>
        <ul class="guidance-list"><li>Gunakan minimal 6 hingga 12 karakter unik.</li><li>Kombinasikan huruf besar, huruf kecil, dan angka.</li><li>Jangan gunakan tanggal lahir atau nomor telepon Anda.</li><li>Hindari menggunakan kata sandi yang sama dengan akun lain.</li><li>Jangan membagikan kredensial login kasir kepada pihak luar.</li></ul>
      </section>
    </div>
  </div>
</template>

<script>
import AdminResetPasswordScript from './AdminResetPasswordView.js';
export default { ...AdminResetPasswordScript };
</script>
