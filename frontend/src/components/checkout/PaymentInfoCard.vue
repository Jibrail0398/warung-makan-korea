<template>
  <div class="card-heading">
    <div>
      <span class="section-label">Payment method</span>
      <h2 id="paymentTitle">Transfer Bank Manual</h2>
    </div>
    <span class="payment-status">Manual transfer</span>
  </div>

  <div class="payment-details">
    <div class="payment-row">
      <span>Bank</span>
      <strong>{{ bankInfo.bankName }}</strong>
    </div>

    <div class="payment-row">
      <span>Nomor Rekening</span>
      <div class="account-number">
        <strong>{{ bankInfo.accountNumber }}</strong>
        <button
          type="button"
          class="copy-button"
          @click="copyAccountNumber"
          :aria-label="copied ? 'Account number copied' : 'Copy account number'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="8" y="8" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.7" />
            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" stroke-width="1.7" />
          </svg>
          {{ copied ? 'Copied' : 'Copy' }}
        </button>
      </div>
    </div>

    <div class="payment-row">
      <span>Atas Nama</span>
      <strong>{{ bankInfo.accountHolder }}</strong>
    </div>
  </div>

  <div class="total-payment">
    <span>Total Pembayaran</span>
    <strong>{{ formattedTotal }}</strong>
  </div>

  <div class="payment-instruction">
    <span class="instruction-icon">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7" />
        <path d="M12 10v6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
        <circle cx="12" cy="7" r="1" fill="currentColor" />
      </svg>
    </span>
    <p>Setelah melakukan transfer, upload bukti pembayaran.</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { paymentService } from '../../services/paymentService.js';

defineProps({
  formattedTotal: {
    type: String,
    default: '₩58,000'
  }
});

const emit = defineEmits(['showToast']);

const bankInfo = paymentService.getBankDetails();
const copied = ref(false);

function copyAccountNumber() {
  navigator.clipboard
    .writeText(bankInfo.accountNumber)
    .then(() => {
      copied.value = true;
      emit('showToast', 'Nomor rekening berhasil disalin');
      setTimeout(() => {
        copied.value = false;
      }, 1800);
    })
    .catch(() => {
      emit('showToast', 'Gagal menyalin nomor rekening');
    });
}
</script>

<style scoped>
.section-label {
  display: block;
  color: var(--red);
  font-size: .7rem;
  font-weight: 800;
  letter-spacing: .15em;
  text-transform: uppercase;
}

.card-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 25px;
  border-bottom: 1px solid var(--line);
}

.card-heading h2 {
  margin-top: 5px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.55rem;
  font-weight: 500;
  letter-spacing: -.035em;
}

.payment-status {
  padding: 7px 10px;
  border-radius: 999px;
  background: var(--soft);
  color: var(--red);
  font-size: .63rem;
  font-weight: 800;
  letter-spacing: .06em;
  text-transform: uppercase;
  white-space: nowrap;
}

.payment-details {
  padding: 8px 0;
}

.payment-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  padding: 17px 0;
  border-bottom: 1px solid #eee8e3;
}

.payment-row:last-child {
  border-bottom: 0;
}

.payment-row > span {
  color: var(--muted);
  font-size: .83rem;
}

.payment-row strong {
  color: var(--ink);
  font-size: .9rem;
}

.account-number {
  display: flex;
  align-items: center;
  gap: 12px;
}

.copy-button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--red);
  font-size: .7rem;
  font-weight: 800;
}

.total-payment {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  margin-top: 10px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  font-size: 1.05rem;
  font-weight: 750;
}

.total-payment strong {
  color: var(--red);
  font-size: 1.25rem;
}

.payment-instruction {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 22px;
  padding: 14px 16px;
  border-radius: var(--r-sm);
  background: var(--soft);
  color: var(--muted);
  font-size: 0.84rem;
}

.instruction-icon {
  color: var(--red);
}
</style>
