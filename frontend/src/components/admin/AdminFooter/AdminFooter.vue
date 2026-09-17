<template>
  <footer class="admin-footer">
    <div class="footer-inner">
      <div class="footer-left">
        <span class="copyright">© 2026 <strong>Warung Nusantara</strong></span>
        <span class="footer-divider">/</span>
        <span class="panel-tag">Portal Manajemen & Kasir</span>
      </div>
      <div class="footer-right">
        <span class="system-status-pill">
          <span class="status-pulse-dot"></span>
          <span>Sistem Online</span>
        </span>
        <span class="footer-divider">/</span>
        <router-link to="/" class="storefront-link" target="_blank">
          <span>Lihat Toko</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </router-link>
      </div>
    </div>
  </footer>
</template>

<script>
import './AdminFooter.css';

export default {
  name: 'AdminFooter'
};
</script>
