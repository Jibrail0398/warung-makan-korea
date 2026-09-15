<template>
  <div class="card-heading"><div><span class="section-label">Payment method</span><h2 id="paymentTitle">Transfer Bank Manual</h2></div><span class="payment-status">Manual transfer</span></div>
  <div class="payment-details">
    <div class="payment-row"><span>Bank</span><strong>{{ bankInfo.bankName }}</strong></div>
    <div class="payment-row"><span>Nomor Rekening</span><div class="account-number"><strong>{{ bankInfo.accountNumber }}</strong><button type="button" class="copy-button" @click="copyAccountNumber" :aria-label="copied ? 'Account number copied' : 'Copy account number'"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.7" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" stroke-width="1.7" /></svg>{{ copied ? 'Copied' : 'Copy' }}</button></div></div>
    <div class="payment-row"><span>Atas Nama</span><strong>{{ bankInfo.accountHolder }}</strong></div>
  </div>
  <div class="total-payment"><span>Total Pembayaran</span><strong>{{ formattedTotal }}</strong></div>
  <div class="payment-instruction"><span class="instruction-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7" /><path d="M12 10v6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" /><circle cx="12" cy="7" r="1" fill="currentColor" /></svg></span><p>Setelah melakukan transfer, upload bukti pembayaran.</p></div>
</template>

<script>
import PaymentInfoCardScript from './PaymentInfoCard.js';
export default { ...PaymentInfoCardScript };
</script>
