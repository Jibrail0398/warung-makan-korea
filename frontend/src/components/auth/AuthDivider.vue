<template>
  <div class="auth-divider">
    <span class="auth-divider-text">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: 'OR'
  }
})
</script>

<style scoped>
.auth-divider {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0;
  text-align: center;
}

.auth-divider::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: var(--line);
}

.auth-divider-text {
  position: relative;
  z-index: 1;
  padding: 0 14px;
  background: var(--paper);
  color: var(--muted);
  font-size: 0.76rem;
  font-weight: 750;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
</style>
