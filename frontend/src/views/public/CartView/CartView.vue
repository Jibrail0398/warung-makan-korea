<template>
  <div class="cart-page-wrap">
    <AppHeader variant="cart" />
    <main class="cart-page">
      <div class="container">
        <div v-if="cartStore.cartItems.length !== 0" class="page-heading">
          <span class="eyebrow">Your selection</span>
          <div class="heading-row">
            <h1>Your cart</h1>
            <span class="item-count">{{ cartStore.cartCount }} {{ cartStore.cartCount === 1 ? 'item' : 'items' }}</span>
          </div>
        </div>
        <section v-if="cartStore.cartItems.length === 0" class="empty-cart">
          <div class="empty-cart-icon"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.5 4h2l1.8 10.2a2 2 0 0 0 2 1.7h7.9a2 2 0 0 0 2-1.6L20.5 8H6.3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /><circle cx="9.5" cy="20" r=".8" fill="currentColor" /><circle cx="17.5" cy="20" r=".8" fill="currentColor" /></svg></div>
          <h2>Your cart is empty</h2>
          <p>Discover authentic Indonesian food and ingredients and add something to your order.</p>
          <router-link class="btn-primary" to="/#menu">Browse menu <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg></router-link>
        </section>
        <section v-else class="cart-layout">
          <div class="cart-items">
            <CartItem v-for="item in cartStore.cartItems" :key="item.id" :item="item" />
            <router-link class="continue-link" to="/#menu"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg> Continue shopping</router-link>
          </div>
          <CartSummary @showToast="showToast" />
        </section>
      </div>
    </main>
    <ToastNotification :visible="isToastVisible" :message="toastMessage" :type="toastType" />
    <AppFooter :simple="true" />
  </div>
</template>

<script>
import CartViewScript from './CartView.js';
export default { ...CartViewScript };
</script>
