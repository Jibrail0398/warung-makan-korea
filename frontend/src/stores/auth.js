import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '../services/authService.js';
import { ADMIN_ROLES } from '../constants/roles.js';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref('');
  const authData = ref(null);

  const isAuthenticated = computed(() => !!authData.value?.access_token);
  const displayName = computed(() => user.value?.name || 'user');

  const role = computed(() => user.value?.role?.toLowerCase() || '');
  const isAdmin = computed(() => role.value === 'admin');
  const isSuperAdmin = computed(() => role.value === 'superadmin');
  const isKasir = computed(() => role.value === 'kasir');
  const isAdminOrStaff = computed(() => ADMIN_ROLES.includes(role.value));

  async function hydrate() {
    const decodedAuthData = await authService.getStoredAuth();

    authData.value = decodedAuthData;
    user.value = decodedAuthData?.user || null;
    token.value = decodedAuthData?.access_token || '';

    return decodedAuthData;
  }

  function logout() {
    authData.value = null;
    user.value = null;
    token.value = '';

    // Clear all storage keys
    localStorage.removeItem('warung-user');
    localStorage.removeItem('warung-token');
    localStorage.removeItem('warung-auth-data');
  }

  return {
    user,
    token,
    authData,
    isAuthenticated,
    displayName,
    role,
    isAdmin,
    isSuperAdmin,
    isKasir,
    isAdminOrStaff,
    hydrate,
    logout
  };
});

