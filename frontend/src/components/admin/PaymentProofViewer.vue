<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="proofModalTitle">
      <div class="modal-header">
        <div>
          <p class="modal-eyebrow">VERIFIKASI PEMBAYARAN</p>
          <h2 id="proofModalTitle" class="modal-title">
            Bukti Transfer — {{ order?.orderNumber || order?.id }}
          </h2>
        </div>
        <button type="button" class="close-btn" aria-label="Tutup modal" @click="$emit('close')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <!-- Order Meta Summary -->
        <div class="order-summary-box">
          <div class="summary-item">
            <span class="label">Customer:</span>
            <strong>{{ order?.customer?.name || 'Customer' }}</strong>
          </div>
          <div class="summary-item">
            <span class="label">Total Tagihan:</span>
            <strong class="price-highlight">₩{{ (order?.total || 0).toLocaleString('ko-KR') }}</strong>
          </div>
          <div class="summary-item">
            <span class="label">Metode:</span>
            <span>{{ order?.paymentMethod || 'Bank Transfer' }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Status:</span>
            <span class="status-tag" :class="`status-${(order?.paymentStatus || '').toLowerCase().replace(/\s+/g, '-')}`">
              {{ order?.paymentStatus || 'Waiting Verification' }}
            </span>
          </div>
        </div>

        <!-- Image Preview Frame -->
        <div class="image-frame">
          <img
            v-if="order?.paymentProof"
            :src="order?.paymentProof"
            alt="Bukti Transfer Pembayaran"
            class="proof-img"
          />
          <div v-else class="no-proof">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8" />
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <p>Customer belum mengunggah bukti transfer.</p>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button
          v-if="order?.paymentProof && order?.paymentStatus !== 'Verified'"
          type="button"
          class="btn-reject"
          @click="$emit('reject', order)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8" />
            <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
          Tolak Bukti
        </button>

        <button
          v-if="order?.paymentProof && order?.paymentStatus !== 'Verified'"
          type="button"
          class="btn-approve"
          @click="$emit('approve', order)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Konfirmasi & Verifikasi
        </button>

        <button
          type="button"
          class="btn-close"
          @click="$emit('close')"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  order: Object
});

defineEmits(['close', 'approve', 'reject']);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(25, 21, 18, 0.6);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  z-index: 60;
  padding: 20px;
}

.modal-card {
  width: 100%;
  max-width: 580px;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  overflow: hidden;
  animation: modalPop 220ms ease;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--line);
  flex-shrink: 0;
}

.modal-eyebrow {
  margin: 0 0 4px;
  color: var(--red);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.modal-title {
  margin: 0;
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.3rem;
  font-weight: 600;
}

.close-btn {
  color: var(--muted);
  padding: 4px;
  cursor: pointer;
  border-radius: 6px;
  transition: all var(--ease);
}

.close-btn:hover {
  background: var(--soft);
  color: var(--ink);
}

.modal-body {
  padding: 20px 24px;
  overflow-y: auto;
  flex: 1;
}

.order-summary-box {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 16px;
  padding: 14px 16px;
  border-radius: var(--r-sm);
  background: var(--soft);
  border: 1px solid var(--line);
  margin-bottom: 18px;
  font-size: 0.82rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.summary-item .label {
  font-size: 0.7rem;
  color: var(--muted);
  font-weight: 600;
}

.price-highlight {
  color: var(--red);
  font-size: 0.95rem;
}

.status-tag {
  display: inline-flex;
  width: fit-content;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 700;
  background: var(--warm);
  color: var(--ink);
}

.status-tag.status-verified {
  background: #edf7ee;
  color: var(--success);
}

.status-tag.status-rejected {
  background: #fef2f2;
  color: var(--color-danger, #dc2626);
}

.image-frame {
  width: 100%;
  min-height: 260px;
  max-height: 420px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  overflow: hidden;
  background: #191512;
  display: grid;
  place-items: center;
}

.proof-img {
  width: 100%;
  height: 100%;
  max-height: 420px;
  object-fit: contain;
  display: block;
}

.no-proof {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--muted);
  gap: 8px;
  font-size: 0.84rem;
  background: var(--paper);
  width: 100%;
  height: 200px;
  justify-content: center;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid var(--line);
  flex-shrink: 0;
  background: #fff;
}

.btn-reject {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--r-sm);
  border: 1px solid #fca5a5;
  background: #fef2f2;
  color: #dc2626;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--ease);
}

.btn-reject:hover {
  background: #fee2e2;
}

.btn-approve {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--r-sm);
  background: var(--success);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--ease);
}

.btn-approve:hover {
  filter: brightness(0.9);
}

.btn-close {
  padding: 8px 16px;
  border-radius: var(--r-sm);
  border: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-close:hover {
  background: var(--soft);
  color: var(--ink);
}

@keyframes modalPop {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
</style>
