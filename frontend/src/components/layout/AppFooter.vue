<template>
  <footer class="site-footer">
    <div class="container">
      <div v-if="!simple" class="footer-grid">
        <div>
          <router-link class="brand" to="/" aria-label="Warung Nusantara homepage">
            <span class="brand-mark" aria-hidden="true">WN</span>
            <span class="brand-copy">
              <strong>Warung Nusantara</strong>
              <small>Indonesia in Korea</small>
            </span>
          </router-link>
          <p class="footer-description">Authentic Indonesian food and ingredients, available for online ordering in Korea.</p>
        </div>
        <div>
          <h2 class="footer-col-title">Explore</h2>
          <ul class="footer-links">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/menu">Menu</router-link></li>
            <li><a href="/#about">About</a></li>
          </ul>
        </div>
        <div>
          <h2 class="footer-col-title">Account</h2>
          <ul class="footer-links">
            <li><router-link to="/login">Login</router-link></li>
            <li><router-link to="/cart">Cart</router-link></li>
            <li><router-link to="/order-history">Order history</router-link></li>
          </ul>
        </div>
        <div>
          <h2 class="footer-col-title">Contact</h2>
          <div class="footer-contact">
            <a href="tel:+821012345678">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M8.1 3.5H5.7c-.8 0-1.5.6-1.5 1.4 0 8.2 6.7 14.9 14.9 14.9.8 0 1.4-.7 1.4-1.5v-2.4l-4.1-1.1-1.2 2a12.7 12.7 0 0 1-8-8l2-1.2-1.1-4.1Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              +82 10 1234 5678
            </a>
            <a href="mailto:hello@warungnusantara.kr">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 6.5h16v11H4v-11Zm.5.5L12 13l7.5-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              hello@warungnusantara.kr
            </a>
          </div>
          <div class="social-links" aria-label="Social media">
            <a href="#" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" stroke-width="1.6" />
                <circle cx="12" cy="12" r="3.5" stroke="currentColor" stroke-width="1.6" />
                <circle cx="17.4" cy="6.8" r=".8" fill="currentColor" />
              </svg>
            </a>
            <a href="#" aria-label="YouTube">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 8.1c-.2-1.1-.9-1.9-2-2.1A31 31 0 0 0 12 5.5 31 31 0 0 0 6 6c-1.1.2-1.8 1-2 2.1A20.5 20.5 0 0 0 3.7 12c0 1.3.1 2.6.3 3.9.2 1.1.9 1.9 2 2.1 2 .4 4 .5 6 .5s4-.1 6-.5c1.1-.2 1.8-1 2-2.1.2-1.3.3-2.6.3-3.9s-.1-2.6-.3-3.9Z" stroke="currentColor" stroke-width="1.5" />
                <path d="m10 9 5 3-5 3V9Z" fill="currentColor" />
              </svg>
            </a>
            <a href="#" aria-label="KakaoTalk">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 4C7 4 3 7.1 3 11c0 2.5 1.7 4.7 4.2 5.9L6.5 20l3.6-2.2c.6.1 1.2.2 1.9.2 5 0 9-3.1 9-7s-4-7-9-7Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom" :class="{ 'simple-bottom': simple }">
        <span>&copy; 2026 Warung Nusantara. All rights reserved.</span>
        <span>Authentic Indonesian restaurant in Korea</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  simple: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.site-footer {
  padding: 56px 0 26px;
  background: var(--ink);
  color: #fff;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.35fr .8fr .8fr 1.05fr;
  gap: 50px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
}

.brand-mark {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 11px;
  background: #fff;
  color: var(--red);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.02rem;
  font-weight: 700;
  letter-spacing: -.08em;
}

.brand-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}

.brand-copy strong {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.08rem;
  letter-spacing: -.025em;
}

.brand-copy small {
  margin-top: 4px;
  color: rgba(255, 255, 255, .64);
  font-size: .57rem;
  font-weight: 750;
  letter-spacing: .14em;
  text-transform: uppercase;
}

.footer-description {
  max-width: 300px;
  margin-top: 18px;
  color: rgba(255, 255, 255, .64);
  font-size: .88rem;
}

.footer-col-title {
  margin-bottom: 16px;
  font-size: .72rem;
  font-weight: 800;
  letter-spacing: .13em;
  text-transform: uppercase;
}

.footer-links, .footer-contact {
  display: grid;
  gap: 10px;
  list-style: none;
}

.footer-links a, .footer-contact a {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: rgba(255, 255, 255, .64);
  font-size: .86rem;
  transition: color var(--ease);
}

.footer-links a:hover, .footer-contact a:hover {
  color: #fff;
}

.social-links {
  display: flex;
  gap: 9px;
  margin-top: 18px;
}

.social-links a {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, .18);
  border-radius: var(--r-sm);
  color: rgba(255, 255, 255, .78);
  transition: border-color var(--ease), background var(--ease);
}

.social-links a:hover {
  border-color: var(--red);
  background: var(--red);
  color: #fff;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 48px;
  padding-top: 22px;
  border-top: 1px solid rgba(255, 255, 255, .12);
  color: rgba(255, 255, 255, .48);
  font-size: .76rem;
}

.footer-bottom.simple-bottom {
  margin-top: 0;
  padding-top: 0;
  border-top: 0;
}

@media (max-width: 1040px) {
  .footer-grid {
    grid-template-columns: 1.4fr repeat(2, .8fr);
  }
  .footer-grid > :last-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 34px 24px;
  }
  .footer-grid > :first-child, .footer-grid > :last-child {
    grid-column: 1 / -1;
  }
  .footer-bottom {
    align-items: flex-start;
    flex-direction: column;
    gap: 7px;
  }
}
</style>
