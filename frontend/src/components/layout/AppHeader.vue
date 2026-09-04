<template>
  <header
    class="site-header"
    :class="{ 'header-hidden': !isHeaderVisible }"
  >
    <div class="container header-inner" :class="{ 'checkout-header-inner': variant === 'checkout' }">
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

      <!-- Brand (All variants) -->
      <router-link class="brand" to="/" aria-label="Warung Nusantara homepage">
        <span class="brand-mark" aria-hidden="true">WN</span>
        <span class="brand-copy">
          <strong>Warung Nusantara</strong>
          <small>Indonesia in Korea</small>
        </span>
      </router-link>

      <!-- Default variant desktop nav & actions -->
      <template v-if="variant === 'default'">
        <nav class="desktop-nav" aria-label="Primary navigation">
          <router-link to="/">Home</router-link>
          <router-link to="/menu">Menu</router-link>
          <a href="/#about">About</a>
          <details class="language-selector">
            <summary>
              Language
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </summary>
            <div class="language-menu">
              <button type="button" aria-current="true">English</button>
              <button type="button">한국어</button>
              <button type="button">Bahasa Indonesia</button>
            </div>
          </details>
        </nav>

        <div class="header-actions">
          <details class="profile-dropdown">
            <summary class="profile-trigger">
              <span class="profile-avatar">K</span>
              <span class="profile-name">Kelvin</span>

              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="m7 10 5 5 5-5"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </summary>

            <div class="profile-menu">
              <router-link to="/profile">
                My Profile
              </router-link>

              <router-link to="/order-history">
                Order History
              </router-link>

              <div class="profile-divider"></div>

              <button type="button" class="logout-button">
                Logout
              </button>
            </div>
          </details>

          <router-link class="login-link" to="/login">Login</router-link>
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
        <nav class="cart-nav">
          <router-link to="menu">Continue shopping</router-link>
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
  />
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '../../stores/cart.js';
import { useHeaderScroll } from '../../composables/useHeaderScroll.js';
import MobileDrawer from './MobileDrawer.vue';

defineProps({
  variant: {
    type: String,
    default: 'default' // 'default' | 'cart' | 'checkout'
  },
  title: {
    type: String,
    default: 'Checkout'
  }
});

const cartStore = useCartStore();
const isDrawerOpen = ref(false);

const { isHeaderVisible } = useHeaderScroll(isDrawerOpen);

function setDrawer(open) {
  isDrawerOpen.value = open;
  if (open) {
    document.body.classList.add('drawer-active');
  } else {
    document.body.classList.remove('drawer-active');
  }
}

function toggleDrawer() {
  setDrawer(!isDrawerOpen.value);
}

function closeDrawer() {
  setDrawer(false);
}
</script>

<style scoped>
/* =========================================================
   HEADER — RESPONSIVE SYSTEM
   ========================================================= */

.site-header {
  position: sticky;
  top: 0;
  z-index: 50;

  width: 100%;

  border-bottom: 1px solid rgba(231, 224, 217, 0.88);
  background: rgba(255, 255, 255, 0.96);

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  transform: translateY(0);
  opacity: 1;

  transition:
    transform 320ms cubic-bezier(.22, 1, .36, 1),
    opacity 220ms ease;

  will-change: transform, opacity;
}

.site-header.header-hidden {
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
}


/* =========================================================
   HEADER INNER
   ========================================================= */

.header-inner {
  width: 100%;
  max-width: 1400px;
  min-height: 76px;

  margin: 0 auto;
  padding: 0 32px;

  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;

  gap: 28px;

  box-sizing: border-box;
}

.checkout-header-inner {
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
}


/* =========================================================
   BRAND
   ========================================================= */

.brand {
  min-width: 0;

  display: inline-flex;
  align-items: center;

  gap: 11px;

  text-decoration: none;
  flex-shrink: 0;
}

.brand-mark {
  width: 40px;
  height: 40px;

  display: grid;
  place-items: center;

  flex-shrink: 0;

  border-radius: 11px;

  background: var(--red);
  color: #fff;

  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.02rem;
  font-weight: 700;

  letter-spacing: -0.08em;

  box-shadow: 0 7px 18px rgba(165, 29, 45, 0.22);
}

.brand-copy {
  min-width: 0;

  display: flex;
  flex-direction: column;

  line-height: 1.05;
}

.brand-copy strong {
  display: block;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.08rem;

  letter-spacing: -0.025em;
}

.brand-copy small {
  display: block;

  margin-top: 4px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  color: var(--muted);

  font-size: 0.57rem;
  font-weight: 750;

  letter-spacing: 0.14em;
  text-transform: uppercase;
}


/* =========================================================
   DESKTOP NAVIGATION
   ========================================================= */

.desktop-nav {
  min-width: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 29px;
}

.desktop-nav > a,
.language-selector summary {
  position: relative;

  color: #403b37;

  font-size: 0.9rem;
  font-weight: 650;

  white-space: nowrap;
  list-style: none;

  transition: color var(--ease);

  text-decoration: none;
}

.desktop-nav > a::after {
  position: absolute;

  right: 0;
  bottom: -10px;
  left: 0;

  height: 2px;

  background: var(--red);

  content: "";

  opacity: 0;

  transform: scaleX(0.45);

  transition:
    opacity var(--ease),
    transform var(--ease);
}

.desktop-nav > a:hover,
.desktop-nav > a.router-link-active,
.language-selector summary:hover {
  color: var(--red);
}

.desktop-nav > a:hover::after,
.desktop-nav > a.router-link-active::after {
  opacity: 1;
  transform: scaleX(1);
}


/* =========================================================
   LANGUAGE
   ========================================================= */

.language-selector {
  position: relative;
}

.language-selector summary {
  display: inline-flex;
  align-items: center;

  gap: 5px;

  cursor: pointer;
}

.language-selector summary::-webkit-details-marker {
  display: none;
}

.language-menu {
  position: absolute;

  top: calc(100% + 15px);
  right: 0;

  width: 180px;

  padding: 8px;

  border: 1px solid var(--line);
  border-radius: var(--r-md);

  background: var(--paper);

  box-shadow: var(--shadow);

  z-index: 100;
}

.language-menu button {
  width: 100%;

  padding: 9px 10px;

  border: 0;
  border-radius: 7px;

  background: transparent;

  text-align: left;

  cursor: pointer;

  font-family: inherit;
  font-size: 0.86rem;
}

.language-menu button:hover,
.language-menu button[aria-current="true"] {
  background: var(--soft);
  color: var(--red);
}


/* =========================================================
   HEADER ACTIONS
   ========================================================= */

.header-actions {
  display: flex;
  align-items: center;

  gap: 9px;

  min-width: 0;
}


/* =========================================================
   PROFILE
   ========================================================= */

.profile-dropdown {
  position: relative;
}

.profile-dropdown summary::-webkit-details-marker {
  display: none;
}

.profile-trigger {
  min-height: 42px;

  display: inline-flex;
  align-items: center;

  gap: 8px;

  padding: 0 11px 0 7px;

  border: 1px solid var(--line);
  border-radius: var(--r-sm);

  background: var(--paper);
  color: var(--ink);

  cursor: pointer;

  list-style: none;

  font-size: 0.86rem;
  font-weight: 700;

  transition:
    border-color var(--ease),
    background var(--ease),
    color var(--ease);

  white-space: nowrap;
}

.profile-trigger:hover,
.profile-dropdown[open] .profile-trigger {
  border-color: var(--red);
  background: var(--red-soft);
  color: var(--red);
}

.profile-avatar {
  width: 29px;
  height: 29px;

  display: grid;
  place-items: center;

  flex-shrink: 0;

  border-radius: 50%;

  background: var(--red);
  color: #fff;

  font-size: 0.72rem;
  font-weight: 800;
}

.profile-name {
  max-width: 100px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-menu {
  position: absolute;

  top: calc(100% + 10px);
  right: 0;

  width: 190px;

  padding: 8px;

  border: 1px solid var(--line);
  border-radius: var(--r-md);

  background: var(--paper);

  box-shadow: var(--shadow);

  z-index: 100;
}

.profile-menu a,
.profile-menu button {
  width: 100%;
  min-height: 40px;

  display: flex;
  align-items: center;

  gap: 10px;

  padding: 0 10px;

  border-radius: 7px;

  color: var(--ink);

  font-size: 0.84rem;
  font-weight: 650;

  text-align: left;

  transition:
    background var(--ease),
    color var(--ease);

  text-decoration: none;
}

.profile-menu a:hover,
.profile-menu button:hover {
  background: var(--soft);
  color: var(--red);
}

.profile-divider {
  height: 1px;

  margin: 7px 4px;

  background: var(--line);
}

.logout-button {
  border: 0;

  background: transparent;

  cursor: pointer;

  font-family: inherit;
}


/* =========================================================
   LOGIN
   ========================================================= */

.login-link {
  min-height: 42px;

  display: inline-flex;
  align-items: center;

  padding: 0 15px;

  border: 1px solid var(--line);
  border-radius: var(--r-sm);

  color: var(--ink);

  font-size: 0.86rem;
  font-weight: 700;

  text-decoration: none;

  white-space: nowrap;

  transition:
    border-color var(--ease),
    color var(--ease);
}

.login-link:hover {
  border-color: var(--red);
  color: var(--red);
}


/* =========================================================
   CART
   ========================================================= */

.cart-link {
  position: relative;

  min-height: 42px;

  display: inline-flex;
  align-items: center;

  gap: 8px;

  padding: 0 13px;

  border-radius: var(--r-sm);

  background: var(--red);
  color: #fff;

  font-size: 0.86rem;
  font-weight: 700;

  text-decoration: none;

  white-space: nowrap;

  transition:
    background var(--ease),
    transform var(--ease);
}

.cart-link:hover {
  background: #8f1827;
  transform: translateY(-1px);
}

.cart-text {
  display: inline;
}

.cart-badge {
  min-width: 21px;
  height: 21px;

  display: grid;
  place-items: center;

  padding: 0 5px;

  border-radius: 999px;

  background: #fff;
  color: var(--red);

  font-size: 0.7rem;
  font-weight: 800;

  box-sizing: border-box;
}


/* =========================================================
   CART VARIANT
   ========================================================= */

.cart-nav {
  justify-self: end;
}

.cart-nav a {
  color: var(--muted);

  font-size: 0.9rem;
  font-weight: 700;

  text-decoration: none;

  white-space: nowrap;

  transition: color var(--ease);
}

.cart-nav a:hover {
  color: var(--red);
}


/* =========================================================
   CHECKOUT
   ========================================================= */

.checkout-header-title {
  min-width: 0;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  color: var(--ink);

  font-family: Georgia, "Times New Roman", serif;

  font-size: 1.25rem;
  font-weight: 500;

  text-align: center;
}

.back-link {
  min-height: 40px;

  display: inline-flex;
  align-items: center;

  justify-self: end;

  gap: 7px;

  color: var(--muted);

  font-size: 0.84rem;
  font-weight: 700;

  text-decoration: none;

  white-space: nowrap;

  transition: color var(--ease);
}

.back-link:hover {
  color: var(--red);
}

.back-text {
  display: inline;
}


/* =========================================================
   ICON BUTTON
   ========================================================= */

.icon-button {
  position: relative;

  width: 44px;
  height: 44px;

  display: inline-grid;
  place-items: center;

  flex-shrink: 0;

  border: 1px solid var(--line);
  border-radius: var(--r-sm);

  background: var(--paper);

  cursor: pointer;

  transition:
    border-color var(--ease),
    color var(--ease),
    background var(--ease);
}

.icon-button:hover {
  border-color: var(--red);
  background: var(--red-soft);
  color: var(--red);
}

.mobile-header-action,
.mobile-menu-button {
  display: none;
}


/* =========================================================
   LARGE DESKTOP
   1281px+
   ========================================================= */

@media (min-width: 1281px) {
  .header-inner {
    padding-left: 36px;
    padding-right: 36px;
  }

  .desktop-nav {
    gap: 32px;
  }

  .header-actions {
    gap: 10px;
  }
}


/* =========================================================
   DESKTOP
   1101px — 1280px
   ========================================================= */

@media (max-width: 1280px) {
  .header-inner {
    gap: 22px;
    padding-left: 28px;
    padding-right: 28px;
  }

  .desktop-nav {
    gap: 22px;
  }

  .header-actions {
    gap: 7px;
  }

  .login-link {
    padding-left: 12px;
    padding-right: 12px;
  }

  .cart-link {
    padding-left: 11px;
    padding-right: 11px;
  }

  .profile-trigger {
    padding-right: 9px;
  }
}


/* =========================================================
   SMALL DESKTOP / TABLET LANDSCAPE
   961px — 1100px
   ========================================================= */

@media (max-width: 1100px) {
  .header-inner {
    min-height: 72px;

    gap: 16px;

    padding-left: 22px;
    padding-right: 22px;
  }

  .brand {
    gap: 9px;
  }

  .brand-copy strong {
    font-size: 1rem;
  }

  .brand-copy small {
    font-size: 0.53rem;
  }

  .desktop-nav {
    gap: 16px;
  }

  .desktop-nav > a,
  .language-selector summary {
    font-size: 0.83rem;
  }

  .header-actions {
    gap: 5px;
  }

  .profile-trigger {
    padding-right: 7px;
  }

  .profile-name {
    max-width: 72px;
  }

  .login-link {
    padding-left: 10px;
    padding-right: 10px;

    font-size: 0.82rem;
  }

  .cart-link {
    padding-left: 10px;
    padding-right: 10px;

    font-size: 0.82rem;
  }
}


/* =========================================================
   TABLET PORTRAIT
   861px — 960px

   Keep desktop navigation, but compact the header.
   ========================================================= */

@media (max-width: 960px) {
  .header-inner {
    min-height: 68px;

    grid-template-columns: auto minmax(0, 1fr) auto;

    gap: 12px;

    padding-left: 18px;
    padding-right: 18px;
  }

  .desktop-nav {
    gap: 12px;
  }

  .desktop-nav > a,
  .language-selector summary {
    font-size: 0.78rem;
  }

  .brand-copy strong {
    font-size: 0.94rem;
  }

  .brand-copy small {
    display: none;
  }

  .brand-mark {
    width: 36px;
    height: 36px;

    border-radius: 9px;

    font-size: 0.9rem;
  }

  .profile-trigger {
    min-height: 40px;

    padding-left: 6px;
    padding-right: 6px;

    gap: 5px;
  }

  .profile-avatar {
    width: 27px;
    height: 27px;
  }

  .profile-name {
    display: none;
  }

  .login-link {
    min-height: 40px;

    padding-left: 9px;
    padding-right: 9px;

    font-size: 0.78rem;
  }

  .cart-link {
    min-height: 40px;

    padding-left: 9px;
    padding-right: 9px;

    gap: 6px;

    font-size: 0.78rem;
  }

  .cart-badge {
    min-width: 19px;
    height: 19px;

    font-size: 0.64rem;
  }
}


/* =========================================================
   TABLET / MOBILE NAVIGATION
   <= 860px
   ========================================================= */

@media (max-width: 860px) {
  .header-inner {
    min-height: 68px;

    grid-template-columns: 44px minmax(0, 1fr) 44px;

    gap: 10px;

    padding-left: 16px;
    padding-right: 16px;
  }

  /* Hide desktop navigation */
  .desktop-nav {
    display: none;
  }

  /* Hide desktop actions */
  .header-actions {
    display: none;
  }

  /* Mobile controls */
  .mobile-menu-button,
  .mobile-header-action {
    display: inline-grid;
  }

  .header-inner > .brand {
    justify-self: center;

    min-width: 0;
    max-width: 100%;
  }

  .brand {
    gap: 8px;
  }

  .brand-mark {
    width: 34px;
    height: 34px;

    border-radius: 9px;

    font-size: 0.86rem;
  }

  .brand-copy {
    min-width: 0;
  }

  .brand-copy strong {
    max-width: 190px;

    font-size: 0.94rem;
  }

  .brand-copy small {
    display: none;
  }

  /* Mobile cart badge */
  .mobile-header-action .cart-badge {
    position: absolute;

    top: -5px;
    right: -5px;

    min-width: 19px;
    height: 19px;

    border: 2px solid #fff;

    background: var(--red);
    color: #fff;

    font-size: 0.61rem;
  }

  /* Checkout */
  .checkout-header-inner {
    grid-template-columns: minmax(0, 1fr) auto;

    gap: 12px;
  }

  .checkout-header-inner .brand {
    justify-self: start;
  }

  .checkout-header-title {
    grid-column: 1 / -1;
    grid-row: 2;

    display: none;
  }

  .back-link {
    grid-column: 2;
    grid-row: 1;
  }

  /* Cart variant */
  .cart-nav a {
    font-size: 0.84rem;
  }
}


/* =========================================================
   MOBILE
   641px — 768px
   ========================================================= */

@media (max-width: 768px) {
  .header-inner {
    min-height: 64px;

    padding-left: 14px;
    padding-right: 14px;
  }

  .brand-copy strong {
    max-width: 170px;

    font-size: 0.9rem;
  }

  .brand-mark {
    width: 32px;
    height: 32px;

    border-radius: 8px;

    font-size: 0.82rem;
  }

  .icon-button {
    width: 40px;
    height: 40px;
  }

  .mobile-menu-button svg,
  .mobile-header-action svg {
    width: 19px;
    height: 19px;
  }
}


/* =========================================================
   MOBILE
   <= 640px
   ========================================================= */

@media (max-width: 640px) {
  .site-header {
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
  }

  .header-inner {
    min-height: 62px;

    grid-template-columns: 40px minmax(0, 1fr) 40px;

    gap: 8px;

    padding-left: 12px;
    padding-right: 12px;
  }

  .brand {
    gap: 7px;
  }

  .brand-mark {
    width: 30px;
    height: 30px;

    border-radius: 8px;

    font-size: 0.78rem;
  }

  .brand-copy strong {
    max-width: 150px;

    font-size: 0.84rem;
  }

  .icon-button {
    width: 38px;
    height: 38px;

    border-radius: 9px;
  }

  .mobile-menu-button svg,
  .mobile-header-action svg {
    width: 18px;
    height: 18px;
  }

  .mobile-header-action .cart-badge {
    top: -4px;
    right: -4px;

    min-width: 18px;
    height: 18px;

    font-size: 0.58rem;
  }

  /* Cart page */
  .cart-nav a {
    font-size: 0.78rem;
  }

  /* Checkout */
  .checkout-header-inner {
    min-height: 62px;

    grid-template-columns: minmax(0, 1fr) auto;

    gap: 8px;
  }

  .checkout-header-inner .brand-copy strong {
    max-width: 135px;
  }

  .checkout-header-title {
    font-size: 1rem;
  }

  .back-link {
    min-height: 38px;

    gap: 4px;

    font-size: 0.78rem;
  }

  .back-text {
    display: none;
  }

  .back-link svg {
    width: 20px;
    height: 20px;
  }
}


/* =========================================================
   SMALL MOBILE
   <= 420px
   ========================================================= */

@media (max-width: 420px) {
  .header-inner {
    min-height: 58px;

    grid-template-columns: 36px minmax(0, 1fr) 36px;

    gap: 6px;

    padding-left: 10px;
    padding-right: 10px;
  }

  .brand {
    gap: 6px;
  }

  .brand-mark {
    width: 28px;
    height: 28px;

    border-radius: 7px;

    font-size: 0.72rem;
  }

  .brand-copy strong {
    max-width: 130px;

    font-size: 0.78rem;
  }

  .icon-button {
    width: 34px;
    height: 34px;

    border-radius: 8px;
  }

  .mobile-menu-button svg,
  .mobile-header-action svg {
    width: 16px;
    height: 16px;
  }

  .mobile-header-action .cart-badge {
    top: -4px;
    right: -4px;

    min-width: 16px;
    height: 16px;

    padding: 0 3px;

    font-size: 0.52rem;

    border-width: 1.5px;
  }

  .cart-nav a {
    font-size: 0.74rem;
  }

  .checkout-header-inner .brand-copy strong {
    max-width: 110px;
  }
}


/* =========================================================
   VERY SMALL MOBILE
   <= 360px
   ========================================================= */

@media (max-width: 360px) {
  .header-inner {
    grid-template-columns: 34px minmax(0, 1fr) 34px;

    padding-left: 8px;
    padding-right: 8px;
  }

  .brand-mark {
    width: 26px;
    height: 26px;

    font-size: 0.68rem;
  }

  .brand-copy strong {
    max-width: 115px;

    font-size: 0.74rem;
  }

  .icon-button {
    width: 32px;
    height: 32px;
  }

  .mobile-menu-button svg,
  .mobile-header-action svg {
    width: 15px;
    height: 15px;
  }
}


/* =========================================================
   TOUCH DEVICES
   ========================================================= */

@media (hover: none) and (pointer: coarse) {
  .desktop-nav > a,
  .language-selector summary,
  .login-link,
  .cart-link,
  .profile-trigger,
  .cart-nav a,
  .back-link {
    min-height: 44px;
  }

  .language-selector summary {
    display: inline-flex;
    align-items: center;
  }

  .profile-trigger {
    min-height: 44px;
  }
}


/* =========================================================
   REDUCED MOTION
   ========================================================= */

@media (prefers-reduced-motion: reduce) {
  .site-header,
  .desktop-nav > a,
  .cart-link,
  .login-link,
  .profile-trigger,
  .icon-button {
    transition: none;
  }
}


/* =========================================================
   PRINT
   ========================================================= */

@media print {
  .site-header {
    position: static;

    background: #fff;

    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .mobile-menu-button,
  .mobile-header-action,
  .desktop-nav .language-selector,
  .profile-dropdown,
  .login-link {
    display: none !important;
  }
}
</style>