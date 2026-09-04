<template>
  <div class="split-auth-page">
    <!-- Left Side: Food Image & Marketing Panel -->
    <div class="auth-image-panel" aria-hidden="true">
      <div class="auth-image-overlay"></div>
      <div class="auth-marketing-content">
        <h2 class="marketing-heading">
          Rasa Indonesia,<br />
          untuk Anda di Korea.
        </h2>
        <p class="marketing-copy">
          Pesan hidangan favorit Anda dengan mudah dan cepat.
        </p>
      </div>
    </div>

    <!-- Right Side: Clean Editorial Auth Panel -->
    <div class="auth-content-panel">
      <div class="auth-content-container">
        <header class="auth-brand-header">
          <router-link to="/" class="brand" aria-label="Warung Nusantara homepage">
            <span class="brand-mark" aria-hidden="true">WN</span>
            <span class="brand-copy">
              <strong>Warung Nusantara</strong>
              <small>Indonesia in Korea</small>
            </span>
          </router-link>
        </header>

        <main class="auth-form-area">
          <div class="auth-heading-group">
            <h1 class="auth-title">{{ title }}</h1>
            <p v-if="subtitle" class="auth-subtitle">{{ subtitle }}</p>
            <p v-if="description" class="auth-description">{{ description }}</p>
          </div>

          <slot></slot>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.split-auth-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 40% 60%;
  background: #ffffff;
  color: var(--ink);
  font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

/* Left Image Panel */
.auth-image-panel {
  position: sticky;
  top: 0;
  height: 100vh;
  background-image: url('https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1200');
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.auth-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(25, 21, 18, 0.20) 0%, rgba(25, 21, 18, 0.82) 100%);
}

.auth-marketing-content {
  position: absolute;
  left: 56px;
  bottom: 56px;
  right: 56px;
  z-index: 2;
  color: #ffffff;
}

.marketing-heading {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1.8rem, 2.5vw, 2.35rem);
  font-weight: 500;
  line-height: 1.18;
  letter-spacing: -0.035em;
  color: #ffffff;
}

.marketing-copy {
  margin-top: 14px;
  font-size: clamp(0.95rem, 1.2vw, 1.05rem);
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.88);
}

/* Right Content Panel */
.auth-content-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #ffffff;
  padding: 56px 40px;
}

.auth-content-container {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
}

.auth-brand-header {
  margin-bottom: 36px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  text-decoration: none;
  color: inherit;
}

.brand-mark {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 11px;
  background: var(--red);
  color: #fff;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -.08em;
  box-shadow: 0 7px 18px rgba(165, 29, 45, .22);
}

.brand-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}

.brand-copy strong {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.12rem;
  letter-spacing: -.025em;
  color: var(--ink);
}

.brand-copy small {
  margin-top: 4px;
  color: var(--muted);
  font-size: .58rem;
  font-weight: 750;
  letter-spacing: .14em;
  text-transform: uppercase;
}

.auth-heading-group {
  margin-bottom: 28px;
}

.auth-title {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2rem, 3.2vw, 2.4rem);
  font-weight: 500;
  letter-spacing: -.04em;
  line-height: 1.12;
  color: var(--ink);
}

.auth-subtitle {
  margin-top: 8px;
  color: var(--ink);
  font-size: 1rem;
  font-weight: 650;
}

.auth-description {
  margin-top: 6px;
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 860px) {
  .split-auth-page {
    grid-template-columns: 1fr;
  }

  .auth-image-panel {
    display: none;
  }

  .auth-content-panel {
    padding: 36px 24px 48px;
    justify-content: flex-start;
  }

  .auth-brand-header {
    margin-bottom: 28px;
  }

  .auth-content-container {
    max-width: 100%;
  }
}
</style>
