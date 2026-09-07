import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { adminService } from '../services/adminService.js';
import { users } from '../data/user.js';
import { authService } from '../services/authService.js';
import { useAuthStore } from './auth.js';

export const useAdminAuthStore = defineStore('adminAuth', () => {
  const authStore = useAuthStore();

  const adminUser = ref(JSON.parse(localStorage.getItem('warung-admin-user') || 'null'));
  const adminToken = ref(localStorage.getItem('warung-admin-token') || '');
  const superAdminUser = ref(JSON.parse(localStorage.getItem('warung-superadmin-user') || 'null'));
  const superAdminToken = ref(localStorage.getItem('warung-superadmin-token') || '');

  const isAdminAuthenticated = computed(() => {
    return ['Admin', 'Kasir'].includes(adminUser.value?.role) || !!adminToken.value;
  });
  const isSuperAdminAuthenticated = computed(() => {
    return superAdminUser.value?.role === 'Super Admin' || !!superAdminToken.value;
  });

  async function storeRoleAuthData(userData, accessToken, role) {
    const encodedAuthData = await authService.encode({
      user: {
        ...userData,
        role
      },
      access_token: accessToken,
      token_type: 'bearer',
      expires_in: null
    });

    localStorage.setItem('warung-auth-data', encodedAuthData);
  }

  // Admin / Kasir Login
  async function loginAdmin(identifier, password) {
    await new Promise(r => setTimeout(r, 400));

    if (!identifier || !password) {
      throw new Error('Username / Email dan kata sandi wajib diisi');
    }

    if (password.length < 4) {
      throw new Error('Kata sandi minimal 4 karakter');
    }

    const cleanIdent = identifier.trim().toLowerCase();
    const admins = await adminService.getAdmins();

    const matchedAdmin = admins.find(
      a =>
        a.username.toLowerCase() === cleanIdent ||
        a.email.toLowerCase() === cleanIdent ||
        (cleanIdent === 'admin' && a.role === 'Admin') ||
        (cleanIdent === 'kasir' && a.role === 'Kasir')
    );

    if (matchedAdmin) {
      if (matchedAdmin.status === 'Inactive') {
        throw new Error('Akun Admin/Kasir ini dinonaktifkan oleh Super Admin.');
      }

      const userData = {
        id: matchedAdmin.id,
        name: matchedAdmin.name,
        username: matchedAdmin.username,
        email: matchedAdmin.email,
        role: matchedAdmin.role || 'Kasir',
        phone: matchedAdmin.phone || '+82 10 1234 5678',
        avatar: (matchedAdmin.name || 'A').charAt(0).toUpperCase()
      };

      adminUser.value = userData;
      adminToken.value = 'admin-jwt-' + Date.now();
      localStorage.setItem('warung-admin-user', JSON.stringify(userData));
      localStorage.setItem('warung-admin-token', adminToken.value);
      await storeRoleAuthData(userData, adminToken.value, 'admin');

      adminService.logActivity(
        `${userData.name} (${userData.role})`,
        'LOGIN',
        'Portal Admin / Kasir',
        { username: userData.username }
      );

      return userData;
    }

    // Fallback default admin
    const isKasir = cleanIdent.includes('kasir');
    const fallback = isKasir ? users.kasir : users.admin;
    const userData = {
      id: fallback.id,
      name: fallback.name,
      username: identifier,
      email: identifier.includes('@') ? identifier : fallback.email,
      role: isKasir ? 'Kasir' : 'Admin',
      phone: fallback.phone,
      avatar: fallback.avatar
    };

    adminUser.value = userData;
    adminToken.value = 'admin-jwt-' + Date.now();
    localStorage.setItem('warung-admin-user', JSON.stringify(userData));
    localStorage.setItem('warung-admin-token', adminToken.value);
    await storeRoleAuthData(userData, adminToken.value, 'admin');

    adminService.logActivity(
      `${userData.name} (${userData.role})`,
      'LOGIN',
      'Portal Admin / Kasir',
      { username: userData.username }
    );

    return userData;
  }

  function logoutAdmin() {
    if (adminUser.value) {
      adminService.logActivity(
        `${adminUser.value.name} (${adminUser.value.role})`,
        'LOGOUT',
        'Portal Admin / Kasir'
      );
    }
    adminUser.value = null;
    adminToken.value = '';
    localStorage.removeItem('warung-admin-user');
    localStorage.removeItem('warung-admin-token');
    localStorage.removeItem('warung-auth-data');
  }

  // Super Admin Login
  async function loginSuperAdmin(username, password) {
    await new Promise(r => setTimeout(r, 400));

    if (!username || !password) {
      throw new Error('Username developer dan kata sandi wajib diisi');
    }

    if (password.length < 4) {
      throw new Error('Kata sandi minimal 4 karakter');
    }

    const saData = users.superadmin || {
      id: 'SUPER-001',
      name: 'Root Developer',
      username: 'superadmin',
      email: 'dev@warungnusantara.internal',
      role: 'Super Admin',
      avatar: 'SA'
    };

    const userData = {
      id: saData.id,
      name: saData.name,
      username: username || saData.username,
      email: saData.email,
      role: 'Super Admin',
      avatar: saData.avatar || 'SA'
    };

    superAdminUser.value = userData;
    superAdminToken.value = 'superadmin-jwt-' + Date.now();
    localStorage.setItem('warung-superadmin-user', JSON.stringify(userData));
    localStorage.setItem('warung-superadmin-token', superAdminToken.value);
    await storeRoleAuthData(userData, superAdminToken.value, 'superadmin');

    adminService.logActivity('Super Admin', 'LOGIN', 'Super Admin Developer Console');

    return userData;
  }

  function logoutSuperAdmin() {
    adminService.logActivity('Super Admin', 'LOGOUT', 'Super Admin Developer Console');
    superAdminUser.value = null;
    superAdminToken.value = '';
    localStorage.removeItem('warung-superadmin-user');
    localStorage.removeItem('warung-superadmin-token');
    localStorage.removeItem('warung-auth-data');
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


