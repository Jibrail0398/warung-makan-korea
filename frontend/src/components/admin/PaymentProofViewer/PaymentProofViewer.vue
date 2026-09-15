<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="proofModalTitle">
      <div class="modal-header"><div><p class="modal-eyebrow">VERIFIKASI PEMBAYARAN</p><h2 id="proofModalTitle" class="modal-title">Bukti Transfer — {{ order?.id }}</h2></div><button type="button" class="close-btn" aria-label="Tutup modal" @click="$emit('close')"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg></button></div>
      <div class="modal-body">
        <div class="order-summary-box">
          <div class="summary-item"><span class="label">Customer:</span><strong>{{ order?.customer_name || 'Customer' }}</strong></div>
          <div class="summary-item"><span class="label">Total Tagihan:</span><strong class="price-highlight">₩{{ (order?.total_price || 0).toLocaleString('ko-KR') }}</strong></div>
          <div class="summary-item"><span class="label">Metode:</span><span>Bank Transfer</span></div>
          <div class="summary-item"><span class="label">Status:</span><span class="status-tag">{{ order?.payment_status || 'unpaid' }}</span></div>
        </div>
        <div class="image-frame">
          <img v-if="order?.payment_receipt_url" :src="order?.payment_receipt_url" alt="Bukti Transfer Pembayaran" class="proof-img" />
          <div v-else class="no-proof"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8" /><line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg><p>Customer belum mengunggah bukti transfer.</p></div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn-close" @click="$emit('close')">Tutup</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentProofViewer',
  props: { isOpen: Boolean, order: Object },
  emits: ['close', 'approve', 'reject']
};
</script>
