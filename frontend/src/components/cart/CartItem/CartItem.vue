<template>
  <div class="cart-item">
    <div class="cart-item-image"><img :src="ResolveImageUrl(item.image)" :alt="`${item.name} Indonesian product`" /></div>
    <div class="cart-item-content">
      <div class="cart-item-top">
        <div><span v-if="categoryDisplayName" class="product-type">{{ categoryDisplayName }}</span><h2>{{ item.name }}</h2><p>{{ item.description }}</p></div>
        <button class="remove-button" type="button" :aria-label="`Remove ${item.name} from cart`" @click="cartStore.removeItem(item.id)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" /></svg></button>
      </div>
      <div class="cart-item-bottom">
        <span class="item-price">{{ item.price }}</span>
        <div class="item-actions">
          <QuantityControl :quantity="item.quantity" :productName="item.name" @increase="cartStore.increaseQuantity(item)" @decrease="cartStore.decreaseQuantity(item)" />
          <strong class="item-total">{{ cartStore.formatPrice(item.numericPrice * item.quantity) }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CartItemScript from './CartItem.js';
export default { ...CartItemScript };
</script>
