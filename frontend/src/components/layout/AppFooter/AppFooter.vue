<template>
  <footer class="site-footer">
    <div class="container">
      <div v-if="!simple" class="footer-grid">
        <div>
          <router-link class="brand" to="/" aria-label="Warung Nusantara homepage"><span class="brand-mark" aria-hidden="true">WN</span><span class="brand-copy"><strong>Warung Nusantara</strong><small>Indonesia in Korea</small></span></router-link>
          <p class="footer-description">Authentic Indonesian food and ingredients, available for online ordering in Korea.</p>
        </div>
        <div><h2 class="footer-col-title">Explore</h2><ul class="footer-links"><li><router-link to="/">Home</router-link></li><li><router-link to="/#menu">Menu</router-link></li><li><router-link to="/#about">About</router-link></li></ul></div>
        <div><h2 class="footer-col-title">Account</h2><ul class="footer-links"><li><router-link to="/login">Login</router-link></li><li><router-link to="/cart">Cart</router-link></li><li><router-link to="/order-history">Order history</router-link></li></ul></div>
        <div>
          <h2 class="footer-col-title">Contact</h2>
          <div class="footer-contact">
            <a href="tel:+821012345678"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8.1 3.5H5.7c-.8 0-1.5.6-1.5 1.4 0 8.2 6.7 14.9 14.9 14.9.8 0 1.4-.7 1.4-1.5v-2.4l-4.1-1.1-1.2 2a12.7 12.7 0 0 1-8-8l2-1.2-1.1-4.1Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>+82 10 1234 5678</a>
            <a href="mailto:hello@warungnusantara.kr"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6.5h16v11H4v-11Zm.5.5L12 13l7.5-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>hello@warungnusantara.kr</a>
          </div>
          <div class="social-links" aria-label="Social media">
            <a href="#" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" stroke-width="1.6" /><circle cx="12" cy="12" r="3.5" stroke="currentColor" stroke-width="1.6" /><circle cx="17.4" cy="6.8" r=".8" fill="currentColor" /></svg></a>
            <a href="#" aria-label="YouTube"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 8.1c-.2-1.1-.9-1.9-2-2.1A31 31 0 0 0 12 5.5 31 31 0 0 0 6 6c-1.1.2-1.8 1-2 2.1A20.5 20.5 0 0 0 3.7 12c0 1.3.1 2.6.3 3.9.2 1.1.9 1.9 2 2.1 2 .4 4 .5 6 .5s4-.1 6-.5c1.1-.2 1.8-1 2-2.1.2-1.3.3-2.6.3-3.9s-.1-2.6-.3-3.9Z" stroke="currentColor" stroke-width="1.5" /><path d="m10 9 5 3-5 3V9Z" fill="currentColor" /></svg></a>
            <a href="#" aria-label="KakaoTalk"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4C7 4 3 7.1 3 11c0 2.5 1.7 4.7 4.2 5.9L6.5 20l3.6-2.2c.6.1 1.2.2 1.9.2 5 0 9-3.1 9-7s-4-7-9-7Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" /></svg></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom" :class="{ 'simple-bottom': simple }"><span>&copy; 2026 Warung Nusantara. All rights reserved.</span><span>Authentic Indonesian restaurant in Korea</span></div>
    </div>
  </footer>
</template>

<script>
import './AppFooter.css';
export default {
  name: 'AppFooter',
  props: { simple: { type: Boolean, default: false } }
};
</script>
