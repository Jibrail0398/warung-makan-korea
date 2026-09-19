<template>
  <section class="orders-card" aria-labelledby="recentOrdersTitle">
    <div class="section-header"><div><h2 id="recentOrdersTitle" class="section-title">Recent orders</h2></div><RouterLink to="/admin/orders" class="view-link">View all <span aria-hidden="true">→</span></RouterLink></div>
    <div class="orders-table-wrapper">
      <table class="orders-table"><caption class="sr-only">Recent orders</caption><thead><tr><th scope="col">Order ID</th><th scope="col">Customer</th><th scope="col">Items</th><th scope="col">Total</th><th scope="col">Status</th></tr></thead><tbody><tr v-for="order in orders" :key="order.id"><td><span class="order-id">{{ order.id }}</span></td><td><span class="customer-name">{{ order.customer }}</span></td><td><span class="item-name">{{ order.item }}</span></td><td><span class="order-total">{{ formatCurrency(order.total) }}</span></td><td><StatusBadge :status="order.status" /></td></tr></tbody></table>
    </div>
    <div class="mobile-orders">
      <article v-for="order in orders" :key="`mobile-${order.id}`" class="mobile-order">
        <div class="mobile-order-top"><span class="order-id">{{ order.id }}</span><StatusBadge :status="order.status" /></div>
        <div class="mobile-order-customer">{{ order.customer }}</div>
        <div class="mobile-order-bottom"><span class="item-name">{{ order.item }}</span><span class="order-total">{{ formatCurrency(order.total) }}</span></div>
      </article>
    </div>
  </section>
</template>

<script>
import RecentOrdersScript from './RecentOrders.js';
export default { ...RecentOrdersScript };
</script>
