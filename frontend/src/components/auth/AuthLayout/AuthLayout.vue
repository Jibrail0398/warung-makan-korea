<template>
  <div class="split-auth-page">
    <div class="auth-image-panel" aria-hidden="true"><div class="auth-image-overlay"></div></div>
    <div class="auth-content-panel">
      <div class="auth-content-container">
        <header class="auth-brand-header"><router-link to="/" class="brand" aria-label="Aneka Rasa Restoran homepage"><span class="brand-mark" aria-hidden="true">AR</span><span class="brand-copy"><strong>Aneka Rasa Restoran</strong></span></router-link></header>
        <main class="auth-form-area">
          <div class="auth-heading-group"><h1 class="auth-title">{{ title }}</h1><p v-if="subtitle" class="auth-subtitle">{{ subtitle }}</p><p v-if="description" class="auth-description">{{ description }}</p></div>
          <slot></slot>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import './AuthLayout.css';
export default {
  name: 'AuthLayout',
  props: { title: { type: String, required: true }, subtitle: { type: String, default: '' }, description: { type: String, default: '' } }
};
</script>
