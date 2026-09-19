<template>
  <div class="checkout-page-wrap">
    <AppHeader variant="checkout" title="Checkout" />
    <main>
      <section class="checkout-section">
        <div class="container checkout-container">
          <div class="checkout-heading">
            <h1>Complete your order</h1>
            <p>Transfer the total amount to the account below, then upload your payment receipt to confirm the order.</p>
          </div>
          <div class="checkout-layout">
            <section class="payment-card" aria-labelledby="paymentTitle">
              <PaymentInfoCard :formattedTotal="cartStore.formatPrice(cartStore.total || 58000)" @showToast="showToast" />
              <PaymentProofUpload @showToast="showToast" />
            </section>
            <aside class="order-summary">
              <div class="summary-heading"><h2>Order summary</h2></div>
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
            </aside>
          </div>
        </div>
      </section>
    </main>
    <ToastNotification :visible="isToastVisible" :message="toastMessage" />
    <AppFooter :simple="true" />
  </div>
</template>

<script>
import CheckoutViewScript from './CheckoutView.js';
export default { ...CheckoutViewScript };
</script>
