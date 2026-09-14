<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      variant === 'secondary' ? 'btn-secondary' : 'btn-primary',
      'auth-submit-btn',
      { 'is-loading': loading }
    ]"
  >
    <svg v-if="loading" class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25"></circle>
      <path class="spinner-head" d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>
    </svg>
    <span>{{ loading ? 'PLEASE WAIT...' : text }}</span>
  </button>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'submit'
  },
  variant: {
    type: String,
    default: 'primary'
  }
})
</script>

<style scoped>
.auth-submit-btn {
  width: 100%;
  display: inline-flex;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 24px;
  border-radius: var(--r-sm);
  font-size: .88rem;
  font-weight: 780;
  letter-spacing: .05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform var(--ease), background var(--ease), box-shadow var(--ease), border-color var(--ease), opacity var(--ease);
}

.btn-primary {
  border: 1px solid transparent;
  background: var(--red);
  color: #fff;
  box-shadow: 0 10px 26px rgba(165, 29, 45, .20);
}

.btn-primary:hover:not(:disabled) {
  background: var(--red-dark);
  box-shadow: 0 12px 30px rgba(125, 21, 34, .26);
  transform: translateY(-1px);
}

.btn-secondary {
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink);
  box-shadow: 0 2px 8px rgba(36, 25, 18, 0.04);
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--muted);
  background: var(--soft);
  transform: translateY(-1px);
}

.auth-submit-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.spinner {
  animation: rotate 0.8s linear infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
</style>
