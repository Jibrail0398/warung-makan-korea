<template>
  <header class="site-header" :class="{ 'header-hidden': !isHeaderVisible }">
    <div class="container header-inner" :class="{ 'checkout-header-inner': variant === 'checkout', 'cart-header-inner': variant === 'cart' }">
      <!-- Mobile menu button (Default variant) -->
      <button
        v-if="variant === 'default'"
        class="icon-button mobile-menu-button"
        type="button"
        aria-label="Open navigation"
        :aria-expanded="isDrawerOpen"
        @click="toggleDrawer"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>

      <!-- Brand (All variants except cart which has its own brand above) -->
      <router-link v-if="variant !== 'cart'" class="brand" to="/" aria-label="Warung Nusantara homepage">
        <span class="brand-mark" aria-hidden="true">WN</span>
        <span class="brand-copy">
          <strong>Warung Nusantara</strong>
          <small>Indonesia in Korea</small>
        </span>
      </router-link>

      <!-- Default variant desktop nav & actions -->
      <template v-if="variant === 'default'">
        <nav class="desktop-nav" aria-label="Primary navigation">
          <router-link to="/" :class="{ active: activeSection === 'home' }">Home</router-link>
          <router-link to="/#menu" :class="{ active: activeSection === 'menu' }">Menu</router-link>
          <router-link to="/#about" :class="{ active: activeSection === 'about' }">About</router-link>
        </nav>

        <div class="header-actions">
          <details v-if="authStore.isAuthenticated" class="profile-dropdown">
            <summary class="profile-trigger">
              <span class="profile-avatar">{{ authStore.displayName.charAt(0).toUpperCase() }}</span>
              <span class="profile-name">{{ authStore.displayName }}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </summary>

            <div class="profile-menu">
              <router-link to="/order-history">
                Order History
              </router-link>

              <router-link v-if="isAdminOrStaff && !isSuperAdmin" to="/admin/dashboard" class="staff-link">
                Admin Dashboard
              </router-link>

              <router-link v-if="isSuperAdmin" to="/admin/audit-logs" class="staff-link">
                Audit Log
              </router-link>

              <button
                v-if="authStore.isAuthenticated"
                type="button"
                class="logout-button"
                @click="handleLogout"
              >
                Logout
              </button>
            </div>
          </details>

          <router-link v-if="!authStore.isAuthenticated" class="login-link" to="/login">
            Login
          </router-link>
          <router-link class="cart-link" to="/cart" aria-label="Open cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3.5 4h2l1.8 10.2a2 2 0 0 0 2 1.7h7.9a2 2 0 0 0 2-1.6L20.5 8H6.3M9.5 20a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1ZM17.5 20a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="cart-text">Cart</span>
            <span class="cart-badge" aria-live="polite">{{ cartStore.cartCount }}</span>
          </router-link>
        </div>

        <router-link class="icon-button mobile-header-action" to="/cart" aria-label="Open cart">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3.5 4h2l1.8 10.2a2 2 0 0 0 2 1.7h7.9a2 2 0 0 0 2-1.6L20.5 8H6.3M9.5 20a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1ZM17.5 20a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="cart-badge" aria-live="polite">{{ cartStore.cartCount }}</span>
        </router-link>
      </template>

      <!-- Cart variant nav -->
      <template v-else-if="variant === 'cart'">
        <router-link class="brand" to="/" aria-label="Warung Nusantara homepage">
          <span class="brand-mark" aria-hidden="true">WN</span>
          <span class="brand-copy">
            <strong>Warung Nusantara</strong>
            <small>Indonesia in Korea</small>
          </span>
        </router-link>
        <nav class="cart-nav">
          <router-link to="/menu" class="back-to-menu-link" aria-label="Back to menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 12H5m6-6-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </router-link>
        </nav>
      </template>

      <!-- Checkout variant header -->
      <template v-else-if="variant === 'checkout'">
        <div class="checkout-header-title">
          {{ title }}
        </div>

        <router-link class="back-link" to="/cart">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5m6-6-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="back-text">Back to cart</span>
        </router-link>
      </template>
    </div>
  </header>

  <!-- Mobile Drawer -->
  <MobileDrawer
    v-if="variant === 'default'"
    :isOpen="isDrawerOpen"
    @close="closeDrawer"
    @logout="handleLogout"
  />

  <!-- Logout Confirmation Modal -->
  <ConfirmModal
    :visible="showLogoutConfirm"
    type="danger"
    icon="logout"
    eyebrow="Konfirmasi Logout"
    title="Keluar dari Akun?"
    message="Apakah Anda yakin ingin keluar? Anda perlu login kembali untuk mengakses riwayat pesanan dan akun Anda."
    confirm-text="Ya, Keluar"
    cancel-text="Batal"
    @close="showLogoutConfirm = false"
    @cancel="showLogoutConfirm = false"
    @confirm="confirmLogout"
  />
</template>

<script>
import AppHeaderScript from './AppHeader.js';

export default {
  ...AppHeaderScript
};
</script>
