<template>
  <article class="detail-card order-payment-card">
    <div class="card-heading"><span class="card-number">02</span><h2>Order &amp; Payment</h2></div>
    <div class="card-section-label">Order Items</div>
    <div class="embedded-items">
      <div v-for="(item, index) in items" :key="item.id || index" class="embedded-order-item">
        <div class="item-main"><div class="item-image"><img :src="item.image || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=300'" :alt="item.name" /></div><div><h3>{{ item.name }}</h3><p>{{ formatPrice(item.price) }} × {{ item.quantity }}</p></div></div>
        <strong class="item-total">{{ formatPrice(item.total || calculateItemTotal(item)) }}</strong>
      </div>
    </div>
    <div class="card-section-label payment-label">Payment Detail</div>
    <div class="detail-list">
      <div class="detail-row"><span>Subtotal</span><strong>{{ formatPrice(order.totalOrder || order.total || order.totalAmount) }}</strong></div>
      <div class="detail-divider"></div>
      <div class="detail-row total-row"><span>Total Payment</span><strong>{{ formatPrice(order.totalAmount || order.total || order.totalOrder) }}</strong></div>
      <div class="detail-row"><span>Transaction ID</span><strong>{{ order.transactionId || (order.id ? `TRX-${order.id}` : 'TRX-001') }}</strong></div>
      <div class="detail-row"><span>Payment Method</span><strong>{{ order.paymentMethod || 'Bank Transfer' }}</strong></div>
      <div class="detail-row"><span>Payment Status</span><span class="payment-badge" :class="`status-${(order.status || '').toLowerCase().replace(/\s+/g, '-')}`">{{ order.status || 'Payment Verification' }}</span></div>
    </div>
  </article>
</template>

<script>
import OrderPaymentCardScript from './OrderPaymentCard.js';
export default { ...OrderPaymentCardScript };
</script>
