<template>
  <div
    class="toast"
    :class="{ show: visible }"
    role="status"
    aria-live="polite"
    aria-atomic="true"
  >
    <span class="toast-icon" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="m6 12 4 4 8-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
    <span>{{ message }}</span>
  </div>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.toast {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 80;
  display: flex;
  min-width: min(360px, calc(100vw - 32px));
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, .1);
  border-radius: var(--r-md);
  background: var(--ink);
  color: #fff;
  box-shadow: var(--shadow);
  opacity: 0;
  pointer-events: none;
  transform: translateY(14px);
  transition: opacity 200ms ease, transform 200ms ease;
}

.toast.show {
  opacity: 1;
  transform: translateY(0);
}

.toast-icon {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 50%;
  background: var(--success);
}

.toast > span:last-child {
  font-size: .88rem;
  font-weight: 650;
}

@media (max-width: 640px) {
  .toast {
    right: 16px;
    bottom: 16px;
    left: 16px;
    min-width: 0;
  }
}
</style>
