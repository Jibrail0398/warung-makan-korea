<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="visible"
        class="confirm-backdrop"
        role="presentation"
        @click.self="handleCancel"
      >
        <section
          class="confirm-modal"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          :aria-describedby="messageId"
        >
          <!-- Close Button -->
          <button
            type="button"
            class="confirm-close-btn"
            aria-label="Tutup dialog"
            :disabled="loading"
            @click="handleCancel"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <!-- Icon Badge -->
          <div class="confirm-icon-wrap" :class="`confirm-icon-${type}`" aria-hidden="true">
            <!-- Logout Icon -->
            <svg v-if="icon === 'logout' || (!icon && type === 'danger')" width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <polyline points="16 17 21 12 16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <!-- Warning Icon -->
            <svg v-else-if="type === 'warning' || icon === 'warning'" width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <!-- Info / Default Icon -->
            <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
              <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </div>

          <!-- Eyebrow -->
          <p class="confirm-eyebrow" :class="`eyebrow-${type}`">{{ eyebrowText }}</p>

          <!-- Title -->
          <h2 :id="titleId" class="confirm-title">{{ title }}</h2>

          <!-- Message -->
          <p :id="messageId" class="confirm-message">{{ message }}</p>

          <!-- Detail (optional) -->
          <p v-if="detail" class="confirm-detail">{{ detail }}</p>

          <!-- Action Buttons -->
          <div class="confirm-actions">
            <button
              type="button"
              class="btn-confirm-cancel"
              :disabled="loading"
              @click="handleCancel"
            >
              {{ cancelText }}
            </button>
            <button
              type="button"
              class="btn-confirm-action"
              :class="`btn-${type}`"
              :disabled="loading"
              @click="handleConfirm"
            >
              <span v-if="loading" class="confirm-btn-spinner" aria-hidden="true"></span>
              <span>{{ confirmText }}</span>
            </button>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { computed, onBeforeUnmount, onMounted } from 'vue';
import './ConfirmModal.css';

export default {
  name: 'ConfirmModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'danger', // 'danger' | 'warning' | 'info' | 'primary'
      validator: (val) => ['danger', 'warning', 'info', 'primary'].includes(val)
    },
    icon: {
      type: String,
      default: '' // 'logout' | 'warning' | 'info' | ''
    },
    title: {
      type: String,
      default: 'Konfirmasi'
    },
    eyebrow: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: 'Apakah Anda yakin ingin melanjutkan tindakan ini?'
    },
    detail: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: 'Ya, Lanjutkan'
    },
    cancelText: {
      type: String,
      default: 'Batal'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'cancel', 'confirm'],
  setup(props, { emit }) {
    const titleId = computed(() => `confirm-title-${Math.random().toString(36).slice(2, 7)}`);
    const messageId = computed(() => `confirm-msg-${Math.random().toString(36).slice(2, 7)}`);

    const eyebrowText = computed(() => {
      if (props.eyebrow) return props.eyebrow;
      if (props.type === 'danger') return 'Konfirmasi Tindakan';
      if (props.type === 'warning') return 'Peringatan';
      return 'Informasi';
    });

    const handleCancel = () => {
      if (props.loading) return;
      emit('cancel');
      emit('close');
    };

    const handleConfirm = () => {
      if (props.loading) return;
      emit('confirm');
    };

    const handleKeyDown = (e) => {
      if (props.visible && e.key === 'Escape') {
        handleCancel();
      }
    };

    onMounted(() => {
      window.addEventListener('keydown', handleKeyDown);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('keydown', handleKeyDown);
    });

    return {
      titleId,
      messageId,
      eyebrowText,
      handleCancel,
      handleConfirm
    };
  }
};
</script>
