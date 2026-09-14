<template>
  <button :type="type" :disabled="disabled || loading" :class="[variant === 'secondary' ? 'btn-secondary' : 'btn-primary', 'auth-submit-btn', { 'is-loading': loading }]">
    <svg v-if="loading" class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25"></circle>
      <path class="spinner-head" d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>
    </svg>
    <span>{{ loading ? 'PLEASE WAIT...' : text }}</span>
  </button>
</template>

<script>
import './AuthButton.css';
export default {
  name: 'AuthButton',
  props: { text: { type: String, required: true }, loading: { type: Boolean, default: false }, disabled: { type: Boolean, default: false }, type: { type: String, default: 'submit' }, variant: { type: String, default: 'primary' } }
};
</script>
