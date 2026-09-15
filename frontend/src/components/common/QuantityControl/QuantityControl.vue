<template>
  <div class="product-cart-control" @click.stop>
    <button v-if="quantity === 0" class="quantity-button quantity-add" type="button" :aria-label="`Add ${productName || 'product'} to cart`" @click="$emit('increase')"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" /></svg></button>
    <div v-else class="quantity-control">
      <button class="quantity-button" type="button" :aria-label="`Remove one ${productName || 'product'}`" @click="$emit('decrease')"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" /></svg></button>
      <span class="quantity-value" :aria-label="`${quantity} ${productName || 'product'} in cart`">{{ quantity }}</span>
      <button class="quantity-button" type="button" :aria-label="`Add one more ${productName || 'product'}`" @click="$emit('increase')"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" /></svg></button>
    </div>
  </div>
</template>

<script>
import './QuantityControl.css';
export default {
  name: 'QuantityControl',
  props: { quantity: { type: Number, default: 0 }, productName: { type: String, default: '' } },
  emits: ['increase', 'decrease']
};
</script>
