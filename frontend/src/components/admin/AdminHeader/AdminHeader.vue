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
      <!-- <button
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
      </button> -->

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
          </div>

          <div class="dropdown-divider"></div>

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
      eyebrow="Konfirmasi Logout"
      title="Keluar dari Panel Admin?"
      message="Apakah Anda yakin ingin keluar dari panel admin? Sesi Anda akan diakhiri dan dialihkan ke halaman login."
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
