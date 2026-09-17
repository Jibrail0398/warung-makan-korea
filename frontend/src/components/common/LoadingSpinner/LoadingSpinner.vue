<template>
  <div
    class="loading-spinner-wrapper"
    :class="[
      `spinner-size-${size}`,
      `spinner-color-${color}`,
      {
        'spinner-inline': inline,
        'spinner-center': center,
        'spinner-overlay': overlay
      }
    ]"
    role="status"
    :aria-label="text || 'Sedang memproses...'"
  >
    <svg
      class="loading-svg"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9.5"
        stroke="currentColor"
        stroke-width="2.6"
        stroke-dasharray="16 38"
        stroke-linecap="round"
        opacity="0.25"
      />
      <path
        d="M12 2.5a9.5 9.5 0 0 1 9.5 9.5"
        stroke="currentColor"
        stroke-width="2.6"
        stroke-linecap="round"
      />
    </svg>
    <span v-if="text" class="loading-text">{{ text }}</span>
  </div>
</template>

<script>
import './LoadingSpinner.css';

export default {
  name: 'LoadingSpinner',
  props: {
    size: {
      type: String,
      default: 'sm', // 'xs' | 'sm' | 'md' | 'lg'
      validator: (v) => ['xs', 'sm', 'md', 'lg'].includes(v)
    },
    color: {
      type: String,
      default: 'current', // 'current' | 'white' | 'primary' | 'danger' | 'muted'
      validator: (v) => ['current', 'white', 'primary', 'danger', 'muted'].includes(v)
    },
    text: {
      type: String,
      default: ''
    },
    inline: {
      type: Boolean,
      default: false
    },
    center: {
      type: Boolean,
      default: false
    },
    overlay: {
      type: Boolean,
      default: false
    }
  }
};
</script>
