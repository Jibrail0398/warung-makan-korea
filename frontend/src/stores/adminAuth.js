import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { adminService } from '../services/adminService.js';
import { useAuthStore } from './auth.js';

export const useAdminAuthStore = defineStore('adminAuth', () => {
  const authStore = useAuthStore();

  const adminUser = computed(() => {
    if (authStore.isAdminOrKasir) return authStore.user;
    return JSON.parse(localStorage.getItem('warung-admin-user') || 'null');
  });

  const adminToken = computed(() => {
    if (authStore.isAdminOrKasir) return authStore.token;
    return localStorage.getItem('warung-admin-token') || '';
  });

  const superAdminUser = computed(() => {
    if (authStore.isSuperAdmin) return authStore.user;
    return JSON.parse(localStorage.getItem('warung-superadmin-user') || 'null');
  });

  const superAdminToken = computed(() => {
    if (authStore.isSuperAdmin) return authStore.token;
    return localStorage.getItem('warung-superadmin-token') || '';
  });

  const isAdminAuthenticated = computed(() => authStore.isAdminOrKasir || !!adminToken.value);
  const isSuperAdminAuthenticated = computed(() => authStore.isSuperAdmin || !!superAdminToken.value);

  // Admin / Kasir Login
  async function loginAdmin(identifier, password) {
    const res = await authStore.login(identifier, password);
    return res.user;
  }

  function logoutAdmin() {
    authStore.logout();
  }

  // Super Admin Login
  async function loginSuperAdmin(username, password) {
    const res = await authStore.login(username, password);
    return res.user;
  }

  function logoutSuperAdmin() {
    authStore.logout();
  }

  // Reset / Change Password
  async function changePassword(currentPassword, newPassword) {
    await new Promise(r => setTimeout(r, 400));

    if (!currentPassword || !newPassword) {
      throw new Error('Semua field kata sandi wajib diisi');
    }

    if (newPassword.length < 6) {
      throw new Error('Kata sandi baru minimal 6 karakter');
    }

    if (authStore.user) {
      adminService.logActivity(
        `${authStore.user.name} (${authStore.user.role})`,
        'RESET_PASSWORD',
        `Account ${authStore.user.username || authStore.user.name}`
      );
    }

    return { success: true, message: 'Kata sandi berhasil diperbarui' };
  }

  return {
    adminUser,
    adminToken,
    isAdminAuthenticated,
    superAdminUser,
    superAdminToken,
    isSuperAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    loginSuperAdmin,
    logoutSuperAdmin,
    changePassword
  };
});


