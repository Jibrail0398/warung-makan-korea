<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="modal-backdrop" @click.self="handleClose">
      <div class="modal-card compact-proof-modal" role="dialog" aria-modal="true" aria-labelledby="proofModalTitle">
        <div class="modal-header">
          <div>
            <h2 id="proofModalTitle" class="modal-title">Bukti Transfer #{{ order?.id }}</h2>
          </div>
          <button type="button" class="close-btn" aria-label="Tutup modal" @click="handleClose">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="order-summary-box">
            <div class="summary-item">
              <span class="label">Customer</span>
              <strong>{{ order?.customer_name || 'Customer' }}</strong>
            </div>
            <div class="summary-item">
              <span class="label">Total Tagihan</span>
              <strong class="price-highlight">₩{{ (order?.total_price || 0).toLocaleString('ko-KR') }}</strong>
            </div>
            <div class="summary-item">
              <span class="label">Metode</span>
              <span>Bank Transfer</span>
            </div>
            <div class="summary-item">
              <span class="label">Status</span>
              <span class="status-tag" :class="`status-${order?.payment_status}`">{{ paymentStatusLabel(order?.payment_status) }}</span>
            </div>
          </div>

          <div v-if="order?.payment_receipt_url" class="image-frame-wrap">
            <div
              class="image-frame"
              :class="{ 'is-zoomed': isZoomed }"
              @click="toggleZoom"
              :title="isZoomed ? 'Klik untuk memperkecil' : 'Klik untuk memperbesar'"
            >
              <img
                :src="order.payment_receipt_url"
                alt="Bukti Transfer Pembayaran"
                class="proof-img"
              />
              <button
                type="button"
                class="zoom-indicator-btn"
                :aria-label="isZoomed ? 'Perkecil gambar' : 'Perbesar gambar'"
              >
                <svg v-if="!isZoomed" width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.8" /><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><line x1="11" y1="8" x2="11" y2="14" stroke="currentColor" stroke-width="1.8" /><line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" stroke-width="1.8" /></svg>
                <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.8" /><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" stroke-width="1.8" /></svg>
                <span>{{ isZoomed ? 'Perkecil' : 'Perbesar' }}</span>
              </button>
            </div>
            <p class="proof-hint">Klik gambar untuk memperbesar / memperkecil</p>
          </div>

          <div v-else class="no-proof">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8" /><line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
            <p>Customer belum mengunggah bukti transfer.</p>
          </div>
        </div>

        <div class="modal-footer">
          <a
            v-if="order?.payment_receipt_url"
            :href="order.payment_receipt_url"
            target="_blank"
            class="btn-external"
            title="Buka gambar di tab baru"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><polyline points="15 3 21 3 21 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <span>Buka Tab Baru</span>
          </a>
          <button type="button" class="btn-close" @click="handleClose">Tutup</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { ref, watch } from 'vue';
import './PaymentProofViewer.css';

export default {
  name: 'PaymentProofViewer',
  props: { isOpen: Boolean, order: Object },
  emits: ['close'],
  setup(props, { emit }) {
    const isZoomed = ref(false);

    watch(() => props.isOpen, (val) => {
      if (!val) isZoomed.value = false;
    });

    const toggleZoom = () => {
      isZoomed.value = !isZoomed.value;
    };

    const handleClose = () => {
      isZoomed.value = false;
      emit('close');
    };

    const paymentStatusLabel = (status) => ({
      unpaid: 'Unpaid',
      awaiting_verification: 'Menunggu konfirmasi',
      paid: 'Paid'
    }[status] || status || '-');

    return {
      isZoomed,
      toggleZoom,
      handleClose,
      paymentStatusLabel
    };
  }
};
</script>
