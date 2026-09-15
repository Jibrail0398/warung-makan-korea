<template>
  <Teleport to="body">
    <div class="toast" :class="[{ show: visible }, `toast-${type}`]" role="status" aria-live="polite" aria-atomic="true">
      <span class="toast-icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path v-if="type === 'success'" d="m6 12 4 4 8-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /><path v-else d="M7 7l10 10M17 7 7 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
      </span>
      <span>{{ message }}</span>
    </div>
  </Teleport>
</template>

<script>
import './ToastNotification.css';
export default {
  name: 'ToastNotification',
  props: { visible: { type: Boolean, default: false }, message: { type: String, default: '' }, type: { type: String, default: 'success' } }
};
</script>
