<template>
  <div class="superadmin-login-page">
    <div class="login-card">
      <div class="login-header"><h1 class="login-title">Super Admin Console</h1></div>
      <form @submit.prevent="handleLogin" class="login-form" novalidate>
        <div v-if="errorMessage" class="error-box" role="alert">{{ errorMessage }}</div>
        <div class="form-group"><label for="sa-phone" class="form-label">Nomor HP</label><input id="sa-phone" type="tel" v-model="phoneNumber" class="form-input" placeholder="0812-3456-7890" required autocomplete="tel" inputmode="numeric" /></div>
        <div class="form-group"><label for="sa-pwd" class="form-label">Security Key / Password</label><input id="sa-pwd" type="password" v-model="password" class="form-input" placeholder="••••••••" required autocomplete="current-password" /></div>
        <button type="submit" class="submit-btn" :disabled="isLoading"><span v-if="isLoading">Authenticating...</span><span v-else>ENTER SUPER ADMIN CONSOLE</span></button>
        <div class="footer-nav"><router-link to="/admin/login" class="nav-link">← Kembali ke Portal Kasir / Admin</router-link></div>
      </form>
    </div>
  </div>
</template>

<script>
import SuperAdminLoginScript from './SuperAdminLoginView.js';
export default { ...SuperAdminLoginScript };
</script>
