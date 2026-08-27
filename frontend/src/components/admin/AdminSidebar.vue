<template>
  <div>
    <!-- Backdrop for mobile drawer -->
    <div
      v-if="isOpen"
      class="sidebar-backdrop"
      aria-hidden="true"
      @click="$emit('close')"
    ></div>

    <aside
      class="admin-sidebar"
      :class="{ 'sidebar-open': isOpen, 'sidebar-collapsed': isCollapsed }"
      aria-label="Admin navigation"
    >
      <!-- Sidebar Brand Top -->
      <div class="sidebar-brand-wrapper">
        <router-link
          :to="isSuperAdmin ? '/super-admin/dashboard' : '/admin/dashboard'"
          class="brand-link"
          :title="isSuperAdmin ? 'Super Admin Console' : 'Admin / Kasir'"
          @click="$emit('close')"
        >
          <span class="brand-mark">WN</span>
          <div v-if="!isCollapsed" class="brand-text">
            <strong>Warung Nusantara</strong>
            <small>{{ isSuperAdmin ? 'SUPER ADMIN CONSOLE' : 'ADMIN / CASHIER' }}</small>
          </div>
        </router-link>

        <button
          class="mobile-close-btn"
          type="button"
          aria-label="Close navigation menu"
          @click="$emit('close')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <!-- Navigation Section -->
      <nav class="sidebar-nav">
        <div v-if="!isCollapsed" class="nav-section-title">
          <span>{{ isSuperAdmin ? 'DEVELOPER MENU' : 'MAIN MENU' }}</span>
        </div>

        <!-- ADMIN / KASIR NAV -->
        <template v-if="!isSuperAdmin">
          <router-link
            to="/admin/dashboard"
            class="nav-item"
            :class="{ active: isCurrentRoute('/admin/dashboard') || isCurrentRoute('/admin') }"
            :title="isCollapsed ? 'Dashboard' : ''"
            @click="$emit('close')"
          >
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8" />
            </svg>
            <span v-if="!isCollapsed" class="nav-label">Dashboard</span>
          </router-link>

          <router-link
            to="/admin/orders"
            class="nav-item"
            :class="{ active: isCurrentRoute('/admin/orders') }"
            :title="isCollapsed ? 'Pesanan' : ''"
            @click="$emit('close')"
          >
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" stroke-width="1.8" />
              <path d="M9 14h6M9 18h4M9 10h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <span v-if="!isCollapsed" class="nav-label">Pesanan</span>
            <span v-if="pendingOrdersCount > 0" class="nav-badge" :class="{ 'badge-dot': isCollapsed }">
              {{ isCollapsed ? '' : pendingOrdersCount }}
            </span>
          </router-link>

          <router-link
            to="/admin/products"
            class="nav-item"
            :class="{ active: isCurrentRoute('/admin/products') }"
            :title="isCollapsed ? 'Produk' : ''"
            @click="$emit('close')"
          >
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <line x1="7" y1="7" x2="7.01" y2="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            <span v-if="!isCollapsed" class="nav-label">Produk</span>
          </router-link>

          <router-link
            to="/admin/categories"
            class="nav-item"
            :class="{ active: isCurrentRoute('/admin/categories') }"
            :title="isCollapsed ? 'Kategori' : ''"
            @click="$emit('close')"
          >
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <circle cx="18" cy="18" r="3" stroke="currentColor" stroke-width="1.8" />
            </svg>
            <span v-if="!isCollapsed" class="nav-label">Kategori</span>
          </router-link>

          <div v-if="!isCollapsed" class="nav-section-title">
            <span>LAPORAN</span>
          </div>

          <router-link
            to="/admin/reports/transactions"
            class="nav-item"
            :class="{ active: isCurrentRoute('/admin/reports/transactions') }"
            :title="isCollapsed ? 'Laporan Transaksi' : ''"
            @click="$emit('close')"
          >
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span v-if="!isCollapsed" class="nav-label">Laporan Transaksi</span>
          </router-link>

          <router-link
            to="/admin/reports/financial"
            class="nav-item"
            :class="{ active: isCurrentRoute('/admin/reports/financial') }"
            :title="isCollapsed ? 'Laporan Keuangan' : ''"
            @click="$emit('close')"
          >
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <span v-if="!isCollapsed" class="nav-label">Laporan Keuangan</span>
          </router-link>

          <div v-if="!isCollapsed" class="nav-section-title">
            <span>PENGATURAN</span>
          </div>

          <router-link
            to="/admin/reset-password"
            class="nav-item"
            :class="{ active: isCurrentRoute('/admin/reset-password') }"
            :title="isCollapsed ? 'Reset Password' : ''"
            @click="$emit('close')"
          >
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="1.8" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="1.8" />
              <circle cx="12" cy="16" r="1.5" fill="currentColor" />
            </svg>
            <span v-if="!isCollapsed" class="nav-label">Reset Password</span>
          </router-link>
        </template>

        <!-- SUPER ADMIN NAV -->
        <template v-else>
          <router-link
            to="/super-admin/dashboard"
            class="nav-item"
            :class="{ active: isCurrentRoute('/super-admin/dashboard') || isCurrentRoute('/super-admin') }"
            :title="isCollapsed ? 'Dashboard' : ''"
            @click="$emit('close')"
          >
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.8" />
              <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <span v-if="!isCollapsed" class="nav-label">Dashboard</span>
          </router-link>

          <router-link
            to="/super-admin/audit-logs"
            class="nav-item"
            :class="{ active: isCurrentRoute('/super-admin/audit-logs') }"
            :title="isCollapsed ? 'Audit Log' : ''"
            @click="$emit('close')"
          >
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
            </svg>
            <span v-if="!isCollapsed" class="nav-label">Audit Log</span>
          </router-link>

          <router-link
            to="/super-admin/admins"
            class="nav-item"
            :class="{ active: isCurrentRoute('/super-admin/admins') }"
            :title="isCollapsed ? 'Management Admin' : ''"
            @click="$emit('close')"
          >
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <span v-if="!isCollapsed" class="nav-label">Management Admin</span>
          </router-link>
        </template>
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-bottom">
        <button
          type="button"
          class="logout-sidebar-btn"
          :title="isCollapsed ? 'Keluar' : ''"
          @click="handleLogout"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <polyline points="16 17 21 12 16 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
          <span v-if="!isCollapsed">Keluar</span>
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminAuthStore } from '../../stores/adminAuth.js';
import { adminService } from '../../services/adminService.js';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  isCollapsed: {
    type: Boolean,
    default: false
  },
  isSuperAdmin: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close', 'toggle-collapse']);

const route = useRoute();
const router = useRouter();
const adminAuthStore = useAdminAuthStore();

const pendingOrdersCount = ref(0);

onMounted(async () => {
  if (!props.isSuperAdmin) {
    try {
      const orders = await adminService.getOrders();
      pendingOrdersCount.value = orders.filter(
        o => o.status === 'Payment Verification' || o.status === 'Processing'
      ).length;
    } catch (e) {
      console.warn(e);
    }
  }
});

const isCurrentRoute = (path) => {
  return route.path === path;
};

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
.admin-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 260px;
  background: #ffffff;
  border-right: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  z-index: 40;
  transition: width var(--ease), transform var(--ease);
}

.admin-sidebar.sidebar-collapsed {
  width: 74px;
}

.sidebar-brand-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 66px;
  padding: 0 20px;
  border-bottom: 1px solid var(--line);
  transition: padding var(--ease);
}

.admin-sidebar.sidebar-collapsed .sidebar-brand-wrapper {
  padding: 0 18px;
  justify-content: center;
}

.brand-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.brand-mark {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: var(--r-sm);
  background: var(--red);
  color: #ffffff;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: -0.06em;
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  white-space: nowrap;
}

.brand-text strong {
  font-size: 0.88rem;
  font-weight: 750;
  color: var(--ink);
}

.brand-text small {
  margin-top: 3px;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--muted);
}

.mobile-close-btn {
  display: none;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: var(--r-sm);
  color: var(--muted);
  cursor: pointer;
}

.mobile-close-btn:hover {
  background: var(--soft);
  color: var(--ink);
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.admin-sidebar.sidebar-collapsed .sidebar-nav {
  padding: 16px 8px;
}

.nav-section-title {
  padding: 12px 10px 6px;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: var(--muted);
  text-transform: uppercase;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 42px;
  padding: 0 12px;
  border-radius: var(--r-sm);
  color: var(--muted);
  font-size: 0.84rem;
  font-weight: 650;
  text-decoration: none;
  transition: all var(--ease);
}

.admin-sidebar.sidebar-collapsed .nav-item {
  justify-content: center;
  padding: 0;
}

.nav-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.nav-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-badge {
  display: grid;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  place-items: center;
  border-radius: 999px;
  background: var(--red);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 800;
}

.nav-badge.badge-dot {
  position: absolute;
  top: 8px;
  right: 14px;
  min-width: 8px;
  width: 8px;
  height: 8px;
  padding: 0;
}

.nav-item:hover {
  background: var(--soft);
  color: var(--ink);
}

.nav-item.active {
  background: var(--red-soft);
  color: var(--red);
  font-weight: 750;
}

.nav-item.active .nav-icon {
  color: var(--red);
}

.sidebar-bottom {
  padding: 12px 14px;
  border-top: 1px solid var(--line);
}

.admin-sidebar.sidebar-collapsed .sidebar-bottom {
  padding: 12px 8px;
}

.logout-sidebar-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 40px;
  padding: 0 12px;
  border-radius: var(--r-sm);
  color: var(--color-danger, #dc2626);
  font-size: 0.82rem;
  font-weight: 700;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--ease);
}

.admin-sidebar.sidebar-collapsed .logout-sidebar-btn {
  justify-content: center;
  padding: 0;
}

.logout-sidebar-btn:hover {
  background: #fef2f2;
  border-color: #fca5a5;
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(25, 21, 18, 0.45);
  backdrop-filter: blur(2px);
  z-index: 35;
}

@media (max-width: 1040px) {
  .admin-sidebar {
    transform: translateX(-100%);
    width: 260px !important;
  }

  .admin-sidebar.sidebar-open {
    transform: translateX(0);
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.18);
  }

  .mobile-close-btn {
    display: inline-grid;
  }
}
</style>

