<template>
  <div class="cart-item">
    <div class="cart-item-image">
      <img
        :src="item.image"
        :alt="`${item.name} Indonesian product`"
      />
    </div>

    <div class="cart-item-content">
      <div class="cart-item-top">
        <div>
          <span class="product-type">
            {{ item.category === 'restaurant' ? 'Restaurant' : 'Ingredient' }}
          </span>
          <h2>{{ item.name }}</h2>
          <p>{{ item.description }}</p>
        </div>

        <button
          class="remove-button"
          type="button"
          :aria-label="`Remove ${item.name} from cart`"
          @click="cartStore.removeItem(item.id)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <div class="cart-item-bottom">
        <span class="item-price">{{ item.price }}</span>

        <div class="item-actions">
          <QuantityControl
            :quantity="item.quantity"
            :productName="item.name"
            @increase="cartStore.increaseQuantity(item)"
            @decrease="cartStore.decreaseQuantity(item)"
          />

          <strong class="item-total">
            {{ cartStore.formatPrice(item.numericPrice * item.quantity) }}
          </strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../../stores/cart.js';
import QuantityControl from '../common/QuantityControl.vue';

defineProps({
  item: {
    type: Object,
    required: true
  }
});

const cartStore = useCartStore();
</script>

<style scoped>
.cart-item {
  display: flex;
  gap: 20px;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: #fff;
}

.cart-item-image {
  width: 110px;
  height: 110px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: var(--r-sm);
  background: var(--warm);
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}

.cart-item-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.product-type {
  display: inline-block;
  margin-bottom: 4px;
  color: var(--red);
  font-size: .65rem;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.cart-item-top h2 {
  font-size: 1.1rem;
  font-weight: 750;
  line-height: 1.2;
}

.cart-item-top p {
  margin-top: 4px;
  color: var(--muted);
  font-size: 0.84rem;
}

.remove-button {
  color: var(--muted);
  padding: 4px;
  border-radius: 4px;
  transition: color var(--ease);
}

.remove-button:hover {
  color: var(--red);
}

.cart-item-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
}

.item-price {
  color: var(--muted);
  font-size: 0.9rem;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.item-total {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--ink);
}

@media (max-width: 640px) {
  .cart-item {
    flex-direction: column;
    padding: 16px;
  }
  .cart-item-image {
    width: 100%;
    height: 180px;
  }
}
</style>
