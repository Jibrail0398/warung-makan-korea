<template>
  <div class="admin-shell">
    <!-- Sidebar Navigation -->
    <AdminSidebar
      :isOpen="isSidebarOpen"
      :isCollapsed="isSidebarCollapsed"
      :isSuperAdmin="false"
      @close="isSidebarOpen = false"
      @toggle-collapse="isSidebarCollapsed = !isSidebarCollapsed"
    />

    <!-- Main Content Area -->
    <div
      class="admin-main-wrap"
      :class="{ 'sidebar-collapsed': isSidebarCollapsed }"
    >
      <!-- Sticky Header -->
      <AdminHeader
        :isSuperAdmin="false"
        :isCollapsed="isSidebarCollapsed"
        @toggle-sidebar="handleToggleSidebar"
        @new-order-received="handleNewOrderNotification"
      />

      <!-- Real-time New Order Banner (when triggered) -->
      <div v-if="latestOrder" class="incoming-order-banner" role="status">
        <div class="banner-content">
          <span class="live-dot" aria-hidden="true"></span>
          <strong>Pesanan Baru Masuk!</strong>
          <span class="banner-order-id">{{ latestOrder.orderNumber || latestOrder.id }}</span>
          <span class="banner-customer">{{ latestOrder.customer?.name }}</span>
          <span class="banner-total">₩{{ (latestOrder.total || 0).toLocaleString('ko-KR') }}</span>
        </div>
        <div class="banner-actions">
          <router-link
            :to="`/admin/orders/${latestOrder.id}`"
            class="banner-view-btn"
          >
            Lihat Detail
          </router-link>
          <button
            type="button"
            class="banner-close-btn"
            aria-label="Tutup notifikasi"
            @click="latestOrder = null"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Page Content -->
      <main class="admin-content-area">
        <slot>
          <router-view />
        </slot>
      </main>

      <!-- Admin Footer -->
      <AdminFooter />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AdminHeader from '../components/admin/AdminHeader.vue';
import AdminSidebar from '../components/admin/AdminSidebar.vue';
import AdminFooter from '../components/admin/AdminFooter.vue';

const isSidebarOpen = ref(false);
const isSidebarCollapsed = ref(false);
const latestOrder = ref(null);

const handleToggleSidebar = () => {
  if (typeof window !== 'undefined' && window.innerWidth <= 1040) {
    isSidebarOpen.value = !isSidebarOpen.value;
  } else {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
  }
};

const handleNewOrderNotification = (order) => {
  latestOrder.value = order;
  // Auto dismiss after 15s if not clicked
  setTimeout(() => {
    if (latestOrder.value?.id === order.id) {
      latestOrder.value = null;
    }
  }, 15000);
};
</script>

<style scoped>
.admin-shell {
  min-height: 100vh;
  display: flex;
  background: var(--paper);
  color: var(--ink);
}

.admin-main-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: 260px;
  background: #fbf9f7;
  min-height: 100vh;
  transition: margin-left var(--ease);
}

.admin-main-wrap.sidebar-collapsed {
  margin-left: 74px;
}

.admin-content-area {
  flex: 1;
  padding: 32px 36px;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
}

.incoming-order-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 24px;
  background: #fef2f2;
  border-bottom: 1px solid #fca5a5;
  color: var(--red);
  animation: pulseIn 300ms ease;
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.86rem;
  flex-wrap: wrap;
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--red);
  animation: blink 1.2s infinite;
}

.banner-order-id {
  font-weight: 750;
  color: var(--ink);
}

.banner-customer {
  color: var(--muted);
}

.banner-total {
  font-weight: 750;
}

.banner-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.banner-view-btn {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border-radius: 4px;
  background: var(--red);
  color: #fff;
  font-size: 0.76rem;
  font-weight: 700;
  text-decoration: none;
}

.banner-close-btn {
  color: var(--muted);
  font-size: 0.85rem;
  padding: 4px;
  cursor: pointer;
}

@keyframes blink {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(0.8); }
}

@keyframes pulseIn {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@media (max-width: 1040px) {
  .admin-main-wrap,
  .admin-main-wrap.sidebar-collapsed {
    margin-left: 0;
  }
  .admin-content-area {
    padding: 24px 20px;
  }
}

@media (max-width: 640px) {
  .admin-content-area {
    padding: 20px 14px;
  }
  .incoming-order-banner {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px 16px;
  }
}
</style>

