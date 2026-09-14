<template>
  <div>
    <section class="payment-proof-full">
      <article class="payment-proof-card">
        <div class="card-heading"><span class="card-number">04</span><h2>Payment Proof &amp; Receipt</h2></div>
        <div class="proof-status" :class="{ 'proof-empty': !hasProof }">
          <span class="check-icon" :class="{ 'icon-muted': !hasProof }">{{ hasProof ? '✓' : 'i' }}</span>
          <div><strong>{{ hasProof ? 'Payment proof submitted' : 'Receipt & Order Record' }}</strong><p>{{ hasProof ? 'Your transfer receipt has been successfully recorded.' : 'Official digital receipt and proof of order record.' }}</p></div>
        </div>
        <div class="payment-proof-actions">
          <button v-if="hasProof" type="button" class="secondary-button" @click="showModal = true">View Payment Proof <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg></button>
          <div v-else></div>
          <div class="receipt-actions-inline">
            <button type="button" class="receipt-button primary" @click="$emit('download')"><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg> Download Receipt</button>
            <button type="button" class="receipt-button" @click="$emit('print')"><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M7 9V4h10v5M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /><path d="M7 14h10v6H7z" stroke="currentColor" stroke-width="1.7" /></svg> Print</button>
          </div>
        </div>
      </article>
    </section>
    <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
      <div class="proof-modal">
        <div class="modal-header"><div><span class="eyebrow">Payment proof</span><h2>Transfer Receipt</h2></div><button type="button" class="close-button" aria-label="Close" @click="showModal = false">&times;</button></div>
        <div class="proof-image"><img :src="proofImage" alt="Payment proof" /></div>
        <p class="proof-caption">Uploaded payment proof for transaction {{ order.transactionId || order.id || 'TRX-001' }}.</p>
      </div>
    </div>
  </div>
</template>

<script>
import PaymentProofModalScript from './PaymentProofModal.js';
export default { ...PaymentProofModalScript };
</script>
