<template>
  <div class="product-cart-control" @click.stop>
    <!-- Belum ada di cart -->
    <button
      v-if="quantity === 0"
      class="quantity-button quantity-add"
      type="button"
      :aria-label="`Add ${productName || 'product'} to cart`"
      @click="$emit('increase')"
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" />
      </svg>
    </button>

    <!-- Sudah ada di cart -->
    <div v-else class="quantity-control">
      <button
        class="quantity-button"
        type="button"
        :aria-label="`Remove one ${productName || 'product'}`"
        @click="$emit('decrease')"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12h14" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" />
        </svg>
      </button>

      <span
        class="quantity-value"
        :aria-label="`${quantity} ${productName || 'product'} in cart`"
      >
        {{ quantity }}
      </span>

      <button
        class="quantity-button"
        type="button"
        :aria-label="`Add one more ${productName || 'product'}`"
        @click="$emit('increase')"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  quantity: {
    type: Number,
    default: 0
  },
  productName: {
    type: String,
    default: ''
  }
});

defineEmits(['increase', 'decrease']);
</script>

<style scoped>
.product-cart-control {
  display: inline-flex;
  align-items: center;
}

.quantity-button {
  display: inline-grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 50%;
  background: var(--ink);
  color: #fff;
  transition: background var(--ease), transform var(--ease);
}

.quantity-button:hover {
  background: var(--red);
  transform: scale(1.04);
}

.quantity-button:active {
  transform: scale(0.96);
}

.quantity-control {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 3px 4px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #fff;
}

.quantity-control .quantity-button {
  width: 30px;
  height: 30px;
}

.quantity-value {
  min-width: 18px;
  font-size: 0.86rem;
  font-weight: 750;
  text-align: center;
  color: var(--ink);
}
</style>
