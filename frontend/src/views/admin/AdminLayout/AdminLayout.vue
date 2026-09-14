<template>
  <div class="admin-shell">
    <AdminSidebar :isOpen="isSidebarOpen" :isCollapsed="isSidebarCollapsed" :isSuperAdmin="isSuperAdmin" @close="isSidebarOpen = false" @toggle-collapse="isSidebarCollapsed = !isSidebarCollapsed" />
    <div class="admin-main-wrap" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <AdminHeader :isSuperAdmin="isSuperAdmin" :isCollapsed="isSidebarCollapsed" @toggle-sidebar="handleToggleSidebar" @new-order-received="handleNewOrderNotification" />
      <div v-if="latestOrder" class="incoming-order-banner" role="status">
        <div class="banner-content">
          <span class="live-dot" aria-hidden="true"></span>
          <strong>Pesanan Baru Masuk!</strong>
          <span class="banner-order-id">{{ latestOrder.orderNumber || latestOrder.id }}</span>
          <span class="banner-customer">{{ latestOrder.customer?.name }}</span>
          <span class="banner-total">₩{{ (latestOrder.total || 0).toLocaleString('ko-KR') }}</span>
        </div>
        <div class="banner-actions">
          <router-link :to="`/admin/orders/${latestOrder.id}`" class="banner-view-btn">Lihat Detail</router-link>
          <button type="button" class="banner-close-btn" aria-label="Tutup notifikasi" @click="latestOrder = null">✕</button>
        </div>
      </div>
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
