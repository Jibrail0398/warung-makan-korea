<template>
  <div class="auth-divider">
    <span class="auth-divider-text">{{ text }}</span>
  </div>
</template>

<script>
import './AuthDivider.css';
export default {
  name: 'AuthDivider',
  props: { text: { type: String, default: 'OR' } }
};
</script>
