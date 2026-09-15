<template>
  <div class="checkout-page-wrap">
    <AppHeader variant="checkout" title="Checkout" />
    <main>
      <section class="checkout-section">
        <div class="container checkout-container">
          <div class="checkout-heading">
            <span class="eyebrow">Payment</span>
            <h1>Complete your order.</h1>
            <p>Transfer the total amount to the account below, then upload your payment receipt to confirm the order.</p>
          </div>
          <div class="checkout-layout">
            <section class="payment-card" aria-labelledby="paymentTitle">
              <PaymentInfoCard :formattedTotal="cartStore.formatPrice(cartStore.total || 58000)" @showToast="showToast" />
              <PaymentProofUpload @showToast="showToast" />
            </section>
            <aside class="order-summary">
              <div class="summary-heading"><span class="section-label">Your order</span><h2>Order summary</h2></div>
              <div class="summary-items">
                <div v-for="item in cartStore.cartItems" :key="item.id" class="summary-item">
                  <div class="summary-item-image"><img :src="ResolveImageUrl(item.image)" :alt="item.name" /></div>
                  <div class="summary-item-info"><strong>{{ item.name }}</strong><span>× {{ item.quantity }}</span></div>
                  <strong class="summary-item-price">{{ cartStore.formatPrice(item.numericPrice * item.quantity) }}</strong>
                </div>
              </div>
              <div class="summary-divider"></div>
              <div class="summary-row"><span>Subtotal</span><strong>{{ cartStore.formatPrice(cartStore.subtotal) }}</strong></div>
              <div class="summary-divider"></div>
              <div class="summary-total"><span>Total</span><strong>{{ cartStore.formatPrice(cartStore.total) }}</strong></div>
              <div class="secure-note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 19 6v5c0 4.8-3 8.3-7 10-4-1.7-7-5.2-7-10V6l7-3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" /><path d="m9 12 2 2 4-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>
                <span>Your payment will be verified before the order is processed.</span>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
    <ToastNotification :visible="isToastVisible" :message="toastMessage" />
  </div>
</template>

<script>
import CheckoutViewScript from './CheckoutView.js';
export default { ...CheckoutViewScript };
</script>
