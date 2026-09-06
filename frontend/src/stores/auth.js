import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '../services/authService.js';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('warung-user') || 'null'));
  const token = ref(localStorage.getItem('warung-token') || '');

  const isAuthenticated = computed(() => !!token.value);

  async function login(phone, password) {
    const res = await authService.login(phone, password);
    user.value = res.user;
    token.value = res.token;
    localStorage.setItem('warung-user', JSON.stringify(res.user));
    localStorage.setItem('warung-token', res.token);
    return res;
  }

  function logout() {
    user.value = null;
    token.value = '';
    localStorage.removeItem('warung-user');
    localStorage.removeItem('warung-token');
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout
  };
});
