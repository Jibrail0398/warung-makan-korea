<template>
  <footer class="site-footer" :class="{ 'site-footer-simple': simple }">
    <!-- Value proposition / Trust banner (only on full footer) -->
    <div v-if="!simple" class="footer-trust-strip">
      <div class="container trust-strip-inner">
        <div class="trust-item">
          <div class="trust-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div class="trust-text">
            <strong>100% Rasa Otentik</strong>
            <small>Resep & bumbu asli Nusantara</small>
          </div>
        </div>

        <div class="trust-item">
          <div class="trust-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="1" y="3" width="15" height="13" rx="2" stroke="currentColor" stroke-width="1.8" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 8" stroke="currentColor" stroke-width="1.8" />
              <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" stroke-width="1.8" />
              <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" stroke-width="1.8" />
            </svg>
          </div>
          <div class="trust-text">
            <strong>Kirim ke Seluruh Korea</strong>
            <small>Packing higienis & cepat</small>
          </div>
        </div>

        <div class="trust-item">
          <div class="trust-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.8" />
              <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" stroke-width="1.8" />
            </svg>
          </div>
          <div class="trust-text">
            <strong>Pembayaran Mudah</strong>
            <small>Transfer bank lokal Korea</small>
          </div>
        </div>

        <div class="trust-item">
          <div class="trust-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" stroke-width="1.8" />
            </svg>
          </div>
          <div class="trust-text">
            <strong>Layanan Ramah</strong>
            <small>CS Bahasa Indonesia & Korea</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Footer Container -->
    <div class="container">
      <div v-if="!simple" class="footer-grid">
        <!-- Col 1: Brand & Info -->
        <div class="footer-brand-col">
          <router-link class="footer-brand" to="/" aria-label="Warung Nusantara homepage">
            <span class="footer-brand-mark" aria-hidden="true">WN</span>
            <span class="footer-brand-copy">
              <strong>Warung Nusantara</strong>
              <small>INDONESIA IN KOREA</small>
            </span>
          </router-link>
          <p class="footer-description">
            Menghadirkan kelezatan masakan khas nusantara dan bahan mentah pilihan langsung ke tempat tinggal Anda di seluruh Korea Selatan.
          </p>

          <div class="footer-meta-badges">
            <div class="meta-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8" />
                <polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              </svg>
              <span>Setiap Hari: 10.00 – 21.00 KST</span>
            </div>
            <div class="meta-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="1.8" />
                <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="1.8" />
              </svg>
              <span>Ansan-si, Gyeonggi-do, Korea Selatan</span>
            </div>
          </div>
        </div>

        <!-- Col 2: Navigasi Menu -->
        <div class="footer-nav-col">
          <h2 class="footer-col-title">Menu & Sajian</h2>
          <ul class="footer-links">
            <li><router-link to="/">Beranda</router-link></li>
            <li><router-link to="/#menu">Menu Restoran</router-link></li>
            <li><router-link to="/#menu">Bahan Mentah & Bumbu</router-link></li>
            <li><router-link to="/#about">Tentang Kami</router-link></li>
          </ul>
        </div>

        <!-- Col 3: Layanan Akun -->
        <div class="footer-nav-col">
          <h2 class="footer-col-title">Layanan Akun</h2>
          <ul class="footer-links">
            <li><router-link to="/cart">Keranjang Belanja</router-link></li>
            <li><router-link to="/order-history">Riwayat & Status Pesanan</router-link></li>
            <li><router-link to="/login">Masuk Akun</router-link></li>
            <li><router-link to="/register">Daftar Akun Baru</router-link></li>
          </ul>
        </div>

        <!-- Col 4: Kontak & Social Media -->
        <div class="footer-contact-col">
          <h2 class="footer-col-title">Hubungi Kami</h2>
          <div class="footer-contact-list">
            <a href="tel:+821012345678" class="contact-link">
              <div class="contact-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <div class="contact-info">
                <small>Telepon / WhatsApp</small>
                <strong>+82 10-1234-5678</strong>
              </div>
            </a>

            <a href="mailto:hello@warungnusantara.kr" class="contact-link">
              <div class="contact-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="1.8" />
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="1.8" />
                </svg>
              </div>
              <div class="contact-info">
                <small>Email Resmi</small>
                <strong>hello@warungnusantara.kr</strong>
              </div>
            </a>
          </div>

          <div class="social-wrapper">
            <span class="social-label">Ikuti Media Sosial:</span>
            <div class="social-links" aria-label="Social media">
              <a href="#" aria-label="Instagram" class="social-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.8" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8" />
                  <circle cx="18" cy="6" r="1" fill="currentColor" />
                </svg>
              </a>
              <a href="#" aria-label="YouTube" class="social-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" stroke="currentColor" stroke-width="1.8" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                </svg>
              </a>
              <a href="#" aria-label="KakaoTalk" class="social-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 3C6.48 3 2 6.58 2 11c0 2.87 1.9 5.38 4.77 6.74l-.97 3.63a.5.5 0 0 0 .73.54l4.28-2.85c.39.04.79.06 1.19.06 5.52 0 10-3.58 10-8s-4.48-8-10-8z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Simple Footer Version (For Checkout / Cart) -->
      <div v-else class="simple-footer-content">
        <router-link class="footer-brand simple-brand" to="/" aria-label="Warung Nusantara homepage">
          <span class="footer-brand-mark" aria-hidden="true">WN</span>
          <span class="footer-brand-copy">
            <strong>Warung Nusantara</strong>
            <small>INDONESIA IN KOREA</small>
          </span>
        </router-link>
        <p class="simple-footer-text">
          Pesanan Anda diproses dengan aman & higienis. Butuh bantuan? Hubungi WhatsApp <strong>+82 10-1234-5678</strong>.
        </p>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom" :class="{ 'simple-bottom': simple }">
        <div class="footer-bottom-left">
          <span>&copy; 2026 Warung Nusantara. All rights reserved.</span>
          <span class="footer-dot-divider">•</span>
          <span class="community-tag">Dibuat untuk Komunitas Indonesia di Korea 🇮🇩 🇰🇷</span>
        </div>

        <div class="footer-bottom-right">
          <router-link to="/admin/login" class="admin-portal-link">
            <span>Portal Admin</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </router-link>
          <button type="button" class="back-to-top-btn" @click="scrollToTop" aria-label="Kembali ke atas">
            <span>Ke Atas</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 15l-6-6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import './AppFooter.css';

export default {
  name: 'AppFooter',
  props: {
    simple: { type: Boolean, default: false }
  },
  setup() {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return {
      scrollToTop
    };
  }
};
</script>
