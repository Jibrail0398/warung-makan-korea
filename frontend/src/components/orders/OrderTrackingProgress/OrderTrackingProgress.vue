<template>
  <section class="tracking-progress" aria-label="Order progress">
    <div class="progress-line"><div class="progress-line-active" :style="{ width: activeLineWidth }"></div></div>
    <div v-for="(step, index) in steps" :key="step.key" class="progress-step" :class="{ completed: currentStepIndex > index, current: currentStepIndex === index, cancelled: isCancelled }">
      <span class="progress-dot"><template v-if="isCancelled && currentStepIndex === index">✕</template><template v-else-if="currentStepIndex > index">✓</template></span>
      <strong>{{ step.label }}</strong>
    </div>
  </section>
</template>

<script>
import OrderTrackingProgressScript from './OrderTrackingProgress.js';
export default { ...OrderTrackingProgressScript };
</script>
