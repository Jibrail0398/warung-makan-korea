<template>
  <div class="superadmin-shell">
    <AdminSidebar :isOpen="isSidebarOpen" :isCollapsed="isSidebarCollapsed" :isSuperAdmin="true" @close="isSidebarOpen = false" @toggle-collapse="isSidebarCollapsed = !isSidebarCollapsed" />
    <div class="superadmin-main-wrap" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <AdminHeader :isSuperAdmin="true" :isCollapsed="isSidebarCollapsed" @toggle-sidebar="handleToggleSidebar" />
      <main class="superadmin-content-area">
        <slot><router-view /></slot>
      </main>
      <AdminFooter />
    </div>
  </div>
</template>

<script>
import SuperAdminLayoutScript from './SuperAdminLayout.js';
export default { ...SuperAdminLayoutScript };
</script>
