<template>
  <div class="admin-shell">
    <AdminSidebar :isOpen="isSidebarOpen" :isCollapsed="isSidebarCollapsed" :isSuperAdmin="isSuperAdmin" @close="isSidebarOpen = false" @toggle-collapse="isSidebarCollapsed = !isSidebarCollapsed" />
    <div class="admin-main-wrap" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <AdminHeader :isSuperAdmin="isSuperAdmin" :isCollapsed="isSidebarCollapsed" @toggle-sidebar="handleToggleSidebar" @new-order-received="handleNewOrderNotification" />
      <main class="admin-content-area">
        <slot><router-view /></slot>
      </main>
      <AdminFooter />
      <ToastNotification :visible="isToastVisible" :message="toastMessage" :type="toastType" />
    </div>
  </div>
</template>

<script>
import AdminLayoutScript from './AdminLayout.js';
export default { ...AdminLayoutScript };
</script>
