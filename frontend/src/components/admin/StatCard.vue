<template>
  <article class="stat-card">
    <div class="stat-card-top">
      <div
        class="stat-icon"
        :class="`stat-icon-${tone}`"
        aria-hidden="true"
      >
        <component :is="icon" />
      </div>
    </div>

    <div class="stat-label">
      {{ label }}
    </div>

    <div class="stat-value">
      {{ value }}
    </div>

    <div
      class="stat-meta"
      :class="{
        'stat-meta-success': tone === 'success',
        'stat-meta-warm': tone === 'warm',
        'stat-meta-red': tone === 'red'
      }"
    >
      <span v-if="trend" class="stat-trend">
        {{ trend }}
      </span>

      <span>{{ description }}</span>
    </div>
  </article>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  trend: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  tone: {
    type: String,
    default: 'default'
  },
  icon: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.stat-card {
  min-width: 0;
  min-height: 178px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--paper);
  box-shadow: 0 2px 10px rgba(36, 25, 18, 0.04);
}

.stat-card-top {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 18px;
}

.stat-icon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: var(--soft);
  color: var(--ink);
}

.stat-icon :deep(svg) {
  width: 18px;
  height: 18px;
}

.stat-icon-red {
  color: var(--red);
}

.stat-icon-warm {
  color: var(--ink);
  background: var(--warm);
}

.stat-icon-success {
  color: var(--success);
}

.stat-label {
  color: var(--muted);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
}

.stat-value {
  margin-top: 5px;
  color: var(--ink);
  font-family:
    Georgia,
    "Times New Roman",
    serif;
  font-size: clamp(26px, 2.2vw, 32px);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.stat-meta {
  margin-top: auto;
  padding-top: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.4;
}

.stat-trend {
  font-weight: 700;
}

.stat-meta-success .stat-trend {
  color: var(--success);
}

.stat-meta-warm .stat-trend {
  color: var(--ink);
}

.stat-meta-red .stat-trend {
  color: var(--red);
}
</style>