<template>
  <article class="order-card">
    <div class="order-card-top">
      <div><span class="order-label">Order</span><h3>{{ order.id || order.orderId }}</h3><p class="order-date">{{ formatDate(order.date || order.orderDate) }}</p></div>
      <span class="order-status" :class="statusClass">{{ order.status }}</span>
    </div>
    <div class="order-card-content">
      <div class="order-items">
        <div v-for="(item, index) in visibleItems" :key="`${order.id}-${index}`" class="order-item"><span>{{ item.name }}</span><span>× {{ item.quantity }}</span></div>
        <p v-if="remainingItems > 0" class="more-items">+{{ remainingItems }} more item{{ remainingItems > 1 ? 's' : '' }}</p>
      </div>
      <div class="order-total"><span>{{ totalItems }} {{ totalItems === 1 ? 'item' : 'items' }}</span><strong>{{ formatPrice(order.total || order.totalAmount) }}</strong></div>
    </div>
    <div class="order-card-bottom">
      <span class="product-count">{{ (order.items || []).length }} {{ (order.items || []).length === 1 ? 'product' : 'products' }}</span>
      <button type="button" class="view-order" @click="$emit('view', order)">View Detail <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg></button>
    </div>
  </article>
</template>

<script>
import OrderCardScript from './OrderCard.js';
export default { ...OrderCardScript };
</script>
