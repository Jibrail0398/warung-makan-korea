<template>
  <header class="admin-header">
    <div class="header-left">
      <button
        class="mobile-toggle-btn"
        type="button"
        aria-label="Toggle navigation menu"
        @click="$emit('toggle-sidebar')"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>

      <div class="breadcrumb">
        <span class="role-badge" :class="`role-${roleTone}`">
          {{ roleLabel }}
        </span>
      </div>
    </div>

    <div class="header-right">
      <!-- Real-time Sound Alert Toggle (Cashier/Admin) -->
      <button
        v-if="!isSuperAdmin"
        class="sound-toggle-btn"
        :class="{ 'sound-active': isSoundOn }"
        type="button"
        :title="isSoundOn ? 'Sound Alert: Aktif (Klik untuk mematikan)' : 'Sound Alert: Nonaktif (Klik untuk mengaktifkan)'"
        @click="toggleSound"
      >
        <svg v-if="isSoundOn" width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        <span class="sound-label">{{ isSoundOn ? 'Sound: ON' : 'Sound: OFF' }}</span>
      </button>

      <!-- Simulate Incoming Order Button (Admin/Kasir) -->
      <button
        v-if="!isSuperAdmin"
        class="action-pill-btn"
        type="button"
        title="Simulasi pesanan baru masuk secara real-time"
        @click="handleSimulateOrder"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span>Test Order</span>
      </button>

      <!-- Profile Dropdown -->
      <details class="user-dropdown">
        <summary class="user-trigger">
          <div class="avatar-circle">
            {{ userInitial }}
          </div>
          <div class="user-info">
            <span class="user-name">{{ userName }}</span>
            <span class="user-role">{{ userRole }}</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </summary>

        <div class="dropdown-menu">
          <div class="dropdown-header">
            <strong>{{ userName }}</strong>
            <small>{{ userEmail }}</small>
          </div>

          <div class="dropdown-divider"></div>

          <router-link
            v-if="!isSuperAdmin"
            to="/admin/reset-password"
            class="dropdown-item"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="1.8" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="1.8" />
            </svg>
            <span>Reset Password</span>
          </router-link>

          <router-link
            to="/"
            target="_blank"
            class="dropdown-item"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <polyline points="15 3 21 3 21 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>Lihat Website Toko</span>
          </router-link>

          <div class="dropdown-divider"></div>

          <button
            type="button"
            class="dropdown-item logout-btn"
            @click="handleLogout"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <polyline points="16 17 21 12 16 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </details>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminAuthStore } from '../../stores/adminAuth.js';
import { audioService } from '../../services/audioService.js';
import { adminService } from '../../services/adminService.js';

const props = defineProps({
  isSuperAdmin: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle-sidebar', 'new-order-received']);

const router = useRouter();
const adminAuthStore = useAdminAuthStore();

const isSoundOn = ref(true);

onMounted(() => {
  isSoundOn.value = audioService.isSoundEnabled();
});

const toggleSound = () => {
  isSoundOn.value = audioService.toggleSound();
};

const handleSimulateOrder = async () => {
  try {
    const newOrder = await adminService.simulateIncomingOrder();
    audioService.playOrderChime();
    emit('new-order-received', newOrder);
  } catch (err) {
    console.error('Simulate order failed:', err);
  }
};

const roleLabel = computed(() => {
  if (props.isSuperAdmin) return 'Super Admin (Developer)';
  return adminAuthStore.adminUser?.role || 'Admin / Kasir';
});

const roleTone = computed(() => {
  if (props.isSuperAdmin) return 'super';
  return 'admin';
});

const userName = computed(() => {
  if (props.isSuperAdmin) return adminAuthStore.superAdminUser?.name || 'Super Admin';
  return adminAuthStore.adminUser?.name || 'Kelvin Winata';
});

const userEmail = computed(() => {
  if (props.isSuperAdmin) return adminAuthStore.superAdminUser?.email || 'dev@warungnusantara.internal';
  return adminAuthStore.adminUser?.email || 'admin@warungnusantara.kr';
});

const userRole = computed(() => {
  if (props.isSuperAdmin) return 'Super Admin';
  return adminAuthStore.adminUser?.role || 'Admin';
});

const userInitial = computed(() => {
  if (props.isSuperAdmin) return 'SA';
  return (userName.value || 'A').charAt(0).toUpperCase();
});

const handleLogout = () => {
  if (props.isSuperAdmin) {
    adminAuthStore.logoutSuperAdmin();
    router.push('/super-admin/login');
  } else {
    adminAuthStore.logoutAdmin();
    router.push('/admin/login');
  }
};
</script>

<style scoped>
.admin-header {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 66px;
  padding: 0 28px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--line);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mobile-toggle-btn {
  display: inline-grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--paper);
  color: var(--ink);
  cursor: pointer;
  transition: all var(--ease);
}

.mobile-toggle-btn:hover {
  border-color: var(--red);
  color: var(--red);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.84rem;
}

.brand-tag {
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.01em;
}

.breadcrumb-separator {
  color: var(--line);
  font-weight: 400;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.role-badge.role-admin {
  background: var(--red-soft);
  color: var(--red);
  border: 1px solid rgba(165, 29, 45, 0.2);
}

.role-badge.role-super {
  background: #f1f5f9;
  color: #0f172a;
  border: 1px solid #cbd5e1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sound-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 38px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--paper);
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--ease);
}

.sound-toggle-btn:hover {
  border-color: var(--ink);
  color: var(--ink);
}

.sound-toggle-btn.sound-active {
  border-color: rgba(36, 107, 71, 0.35);
  background: #f2f9f5;
  color: var(--success);
}

.action-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 12px;
  border: 1px solid rgba(165, 29, 45, 0.25);
  border-radius: var(--r-sm);
  background: var(--red-soft);
  color: var(--red);
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--ease);
}

.action-pill-btn:hover {
  background: var(--red);
  color: #fff;
}

.user-dropdown {
  position: relative;
}

.user-dropdown summary::-webkit-details-marker {
  display: none;
}

.user-trigger {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 42px;
  padding: 0 10px 0 6px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--paper);
  color: var(--ink);
  cursor: pointer;
  list-style: none;
  transition: all var(--ease);
}

.user-trigger:hover,
.user-dropdown[open] .user-trigger {
  border-color: var(--red);
  background: var(--soft);
}

.avatar-circle {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 50%;
  background: var(--red);
  color: #fff;
  font-size: 0.76rem;
  font-weight: 800;
}

.user-info {
  display: flex;
  flex-direction: column;
  text-align: left;
  line-height: 1.15;
}

.user-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--ink);
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-role {
  font-size: 0.66rem;
  color: var(--muted);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 220px;
  padding: 8px;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: var(--paper);
  box-shadow: var(--shadow);
  z-index: 50;
}

.dropdown-header {
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
}

.dropdown-header strong {
  font-size: 0.86rem;
  color: var(--ink);
}

.dropdown-header small {
  font-size: 0.72rem;
  color: var(--muted);
}

.dropdown-divider {
  height: 1px;
  margin: 6px 0;
  background: var(--line);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  color: var(--ink);
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: all var(--ease);
}

.dropdown-item:hover {
  background: var(--soft);
  color: var(--red);
}

.logout-btn {
  color: var(--color-danger, #dc2626);
}

.logout-btn:hover {
  background: #fef2f2;
  color: #dc2626;
}

@media (max-width: 1040px) {
  .admin-header {
    padding: 0 20px;
  }
  .mobile-toggle-btn {
    display: inline-grid;
  }
}

@media (max-width: 680px) {
  .admin-header {
    padding: 0 16px;
    min-height: 60px;
  }
  .user-info, .sound-label {
    display: none;
  }
  .action-pill-btn span {
    display: none;
  }
  .sound-toggle-btn, .action-pill-btn {
    padding: 0 10px;
  }
}
</style>
