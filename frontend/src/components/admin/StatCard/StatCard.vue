<template>
  <article class="stat-card">
    <div class="stat-card-top"><div class="stat-icon" :class="`stat-icon-${tone}`" aria-hidden="true"><component :is="icon" /></div></div>
    <div class="stat-label">{{ label }}</div>
    <div class="stat-value">{{ value }}</div>
    <div class="stat-meta" :class="{ 'stat-meta-success': tone === 'success', 'stat-meta-warm': tone === 'warm', 'stat-meta-red': tone === 'red' }">
      <span v-if="trend" class="stat-trend">{{ trend }}</span>
      <span>{{ description }}</span>
    </div>
  </article>
</template>

<script>
import './StatCard.css';
export default {
  name: 'StatCard',
  props: { label: { type: String, required: true }, value: { type: [String, Number], required: true }, trend: { type: String, default: '' }, description: { type: String, required: true }, tone: { type: String, default: 'default' }, icon: { type: Object, required: true } }
};
</script>
