<template>
  <div class="order-left-column">
    <article class="detail-card order-detail-card">
      <div class="card-heading"><span class="card-number">01</span><h2>Order Detail</h2></div>
      <div class="detail-list">
        <div class="detail-row"><span>Customer</span><strong>{{ order.customerName || 'Kelvin Winata' }}</strong></div>
        <div v-if="order.customerPhone" class="detail-row"><span>Phone</span><strong>{{ order.customerPhone }}</strong></div>
        <div class="detail-row"><span>Order Date</span><strong>{{ order.orderDate || formatDate(order.date) || '25 August 2026' }}</strong></div>
        <div class="detail-row"><span>Order Time</span><strong>{{ order.orderTime || '12:30 PM' }}</strong></div>
        <div class="detail-row"><span>Order Type</span><strong>{{ order.orderType || 'Takeaway' }}</strong></div>
      </div>
    </article>
    <article class="detail-card order-note-card">
      <div class="card-heading"><span class="card-number">03</span><h2>Order Note</h2></div>
      <p class="order-note-text">{{ order.note || 'Tidak ada catatan khusus.' }}</p>
    </article>
  </div>
</template>

<script>
import OrderDetailCardScript from './OrderDetailCard.js';
export default { ...OrderDetailCardScript };
</script>
