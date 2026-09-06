<template>
  <div class="checkout-page-wrap">
    <AppHeader variant="checkout" title="Checkout" />

    <main>
      <section class="checkout-section">
        <div class="container checkout-container">
          <!-- Heading -->
          <div class="checkout-heading">
            <span class="eyebrow">Payment</span>
            <h1>Complete your order.</h1>
            <p>
              Transfer the total amount to the account below,
              then upload your payment receipt to confirm the order.
            </p>
          </div>

          <div class="checkout-layout">
            <!-- Payment Card (Info & Upload) -->
            <section class="payment-card" aria-labelledby="paymentTitle">
              <PaymentInfoCard
                :formattedTotal="cartStore.formatPrice(cartStore.total || 58000)"
                @showToast="showToast"
              />
              <PaymentProofUpload @showToast="showToast" />
            </section>

            <!-- Order Summary Sidebar -->
            <aside class="order-summary">
              <div class="summary-heading">
                <span class="section-label">Your order</span>
                <h2>Order summary</h2>
              </div>

              <div class="summary-items">
                <div
                  v-for="item in cartStore.cartItems"
                  :key="item.id"
                  class="summary-item"
                >
                  <div class="summary-item-image">
                    <img :src="item.image" :alt="item.name" />
                  </div>
                  <div class="summary-item-info">
                    <strong>{{ item.name }}</strong>
                    <span>× {{ item.quantity }}</span>
                  </div>
                  <strong class="summary-item-price">
                    {{ cartStore.formatPrice(item.numericPrice * item.quantity) }}
                  </strong>
                </div>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-row">
                <span>Subtotal</span>
                <strong>{{ cartStore.formatPrice(cartStore.subtotal) }}</strong>
              </div>

              <div class="summary-row">
                <span>Delivery</span>
                <strong>{{ cartStore.delivery === 0 ? 'Free' : cartStore.formatPrice(cartStore.delivery) }}</strong>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-total">
                <span>Total</span>
                <strong>{{ cartStore.formatPrice(cartStore.total) }}</strong>
              </div>

              <div class="secure-note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 3 19 6v5c0 4.8-3 8.3-7 10-4-1.7-7-5.2-7-10V6l7-3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
                  <path d="m9 12 2 2 4-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span>Your payment will be verified before the order is processed.</span>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>

    <ToastNotification
      :visible="isToastVisible"
      :message="toastMessage"
    />
  </div>
</template>

<script setup>
import AppHeader from '../components/layout/AppHeader.vue';
import PaymentInfoCard from '../components/checkout/PaymentInfoCard.vue';
import PaymentProofUpload from '../components/checkout/PaymentProofUpload.vue';
import ToastNotification from '../components/common/ToastNotification.vue';
import { useCartStore } from '../stores/cart.js';
import { useToast } from '../composables/useToast.js';

const cartStore = useCartStore();
const { isToastVisible, toastMessage, showToast } = useToast();
</script>

<style scoped>
.checkout-section {
  padding: 70px 0 90px;
  background: var(--paper);
}

.checkout-container {
  max-width: 1120px;
}

.checkout-heading {
  max-width: 680px;
  margin-bottom: 42px;
}

.checkout-heading h1 {
  margin-top: 7px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 500;
  letter-spacing: -.055em;
  line-height: 1;
}

.checkout-heading p {
  max-width: 580px;
  margin-top: 18px;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.7;
}

.eyebrow, .section-label {
  display: block;
  color: var(--red);
  font-size: .7rem;
  font-weight: 800;
  letter-spacing: .15em;
  text-transform: uppercase;
}

.checkout-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(300px, .65fr);
  gap: 26px;
  align-items: start;
}

.payment-card, .order-summary {
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: #fff;
}

.payment-card {
  padding: 30px;
}

.order-summary {
  padding: 24px;
}

.summary-heading h2 {
  margin-top: 5px;
  margin-bottom: 20px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.35rem;
  font-weight: 500;
}

.summary-items {
  display: grid;
  gap: 14px;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.summary-item-image {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: var(--r-sm);
  background: var(--warm);
}

.summary-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.summary-item-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  font-size: 0.84rem;
}

.summary-item-info strong {
  font-weight: 700;
}

.summary-item-info span {
  color: var(--muted);
  font-size: 0.78rem;
}

.summary-item-price {
  font-size: 0.86rem;
  font-weight: 800;
}

.summary-divider {
  height: 1px;
  background: var(--line);
  margin: 14px 0;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.86rem;
  color: var(--muted);
}

.summary-row strong {
  color: var(--ink);
}

.summary-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 1.1rem;
  font-weight: 800;
}

.summary-total strong {
  color: var(--red);
}

.secure-note {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  color: var(--muted);
  font-size: 0.76rem;
  line-height: 1.4;
}

.secure-note svg {
  flex-shrink: 0;
  color: var(--red);
}

@media (max-width: 860px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }
}
</style>
