<template>
  <span
    class="status-badge"
    :class="`status-${normalizedStatus}`"
  >
    <span
      class="status-dot"
      aria-hidden="true"
    ></span>

    <span>{{ status }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const normalizedStatus = computed(() => {
  return props.status
    .toLowerCase()
    .replace(/\s+/g, '-')
})
</script>

<style scoped>
.status-badge {
  min-height: 25px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--soft);
  color: var(--muted);
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.status-dot {
  width: 5px;
  height: 5px;
  flex: 0 0 5px;
  border-radius: 50%;
  background: currentColor;
}

.status-pending {
  background: var(--warm);
  color: var(--ink);
}

.status-processing {
  border-color: rgba(165, 29, 45, 0.16);
  background: rgba(165, 29, 45, 0.06);
  color: var(--red);
}

.status-completed {
  border-color: rgba(47, 143, 91, 0.16);
  background: rgba(47, 143, 91, 0.07);
  color: var(--success);
}
</style>