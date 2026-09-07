<template>
  <div class="superadmin-shell">
    <!-- Sidebar Navigation -->
    <AdminSidebar
      :isOpen="isSidebarOpen"
      :isCollapsed="isSidebarCollapsed"
      :isSuperAdmin="true"
      @close="isSidebarOpen = false"
      @toggle-collapse="isSidebarCollapsed = !isSidebarCollapsed"
    />

    <!-- Main Content Area -->
    <div
      class="superadmin-main-wrap"
      :class="{ 'sidebar-collapsed': isSidebarCollapsed }"
    >
      <!-- Sticky Header -->
      <AdminHeader
        :isSuperAdmin="true"
        :isCollapsed="isSidebarCollapsed"
        @toggle-sidebar="handleToggleSidebar"
      />

      <!-- Page Content -->
      <main class="superadmin-content-area">
        <slot>
          <router-view />
        </slot>
      </main>

      <!-- Footer -->
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

const handleToggleSidebar = () => {
  if (typeof window !== 'undefined' && window.innerWidth <= 1040) {
    isSidebarOpen.value = !isSidebarOpen.value;
  } else {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
  }
};
</script>

<style scoped>
.superadmin-shell {
  min-height: 100vh;
  display: flex;
  background: var(--paper);
  color: var(--ink);
}

.superadmin-main-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: 260px;
  background: #f8fafc;
  min-height: 100vh;
  transition: margin-left var(--ease);
}

.superadmin-main-wrap.sidebar-collapsed {
  margin-left: 74px;
}

.superadmin-content-area {
  flex: 1;
  padding: 32px 36px;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 1040px) {
  .superadmin-main-wrap,
  .superadmin-main-wrap.sidebar-collapsed {
    margin-left: 0;
  }
  .superadmin-content-area {
    padding: 24px 20px;
  }
}

@media (max-width: 640px) {
  .superadmin-content-area {
    padding: 20px 14px;
  }
}
</style>

