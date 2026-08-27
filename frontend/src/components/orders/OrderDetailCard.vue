<template>
  <div class="order-left-column">
    <!-- 01 Order Detail -->
    <article class="detail-card order-detail-card">
      <div class="card-heading">
        <span class="card-number">01</span>
        <h2>Order Detail</h2>
      </div>

      <div class="detail-list">
        <div class="detail-row">
          <span>Customer</span>
          <strong>{{ order.customerName || 'Kelvin Winata' }}</strong>
        </div>

        <div v-if="order.customerPhone" class="detail-row">
          <span>Phone</span>
          <strong>{{ order.customerPhone }}</strong>
        </div>

        <div class="detail-row">
          <span>Order Date</span>
          <strong>{{ order.orderDate || formatDate(order.date) || '25 August 2026' }}</strong>
        </div>

        <div class="detail-row">
          <span>Order Time</span>
          <strong>{{ order.orderTime || '12:30 PM' }}</strong>
        </div>

        <div class="detail-row">
          <span>Order Type</span>
          <strong>{{ order.orderType || 'Takeaway' }}</strong>
        </div>
      </div>
    </article>

    <!-- 03 Order Note -->
    <article class="detail-card order-note-card">
      <div class="card-heading">
        <span class="card-number">03</span>
        <h2>Order Note</h2>
      </div>

      <p class="order-note-text">
        {{ order.note || 'Tidak ada catatan khusus.' }}
      </p>
    </article>
  </div>
</template>

<script setup>
defineProps({
  order: {
    type: Object,
    default: () => ({})
  }
});

function formatDate(date) {
  if (!date) return '';
  if (typeof date === 'string' && date.includes(' ')) return date;
  try {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(date));
  } catch {
    return date;
  }
}
</script>

<style scoped>
.order-left-column {
  display: grid;
  grid-template-rows: auto auto;
  gap: 22px;
}

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

.detail-list {
  display: grid;
  gap: 14px;
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

.order-note-text {
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.5;
}
</style>
