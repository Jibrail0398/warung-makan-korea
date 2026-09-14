<template>
  <section class="tracking-progress" aria-label="Order progress">
    <div class="progress-line">
      <div
        class="progress-line-active"
        :style="{ width: activeLineWidth }"
      ></div>
    </div>

    <div
      v-for="(step, index) in steps"
      :key="step.key"
      class="progress-step"
      :class="{
        completed: currentStepIndex > index,
        current: currentStepIndex === index,
        cancelled: isCancelled
      }"
    >
      <span class="progress-dot">
        <template v-if="isCancelled && currentStepIndex === index">✕</template>
        <template v-else-if="currentStepIndex > index">✓</template>
      </span>
      <strong>{{ step.label }}</strong>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    default: 'Payment Verification'
  }
});

const steps = [
  { key: 'verification', label: 'Verifikasi' },
  { key: 'progress', label: 'In Progress' },
  { key: 'ready', label: 'Ready' },
  { key: 'completed', label: 'Complete' }
];

const isCancelled = computed(() => {
  return (props.status || '').toLowerCase() === 'cancelled';
});

const currentStepIndex = computed(() => {
  const s = (props.status || '').toLowerCase();
  if (s.includes('completed') || s.includes('selesai')) return 3;
  if (s.includes('ready') || s.includes('siap')) return 2;
  if (s.includes('progress') || s.includes('preparing') || s.includes('disiapkan')) return 1;
  if (s.includes('cancelled') || s.includes('batal')) return 0;
  return 0; // Payment verification / created
});

const activeLineWidth = computed(() => {
  if (isCancelled.value) return '0%';
  const idx = currentStepIndex.value;
  if (idx === 0) return '15%';
  if (idx === 1) return '45%';
  if (idx === 2) return '75%';
  return '100%';
});
</script>

<style scoped>
.tracking-progress {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 32px 0 42px;
  padding: 0 10px;
}

.progress-line {
  position: absolute;
  top: 14px;
  left: 24px;
  right: 24px;
  height: 3px;
  background: var(--line);
  z-index: 1;
}

.progress-line-active {
  height: 100%;
  background: var(--red);
  transition: width 300ms ease;
}

.progress-step {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.progress-dot {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: 2px solid var(--line);
  border-radius: 50%;
  background: #fff;
  color: var(--muted);
  font-size: 0.76rem;
  font-weight: 800;
}

.progress-step.completed .progress-dot {
  border-color: var(--red);
  background: var(--red);
  color: #fff;
}

.progress-step.current .progress-dot {
  border-color: var(--red);
  background: #fff;
  box-shadow: 0 0 0 4px rgba(165, 29, 45, .15);
}

.progress-step.cancelled.current .progress-dot {
  border-color: var(--color-danger, #dc2626);
  background: var(--color-danger, #dc2626);
  color: #fff;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, .15);
}

.progress-step strong {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--muted);
}

.progress-step.completed strong,
.progress-step.current strong {
  color: var(--ink);
}

@media (max-width: 480px) {
  .tracking-progress {
    margin: 24px 0 32px;
  }
  .progress-step strong {
    font-size: 0.72rem;
  }
  .progress-dot {
    width: 26px;
    height: 26px;
    font-size: 0.7rem;
  }
  .progress-line {
    top: 12px;
  }
}
</style>
