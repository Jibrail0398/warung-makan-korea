<template>
  <div>
    <div class="drawer-backdrop" :class="{ open: isOpen }" :aria-hidden="!isOpen" @click="$emit('close')"></div>
    <aside class="mobile-drawer" :class="{ open: isOpen }" aria-label="Mobile navigation" :aria-hidden="!isOpen">
      <router-link class="mobile-drawer-brand" to="/" @click="$emit('close')">
        <span class="mobile-drawer-brand-mark" aria-hidden="true">AR</span>
        <span class="mobile-drawer-brand-copy">
          <strong>Aneka Rasa Restoran</strong>
        </span>
      </router-link>

      <div v-if="authStore.isAuthenticated" class="mobile-user-badge">
        <span class="mobile-user-avatar">{{ userInitial }}</span>
        <div class="mobile-user-text">
          <strong>{{ userName }}</strong>
          <small>{{ authStore.user?.role || 'Pelanggan' }}</small>
        </div>
      </div>

      <nav>
        <router-link to="/" @click="$emit('close')">Home</router-link>
        <router-link to="/#menu" @click="$emit('close')">Menu</router-link>
        <router-link v-if="isAdminOrStaff" to="/admin/profile" @click="$emit('close')">Profil Admin</router-link>
        <router-link v-else-if="authStore.isAuthenticated" to="/profile" @click="$emit('close')">Profil Saya</router-link>
        <router-link to="/order-history" @click="$emit('close')">Order History</router-link>
        <router-link v-if="isAdminOrStaff && !isSuperAdmin" to="/admin/dashboard" @click="$emit('close')">Admin Dashboard</router-link>
        <router-link v-if="isSuperAdmin" to="/admin/audit-logs" @click="$emit('close')">Audit Log</router-link>
        <router-link to="/#about" @click="$emit('close')">About</router-link>
        <router-link v-if="!authStore.isAuthenticated" to="/login" @click="$emit('close')">Login</router-link>
        <button
          v-if="authStore.isAuthenticated"
          type="button"
          class="mobile-drawer-logout-btn"
          @click="triggerLogout"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <polyline points="16 17 21 12 16 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useAuthStore } from '../../../stores/auth.js';
import './MobileDrawer.css';

export default {
  name: 'MobileDrawer',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'logout'],
  setup(props, { emit }) {
    const authStore = useAuthStore();

    const userName = computed(() => {
      return authStore.user?.name || authStore.user?.username || authStore.displayName || 'Pelanggan';
    });

    const userInitial = computed(() => {
      return userName.value ? userName.value.charAt(0).toUpperCase() : 'U';
    });

    const isAdminOrStaff = computed(() => {
      return authStore.isAdmin || authStore.isKasir || authStore.isSuperAdmin;
    });

    const isSuperAdmin = computed(() => {
      return authStore.isSuperAdmin;
    });

    const triggerLogout = () => {
      emit('close');
      emit('logout');
    };

    return {
      authStore,
      userName,
      userInitial,
      isAdminOrStaff,
      isSuperAdmin,
      triggerLogout
    };
  }
};
</script>
