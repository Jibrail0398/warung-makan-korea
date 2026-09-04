<template>
  <div class="cart-page-wrap">
    <AppHeader variant="cart" />

    <main class="cart-page">
      <div class="container">
        <!-- Heading -->
        <div class="page-heading">
          <span class="eyebrow">Your selection</span>
          <div class="heading-row">
            <h1>Your cart</h1>
            <span class="item-count">
              {{ cartStore.cartCount }} {{ cartStore.cartCount === 1 ? 'item' : 'items' }}
            </span>
          </div>
        </div>

        <!-- Empty Cart -->
        <section v-if="cartStore.cartItems.length === 0" class="empty-cart">
          <div class="empty-cart-icon">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3.5 4h2l1.8 10.2a2 2 0 0 0 2 1.7h7.9a2 2 0 0 0 2-1.6L20.5 8H6.3"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle cx="9.5" cy="20" r=".8" fill="currentColor" />
              <circle cx="17.5" cy="20" r=".8" fill="currentColor" />
            </svg>
          </div>
          <h2>Your cart is empty</h2>
          <p>Discover authentic Indonesian food and ingredients and add something to your order.</p>
          <router-link class="btn-primary" to="/#menu">
            Browse menu
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </router-link>
        </section>

        <!-- Cart Layout -->
        <section v-else class="cart-layout">
          <!-- Items List -->
          <div class="cart-items">
            <CartItem
              v-for="item in cartStore.cartItems"
              :key="item.id"
              :item="item"
            />

            <router-link class="continue-link" to="/#menu">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M19 12H5m6-6-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              Continue shopping
            </router-link>
          </div>

          <!-- Summary Sidebar -->
          <CartSummary />
        </section>
      </div>
    </main>

    <AppFooter :simple="true" />
  </div>
</template>

<script setup>
import AppHeader from '../components/layout/AppHeader.vue';
import AppFooter from '../components/layout/AppFooter.vue';
import CartItem from '../components/cart/CartItem.vue';
import CartSummary from '../components/cart/CartSummary.vue';
import { useCartStore } from '../stores/cart.js';

const cartStore = useCartStore();
</script>

<style scoped>
.cart-page-wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.cart-page {
  flex-grow: 1;
  padding: 48px 0 80px;
  background: var(--paper);
}

.page-heading {
  margin-bottom: 36px;
}

.eyebrow {
  display: block;
  color: var(--red);
  font-size: .7rem;
  font-weight: 800;
  letter-spacing: .15em;
  text-transform: uppercase;
}

.heading-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 4px;
}

.heading-row h1 {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.2rem, 4vw, 3rem);
  font-weight: 500;
}

.item-count {
  color: var(--muted);
  font-size: 0.9rem;
  font-weight: 700;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  border: 1px dashed var(--line);
  border-radius: var(--r-md);
  background: var(--soft);
  text-align: center;
}

.empty-cart-icon {
  display: grid;
  width: 64px;
  height: 64px;
  place-items: center;
  border-radius: 50%;
  background: var(--paper);
  color: var(--muted);
  margin-bottom: 20px;
  box-shadow: var(--shadow);
}

.empty-cart h2 {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.8rem;
  font-weight: 500;
  margin-bottom: 8px;
}

.empty-cart p {
  color: var(--muted);
  max-width: 400px;
  margin-bottom: 28px;
}

.btn-primary {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  gap: 10px;
  padding: 0 24px;
  border-radius: var(--r-sm);
  background: var(--red);
  color: #fff;
  font-size: .88rem;
  font-weight: 780;
  text-transform: uppercase;
  letter-spacing: .05em;
}

.cart-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 32px;
  align-items: start;
}

.cart-items {
  display: grid;
  gap: 16px;
}

.continue-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  color: var(--muted);
  font-size: 0.88rem;
  font-weight: 700;
  transition: color var(--ease);
}

.continue-link:hover {
  color: var(--red);
}

@media (max-width: 960px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
}
</style>
