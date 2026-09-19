<template>
  <div class="auth-page">
    <div class="auth-container">
      <header class="auth-brand-header">
        <router-link to="/" class="auth-brand" aria-label="Anekarasa Resto homepage">
          <span class="auth-brand-mark" aria-hidden="true">AR</span>
          <span class="auth-brand-copy">
            <strong>Anekarasa Resto</strong>
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
</template>

<script>
import './AuthLayout.css';

export default {
  name: 'AuthLayout',
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' }
  }
};
</script>
