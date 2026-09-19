<template>
  <div>
    <Transition name="fade">
      <div v-if="isOpen" class="sidebar-backdrop" aria-hidden="true" @click="$emit('close')"></div>
    </Transition>
    <aside class="admin-sidebar" :class="{ 'sidebar-open': isOpen, 'sidebar-collapsed': isCollapsed }" aria-label="Admin navigation">
      <div class="sidebar-brand-wrapper">
        <router-link :to="isSuperAdmin ? '/admin/audit-logs' : '/admin/dashboard'" class="brand-link" :title="isSuperAdmin ? 'Super Admin Console' : 'Admin / Kasir'" @click="$emit('close')">
          <span class="brand-mark">AR</span>
          <div v-if="!isCollapsed" class="brand-text"><strong>Anekarasa Resto</strong><small>{{ isSuperAdmin ? 'SUPER ADMIN CONSOLE' : 'ADMIN / CASHIER' }}</small></div>
        </router-link>
        <button class="mobile-close-btn" type="button" aria-label="Close navigation menu" @click="$emit('close')"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg></button>
      </div>
      <nav class="sidebar-nav">
        <div v-if="!isCollapsed" class="nav-section-title"><span>{{ isSuperAdmin ? 'DEVELOPER MENU' : 'MAIN MENU' }}</span></div>
        <template v-if="!isSuperAdmin">
          <router-link to="/admin/dashboard" class="nav-item" :class="{ active: isCurrentRoute('/admin/dashboard') || isCurrentRoute('/admin') }" :title="isCollapsed ? 'Dashboard' : ''" @click="$emit('close')"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8" /><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8" /><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8" /><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8" /></svg><span v-if="!isCollapsed" class="nav-label">Dashboard</span></router-link>
          <router-link to="/admin/orders" class="nav-item" :class="{ active: isCurrentRoute('/admin/orders') }" :title="isCollapsed ? 'Pesanan' : ''" @click="$emit('close')"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" stroke-width="1.8" /><path d="M9 14h6M9 18h4M9 10h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg><span v-if="!isCollapsed" class="nav-label">Pesanan</span><span v-if="pendingOrdersCount > 0" class="nav-badge" :class="{ 'badge-dot': isCollapsed }">{{ isCollapsed ? '' : pendingOrdersCount }}</span></router-link>
          <div v-if="!isCollapsed" class="nav-section-title"><span>KATALOG & PRODUK</span></div>
          <router-link to="/admin/products" class="nav-item" :class="{ active: isCurrentRoute('/admin/products') }" :title="isCollapsed ? 'Produk' : ''" @click="$emit('close')"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><line x1="7" y1="7" x2="7.01" y2="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg><span v-if="!isCollapsed" class="nav-label">Produk</span></router-link>
          <router-link to="/admin/main-categories" class="nav-item" :class="{ active: isCurrentRoute('/admin/main-categories') }" :title="isCollapsed ? 'Kategori Besar' : ''" @click="$emit('close')"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg><span v-if="!isCollapsed" class="nav-label">Kategori</span></router-link>
          <div v-if="!isCollapsed" class="nav-section-title"><span>LAPORAN</span></div>
          <router-link to="/admin/reports/transactions" class="nav-item" :class="{ active: isCurrentRoute('/admin/reports/transactions') }" :title="isCollapsed ? 'Laporan Transaksi' : ''" @click="$emit('close')"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg><span v-if="!isCollapsed" class="nav-label">Laporan Transaksi</span></router-link>
          <div v-if="!isCollapsed" class="nav-section-title"><span>PENGATURAN</span></div>
          <router-link to="/admin/admins" class="nav-item" :class="{ active: isCurrentRoute('/admin/admins') }" :title="isCollapsed ? 'Management Admin' : ''" @click="$emit('close')"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg><span v-if="!isCollapsed" class="nav-label">Management Admin</span></router-link>
          <router-link to="/admin/bank-accounts" class="nav-item" :class="{ active: isCurrentRoute('/admin/bank-accounts') }" :title="isCollapsed ? 'Rekening Bank' : ''" @click="$emit('close')"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 10h18M4 6h16a1 1 0 0 1 1 1v1H3V7a1 1 0 0 1 1-1Zm1 5v6m5-6v6m4-6v6m5-6v6M2 21h20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg><span v-if="!isCollapsed" class="nav-label">Rekening Bank</span></router-link>
        </template>
        <template v-else>
          <router-link to="/admin/audit-logs" class="nav-item" :class="{ active: isCurrentRoute('/admin/audit-logs') }" :title="isCollapsed ? 'Audit Log' : ''" @click="$emit('close')"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" /></svg><span v-if="!isCollapsed" class="nav-label">Audit Log</span></router-link>
          <router-link to="/admin/admins" class="nav-item" :class="{ active: isCurrentRoute('/admin/admins') }" :title="isCollapsed ? 'Management Admin' : ''" @click="$emit('close')"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg><span v-if="!isCollapsed" class="nav-label">Management Admin</span></router-link>
          <div v-if="!isCollapsed" class="nav-section-title"><span>WHATSAPP</span></div>
          <router-link to="/admin/whatsapp-sessions" class="nav-item" :class="{ active: isCurrentRoute('/admin/whatsapp-sessions') }" :title="isCollapsed ? 'WhatsApp Session' : ''" @click="$emit('close')"><svg class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.58 7.45L3.5 20l1.1-4.13A8.5 8.5 0 1 1 20.5 11.5Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /><path d="M8.2 8.2c.25-.3.52-.31.76-.05l.62.7c.2.23.22.45.07.7l-.3.48c.5 1.02 1.32 1.84 2.34 2.34l.48-.3c.25-.15.47-.13.7.07l.7.62c.26.24.25.51-.05.76-.45.4-1.1.5-1.68.28a8.1 8.1 0 0 1-4.32-4.32c-.22-.58-.12-1.23.28-1.68Z" fill="currentColor" /></svg><span v-if="!isCollapsed" class="nav-label">WhatsApp Session</span></router-link>
        </template>
      </nav>
      <div class="sidebar-bottom">
        <button type="button" class="logout-sidebar-btn" :title="isCollapsed ? 'Keluar' : ''" @click="handleLogout"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><polyline points="16 17 21 12 16 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg><span v-if="!isCollapsed">Keluar</span></button>
      </div>
    </aside>

    <!-- Logout Confirmation Modal -->
    <ConfirmModal
      :visible="showLogoutConfirm"
      type="danger"
      icon="logout"
      title="Keluar dari Panel Admin?"
      message="Apakah Anda yakin ingin keluar dari panel admin?"
      confirm-text="Ya, Keluar"
      cancel-text="Batal"
      @close="showLogoutConfirm = false"
      @cancel="showLogoutConfirm = false"
      @confirm="confirmLogout"
    />
  </div>
</template>

<script>
import AdminSidebarScript from './AdminSidebar.js';
export default { ...AdminSidebarScript };
</script>
