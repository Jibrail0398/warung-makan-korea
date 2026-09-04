<template>
  <div>
    <!-- 04 Payment Proof -->
    <section class="payment-proof-full">
      <article class="payment-proof-card">
        <div class="card-heading">
          <span class="card-number">04</span>
          <h2>Payment Proof &amp; Receipt</h2>
        </div>

        <div class="proof-status" :class="{ 'proof-empty': !hasProof }">
          <span class="check-icon" :class="{ 'icon-muted': !hasProof }">
            {{ hasProof ? '✓' : 'i' }}
          </span>
          <div>
            <strong>{{ hasProof ? 'Payment proof submitted' : 'Receipt & Order Record' }}</strong>
            <p>
              {{ hasProof
                ? 'Your transfer receipt has been successfully recorded.'
                : 'Official digital receipt and proof of order record.'
              }}
            </p>
          </div>
        </div>

        <div class="payment-proof-actions">
          <button
            v-if="hasProof"
            type="button"
            class="secondary-button"
            @click="showModal = true"
          >
            View Payment Proof
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <div v-else></div>

          <div class="receipt-actions-inline">
            <button
              type="button"
              class="receipt-button primary"
              @click="$emit('download')"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              Download Receipt
            </button>

            <button
              type="button"
              class="receipt-button"
              @click="$emit('print')"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M7 9V4h10v5M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7 14h10v6H7z" stroke="currentColor" stroke-width="1.7" />
              </svg>
              Print
            </button>
          </div>
        </div>
      </article>
    </section>

    <!-- Payment proof modal -->
    <div
      v-if="showModal"
      class="modal-backdrop"
      @click.self="showModal = false"
    >
      <div class="proof-modal">
        <div class="modal-header">
          <div>
            <span class="eyebrow">Payment proof</span>
            <h2>Transfer Receipt</h2>
          </div>
          <button
            type="button"
            class="close-button"
            aria-label="Close"
            @click="showModal = false"
          >
            &times;
          </button>
        </div>

        <div class="proof-image">
          <img
            :src="proofImage"
            alt="Payment proof"
          />
        </div>

        <p class="proof-caption">
          Uploaded payment proof for transaction {{ order.transactionId || order.id || 'TRX-001' }}.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  order: {
    type: Object,
    default: () => ({})
  }
});

defineEmits(['download', 'print']);

const showModal = ref(false);

const hasProof = computed(() => {
  return Boolean(props.order.paymentProof);
});

const proofImage = computed(() => {
  return props.order.paymentProof || 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=900';
});
</script>

<style scoped>
.payment-proof-full {
  margin-top: 24px;
}

.payment-proof-card {
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: #fff;
}

.card-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}

.card-number {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 50%;
  background: var(--soft);
  color: var(--red);
  font-size: 0.72rem;
  font-weight: 800;
}

.card-heading h2 {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.25rem;
  font-weight: 500;
}

.proof-status {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-radius: var(--r-sm);
  background: var(--soft);
}

.check-icon {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 50%;
  background: var(--success);
  color: #fff;
  font-weight: 800;
  font-size: 0.85rem;
}

.check-icon.icon-muted {
  background: #625b55;
  font-style: italic;
}

.proof-status strong {
  display: block;
  font-size: 0.92rem;
}

.proof-status p {
  color: var(--muted);
  font-size: 0.8rem;
}

.payment-proof-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 20px;
}

.secondary-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: #fff;
  color: var(--ink);
  font-size: 0.84rem;
  font-weight: 750;
  cursor: pointer;
  transition: border-color var(--ease), color var(--ease);
}

.secondary-button:hover {
  border-color: var(--red);
  color: var(--red);
}

.receipt-actions-inline {
  display: flex;
  gap: 10px;
}

.receipt-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 15px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: #fff;
  color: var(--ink);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: border-color var(--ease), background var(--ease), color var(--ease);
}

.receipt-button.primary {
  background: var(--ink);
  color: #fff;
  border-color: var(--ink);
}

.receipt-button.primary:hover {
  background: var(--red);
  border-color: var(--red);
}

.receipt-button:hover {
  border-color: var(--red);
  color: var(--red);
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(25, 21, 18, 0.5);
  backdrop-filter: blur(4px);
}

.proof-modal {
  width: min(100%, 540px);
  padding: 28px;
  border-radius: var(--r-md);
  background: #fff;
  box-shadow: var(--shadow);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.eyebrow {
  display: block;
  color: var(--red);
  font-size: .7rem;
  font-weight: 800;
  letter-spacing: .15em;
  text-transform: uppercase;
}

.modal-header h2 {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.4rem;
  font-weight: 500;
}

.close-button {
  font-size: 1.6rem;
  line-height: 1;
  color: var(--muted);
  cursor: pointer;
}

.close-button:hover {
  color: var(--red);
}

.proof-image {
  max-height: 320px;
  overflow: hidden;
  border-radius: var(--r-sm);
  background: var(--soft);
}

.proof-image img {
  width: 100%;
  max-height: 320px;
  object-fit: contain;
}

.proof-caption {
  margin-top: 14px;
  color: var(--muted);
  font-size: 0.82rem;
  text-align: center;
}

@media (max-width: 640px) {
  .payment-proof-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .receipt-actions-inline {
    width: 100%;
    flex-direction: column;
  }
  .receipt-button, .secondary-button {
    justify-content: center;
  }
}
</style>
