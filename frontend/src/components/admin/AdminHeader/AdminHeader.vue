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
      <!-- Tombol Lihat Website (Frontend Customer) -->
      <router-link
        to="/home"
        class="view-website-btn"
        title="Lihat Website Frontend Pelanggan"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>Lihat Website</span>
      </router-link>

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

  <router-link to="/admin/profile" class="dropdown-item">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle cx="12" cy="7" r="4"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <span>Profil Admin</span>
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

    <!-- Admin Logout Confirmation Modal -->
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
  </header>
</template>

<script>
import AdminHeaderScript from './AdminHeader.js';

export default {
  ...AdminHeaderScript
};
</script>
