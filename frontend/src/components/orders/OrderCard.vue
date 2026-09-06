<template>
  <article class="order-card">
    <div class="order-card-top">
      <div>
        <span class="order-label">Order</span>
        <h3>{{ order.id || order.orderId }}</h3>
        <p class="order-date">{{ formatDate(order.date || order.orderDate) }}</p>
      </div>

      <span
        class="order-status"
        :class="statusClass"
      >
        {{ order.status }}
      </span>
    </div>

    <div class="order-card-content">
      <div class="order-items">
        <div
          v-for="(item, index) in visibleItems"
          :key="`${order.id}-${index}`"
          class="order-item"
        >
          <span>{{ item.name }}</span>
          <span>× {{ item.quantity }}</span>
        </div>

        <p v-if="remainingItems > 0" class="more-items">
          +{{ remainingItems }} more item{{ remainingItems > 1 ? 's' : '' }}
        </p>
      </div>

      <div class="order-total">
        <span>
          {{ totalItems }} {{ totalItems === 1 ? 'item' : 'items' }}
        </span>
        <strong>{{ formatPrice(order.total || order.totalAmount) }}</strong>
      </div>
    </div>

    <div class="order-card-bottom">
      <span class="product-count">
        {{ (order.items || []).length }}
        {{ (order.items || []).length === 1 ? 'product' : 'products' }}
      </span>

      <button
        type="button"
        class="view-order"
        @click="$emit('view', order)"
      >
        View Detail
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 12h14m-5-5 5 5-5 5"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
});

defineEmits(['view']);

const visibleItems = computed(() => {
  return (props.order.items || []).slice(0, 3);
});

const remainingItems = computed(() => {
  return Math.max((props.order.items || []).length - 3, 0);
});

const totalItems = computed(() => {
  return (props.order.items || []).reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );
});

const statusClass = computed(() => {
  const s = (props.order.status || '').toLowerCase().replace(/\s+/g, '-');
  return `status-${s}`;
});

function formatPrice(price) {
  if (typeof price === 'string' && price.startsWith('₩')) return price;
  const num = Number(price) || 0;
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0
  }).format(num);
}

function formatDate(date) {
  if (!date) return '';
  if (typeof date === 'string' && date.includes(' ')) return date;
  try {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  } catch {
    return date;
  }
}
</script>

<style scoped>
.order-card {
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: var(--paper);
  transition:
    border-color var(--ease),
    box-shadow var(--ease),
    transform var(--ease);
}

.order-card + .order-card {
  margin-top: 16px;
}

.order-card:hover {
  border-color: #d4cbc3;
  box-shadow: 0 8px 24px rgba(36, 25, 18, .06);
  transform: translateY(-1px);
}

.order-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.order-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 9px;
  color: var(--red);
  font-size: .68rem;
  font-weight: 800;
  letter-spacing: .12em;
  line-height: 1;
  text-transform: uppercase;
}

.order-label::before {
  width: 20px;
  height: 2px;
  background: currentColor;
  content: "";
}

.order-card h3 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  color: var(--ink);
  font-size: 1.35rem;
  font-weight: 500;
  letter-spacing: -.025em;
}

.order-date {
  margin-top: 6px;
  color: var(--muted);
  font-size: .78rem;
}

.order-status {
  display: inline-flex;
  min-height: 30px;
  align-items: center;
  padding: 0 11px;
  border-radius: var(--r-sm);
  background: var(--soft);
  font-size: .7rem;
  font-weight: 800;
}

.status-completed {
  color: #287a45;
  background: #edf7f0;
}

.status-cancelled {
  color: #a33a3a;
  background: #fdf0f0;
}

.status-pending,
.status-waiting-payment,
.status-payment-verification {
  color: #9a7018;
  background: #fdf8eb;
}

.status-processing,
.status-in-progress,
.status-preparing {
  color: #365f91;
  background: #edf4fb;
}

.status-ready {
  color: #287a45;
  background: #edf7f0;
}

.order-card-content {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 30px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.order-items {
  min-width: 0;
}

.order-item {
  display: flex;
  gap: 12px;
  color: var(--ink);
  font-size: .86rem;
}

.order-item + .order-item {
  margin-top: 8px;
}

.order-item span:first-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-item span:last-child {
  color: var(--muted);
  white-space: nowrap;
}

.more-items {
  margin: 10px 0 0;
  color: var(--muted);
  font-size: .75rem;
}

.order-total {
  min-width: 120px;
  text-align: right;
}

.order-total span {
  display: block;
  color: var(--muted);
  font-size: .74rem;
}

.order-total strong {
  display: block;
  margin-top: 5px;
  color: var(--ink);
  font-size: 1rem;
  font-weight: 800;
}

.order-card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.product-count {
  color: var(--muted);
  font-size: .75rem;
}

.view-order {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 0 3px;
  border: 0;
  border-bottom: 1px solid var(--ink);
  background: transparent;
  color: var(--ink);
  font-size: .82rem;
  font-weight: 750;
  cursor: pointer;
  transition:
    color var(--ease),
    border-color var(--ease),
    gap var(--ease);
}

.view-order:hover {
  gap: 12px;
  border-color: var(--red);
  color: var(--red);
}

@media (max-width: 640px) {
  .order-card {
    padding: 20px;
  }

  .order-card-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .order-total {
    text-align: left;
  }

  .order-card-bottom {
    align-items: flex-start;
  }
}
</style>