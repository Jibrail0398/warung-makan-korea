import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { adminService } from '../services/adminService.js';
import { users } from '../data/user.js';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref('');
  const authData = ref(null);

  const isAuthenticated = computed(() => !!authData.value?.access_token);
  const displayName = computed(() => user.value?.name || 'user');

  async function hydrate() {
    const storedValue = localStorage.getItem('warung-auth-data');
    const decodedAuthData = await authService.decode(storedValue);

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
    hydrate,
    logout
  };
});

