<template>
  <Teleport to="body">
    <Transition name="notice-fade">
      <div v-if="visible" class="notice-backdrop" role="presentation" @click.self="$emit('close')">
        <section class="notice-modal" role="dialog" aria-modal="true" aria-labelledby="notice-title" aria-describedby="notice-message">
          <button type="button" class="notice-close" aria-label="Tutup pemberitahuan" @click="$emit('close')"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg></button>
          <div class="notice-icon" :class="`notice-icon-${type}`" aria-hidden="true">
            <svg v-if="type === 'success'" width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 7v5m0 4h.01M4.8 19h14.4a1.7 1.7 0 0 0 1.48-2.55L13.48 4.1a1.7 1.7 0 0 0-2.96 0L3.32 16.45A1.7 1.7 0 0 0 4.8 19Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </div>
          <p class="notice-eyebrow">{{ type === 'success' ? 'Berhasil' : 'Perlu diperiksa' }}</p>
          <h2 id="notice-title">{{ title }}</h2>
          <p id="notice-message" class="notice-message">{{ message }}</p>
          <p v-if="detail" class="notice-detail">{{ detail }}</p>
          <button type="button" class="notice-action" @click="$emit('confirm')">{{ confirmText }}</button>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import './NoticeModal.css';
export default {
  name: 'NoticeModal',
  props: { visible: { type: Boolean, default: false }, type: { type: String, default: 'success' }, title: { type: String, default: '' }, message: { type: String, default: '' }, detail: { type: String, default: '' }, confirmText: { type: String, default: 'Tutup' } },
  emits: ['close', 'confirm']
};
</script>
