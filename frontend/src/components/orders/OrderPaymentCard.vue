<template>
  <article class="detail-card order-payment-card">
    <div class="card-heading">
      <span class="card-number">02</span>
      <h2>Order &amp; Payment</h2>
    </div>

    <!-- Order Items -->
    <div class="card-section-label">
      Order Items
    </div>

    <div class="embedded-items">
      <div
        v-for="(item, index) in items"
        :key="item.id || index"
        class="embedded-order-item"
      >
        <div class="item-main">
          <div class="item-image">
            <img :src="item.image || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=300'" :alt="item.name" />
          </div>
          <div>
            <h3>{{ item.name }}</h3>
            <p>{{ formatPrice(item.price) }} × {{ item.quantity }}</p>
          </div>
        </div>
        <strong class="item-total">{{ formatPrice(item.total || calculateItemTotal(item)) }}</strong>
      </div>
    </div>

    <!-- Payment Detail -->
    <div class="card-section-label payment-label">
      Payment Detail
    </div>

    <div class="detail-list">
      <div class="detail-row">
        <span>Subtotal</span>
        <strong>{{ formatPrice(order.totalOrder || order.total || order.totalAmount) }}</strong>
      </div>

      <div class="detail-divider"></div>

      <div class="detail-row total-row">
        <span>Total Payment</span>
        <strong>{{ formatPrice(order.totalAmount || order.total || order.totalOrder) }}</strong>
      </div>

      <div class="detail-row">
        <span>Transaction ID</span>
        <strong>{{ order.transactionId || (order.id ? `TRX-${order.id}` : 'TRX-001') }}</strong>
      </div>

      <div class="detail-row">
        <span>Payment Method</span>
        <strong>{{ order.paymentMethod || 'Bank Transfer' }}</strong>
      </div>

      <div class="detail-row">
        <span>Payment Status</span>
        <span class="payment-badge" :class="`status-${(order.status || '').toLowerCase().replace(/\s+/g, '-')}`">
          {{ order.status || 'Payment Verification' }}
        </span>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  order: {
    type: Object,
    default: () => ({})
  },
  items: {
    type: Array,
    default: () => []
  }
});

function calculateItemTotal(item) {
  const price = typeof item.price === 'number'
    ? item.price
    : parseInt(String(item.price || '').replace(/[^\d]/g, ''), 10) || 0;
  return price * Number(item.quantity || 1);
}

function formatPrice(price) {
  if (typeof price === 'string' && price.startsWith('₩')) return price;
  const num = typeof price === 'number'
    ? price
    : parseInt(String(price || '').replace(/[^\d]/g, ''), 10) || 0;
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0
  }).format(num);
}
</script>

<style scoped>
.detail-card {
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: #fff;
}

.card-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}

.card-number {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 50%;
  background: var(--soft);
  color: var(--red);
  font-size: 0.72rem;
  font-weight: 800;
}

.card-heading h2 {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.25rem;
  font-weight: 500;
}

.card-section-label {
  margin-bottom: 14px;
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.payment-label {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--line);
}

.embedded-items {
  display: grid;
  gap: 14px;
}

.embedded-order-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.item-main {
  display: flex;
  align-items: center;
  gap: 14px;
}

.item-image {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: var(--r-sm);
  background: var(--warm);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-main h3 {
  font-size: 0.92rem;
  font-weight: 700;
}

.item-main p {
  color: var(--muted);
  font-size: 0.8rem;
}

.item-total {
  font-size: 0.92rem;
  font-weight: 800;
  white-space: nowrap;
}

.detail-list {
  display: grid;
  gap: 12px;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.88rem;
}

.detail-row span {
  color: var(--muted);
}

.detail-row strong {
  color: var(--ink);
  text-align: right;
}

.detail-divider {
  height: 1px;
  background: var(--line);
  margin: 4px 0;
}

.total-row {
  font-size: 1.05rem;
}

.total-row strong {
  color: var(--red);
  font-weight: 800;
}

.payment-badge {
  padding: 4px 10px;
  border-radius: var(--r-sm);
  background: var(--soft);
  font-size: 0.72rem;
  font-weight: 800;
}

.payment-badge.status-completed {
  color: #287a45;
  background: #edf7f0;
}

.payment-badge.status-cancelled {
  color: #a33a3a;
  background: #fdf0f0;
}

.payment-badge.status-in-progress,
.payment-badge.status-processing {
  color: #365f91;
  background: #edf4fb;
}

.payment-badge.status-payment-verification,
.payment-badge.status-waiting-payment {
  color: #9a7018;
  background: #fdf8eb;
}
</style>
