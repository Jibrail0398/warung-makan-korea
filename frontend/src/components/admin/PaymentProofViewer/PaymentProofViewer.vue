<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="proofModalTitle">
      <div class="modal-header"><div><p class="modal-eyebrow">VERIFIKASI PEMBAYARAN</p><h2 id="proofModalTitle" class="modal-title">Bukti Transfer — {{ order?.orderNumber || order?.id }}</h2></div><button type="button" class="close-btn" aria-label="Tutup modal" @click="$emit('close')"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg></button></div>
      <div class="modal-body">
        <div class="order-summary-box">
          <div class="summary-item"><span class="label">Customer:</span><strong>{{ order?.customer?.name || 'Customer' }}</strong></div>
          <div class="summary-item"><span class="label">Total Tagihan:</span><strong class="price-highlight">₩{{ (order?.total || 0).toLocaleString('ko-KR') }}</strong></div>
          <div class="summary-item"><span class="label">Metode:</span><span>{{ order?.paymentMethod || 'Bank Transfer' }}</span></div>
          <div class="summary-item"><span class="label">Status:</span><span class="status-tag" :class="`status-${(order?.paymentStatus || '').toLowerCase().replace(/\s+/g, '-')}`">{{ order?.paymentStatus || 'Waiting Verification' }}</span></div>
        </div>
        <div class="image-frame">
          <img v-if="order?.paymentProof" :src="order?.paymentProof" alt="Bukti Transfer Pembayaran" class="proof-img" />
          <div v-else class="no-proof"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8" /><line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg><p>Customer belum mengunggah bukti transfer.</p></div>
        </div>
      </div>
      <div class="modal-footer">
        <button v-if="order?.paymentProof && order?.paymentStatus !== 'Verified'" type="button" class="btn-reject" @click="$emit('reject', order)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8" /><line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg> Tolak Bukti</button>
        <button v-if="order?.paymentProof && order?.paymentStatus !== 'Verified'" type="button" class="btn-approve" @click="$emit('approve', order)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg> Konfirmasi & Verifikasi</button>
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
