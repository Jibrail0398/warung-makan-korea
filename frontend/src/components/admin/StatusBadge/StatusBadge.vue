<template>
  <span class="status-badge" :class="`status-${normalizedStatus}`">
    <span class="status-dot" aria-hidden="true"></span>
    <span>{{ status }}</span>
  </span>
</template>

<script>
import { computed } from 'vue';
import { statusToSlug } from '../../../utils/status.js';
import './StatusBadge.css';
export default {
  name: 'StatusBadge',
  props: { status: { type: String, required: true } },
  setup(props) {
    const normalizedStatus = computed(() => statusToSlug(props.status));
    return { normalizedStatus };
  }
};
</script>
