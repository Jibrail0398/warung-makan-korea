<template>
  <Teleport to="body">
    <Transition name="notice-fade">
      <div
        v-if="visible"
        class="notice-backdrop"
        role="presentation"
        @click.self="$emit('close')"
      >
        <section
          class="notice-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="notice-title"
          aria-describedby="notice-message"
        >
          <button
            type="button"
            class="notice-close"
            aria-label="Tutup pemberitahuan"
            @click="$emit('close')"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </button>

          <div class="notice-icon" :class="`notice-icon-${type}`" aria-hidden="true">
            <svg v-if="type === 'success'" width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 7v5m0 4h.01M4.8 19h14.4a1.7 1.7 0 0 0 1.48-2.55L13.48 4.1a1.7 1.7 0 0 0-2.96 0L3.32 16.45A1.7 1.7 0 0 0 4.8 19Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>

          <p class="notice-eyebrow">{{ type === 'success' ? 'Berhasil' : 'Perlu diperiksa' }}</p>
          <h2 id="notice-title">{{ title }}</h2>
          <p id="notice-message" class="notice-message">{{ message }}</p>
          <p v-if="detail" class="notice-detail">{{ detail }}</p>

          <button type="button" class="notice-action" @click="$emit('confirm')">
            {{ confirmText }}
          </button>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  type: { type: String, default: 'success' },
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  detail: { type: String, default: '' },
  confirmText: { type: String, default: 'Tutup' }
});

defineEmits(['close', 'confirm']);
</script>

<style scoped>
.notice-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(27, 24, 20, .52);
}

.notice-modal {
  position: relative;
  width: min(100%, 430px);
  padding: 34px 30px 30px;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: #fff;
  box-shadow: 0 24px 70px rgba(27, 24, 20, .2);
  text-align: center;
}

.notice-close {
  position: absolute;
  top: 14px;
  right: 14px;
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
}

.notice-close:hover {
  background: var(--soft);
  color: var(--ink);
}

.notice-icon {
  display: grid;
  width: 62px;
  height: 62px;
  margin: 0 auto 18px;
  place-items: center;
  border-radius: 50%;
}

.notice-icon-success {
  background: color-mix(in srgb, var(--success) 16%, white);
  color: var(--success);
}

.notice-icon-failed {
  background: color-mix(in srgb, var(--red) 13%, white);
  color: var(--red);
}

.notice-eyebrow {
  margin: 0 0 7px;
  color: var(--red);
  font-size: .7rem;
  font-weight: 800;
  letter-spacing: .15em;
  text-transform: uppercase;
}

.notice-modal h2 {
  margin: 0;
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.55rem;
  font-weight: 500;
}

.notice-message {
  margin: 12px auto 0;
  color: var(--ink);
  font-size: .94rem;
  line-height: 1.55;
}

.notice-detail {
  margin: 10px auto 0;
  color: var(--muted);
  font-size: .82rem;
  line-height: 1.55;
}

.notice-action {
  width: 100%;
  min-height: 46px;
  margin-top: 24px;
  border: 0;
  border-radius: var(--r-sm);
  background: var(--red);
  color: #fff;
  font: inherit;
  font-size: .86rem;
  font-weight: 750;
  cursor: pointer;
}

.notice-action:hover {
  background: var(--ink);
}

.notice-fade-enter-active,
.notice-fade-leave-active {
  transition: opacity 180ms ease;
}

.notice-fade-enter-active .notice-modal,
.notice-fade-leave-active .notice-modal {
  transition: transform 180ms ease, opacity 180ms ease;
}

.notice-fade-enter-from,
.notice-fade-leave-to {
  opacity: 0;
}

.notice-fade-enter-from .notice-modal,
.notice-fade-leave-to .notice-modal {
  opacity: 0;
  transform: translateY(10px) scale(.98);
}

@media (max-width: 480px) {
  .notice-modal {
    padding: 30px 22px 22px;
  }
}
</style>
