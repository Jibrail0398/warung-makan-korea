<template>
  <section
    class="orders-card"
    aria-labelledby="recentOrdersTitle"
  >
    <div class="section-header">
      <div>
        <p class="section-eyebrow">Orders</p>

        <h2 id="recentOrdersTitle" class="section-title">
          Recent orders
        </h2>
      </div>

      <RouterLink
        to="/admin/orders"
        class="view-link"
      >
        View all
        <span aria-hidden="true">→</span>
      </RouterLink>
    </div>

    <!-- Desktop / Tablet -->
    <div class="orders-table-wrapper">
      <table class="orders-table">
        <caption class="sr-only">
          Recent orders
        </caption>

        <thead>
          <tr>
            <th scope="col">Order ID</th>
            <th scope="col">Customer</th>
            <th scope="col">Items</th>
            <th scope="col">Total</th>
            <th scope="col">Status</th>
          </tr>
        </thead>

        <tbody v-if="displayOrders.length > 0">
          <tr
            v-for="order in displayOrders"
            :key="order.id"
          >
            <td>
              <router-link :to="`/admin/orders/${order.id}`" class="order-id">
                #{{ order.id }}
              </router-link>
            </td>

            <td>
              <span class="customer-name">
                {{ order.customer?.name || order.customer_name || order.customer || 'Pelanggan' }}
              </span>
            </td>

            <td>
              <span class="item-name">
                {{ getItemsSummary(order) }}
              </span>
            </td>

            <td>
              <span class="order-total">
                ₩{{ (order.total || order.total_price || 0).toLocaleString('ko-KR') }}
              </span>
            </td>

            <td>
              <StatusBadge :status="order.status" />
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="5" style="text-align: center; color: var(--muted); padding: 24px;">
              Belum ada pesanan terbaru.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile -->
    <div class="mobile-orders" v-if="displayOrders.length > 0">
      <article
        v-for="order in displayOrders"
        :key="`mobile-${order.id}`"
        class="mobile-order"
      >
        <div class="mobile-order-top">
          <router-link :to="`/admin/orders/${order.id}`" class="order-id">
            #{{ order.id }}
          </router-link>

          <StatusBadge :status="order.status" />
        </div>

        <div class="mobile-order-customer">
          {{ order.customer?.name || order.customer_name || order.customer || 'Pelanggan' }}
        </div>

        <div class="mobile-order-bottom">
          <span class="item-name">
            {{ getItemsSummary(order) }}
          </span>

          <span class="order-total">
            ₩{{ (order.total || order.total_price || 0).toLocaleString('ko-KR') }}
          </span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import StatusBadge from './StatusBadge.vue';

const props = defineProps({
  orders: {
    type: Array,
    default: () => []
  }
});

const fallbackOrders = [
  {
    id: 'WN-10231',
    customer: { name: 'Kelvin' },
    items: [{ quantity: 1, name: 'Nasi Goreng' }],
    total: 24000,
    status: 'Completed'
  },
  {
    id: 'WN-10230',
    customer: { name: 'Andi' },
    items: [{ quantity: 1, name: 'Rendang' }],
    total: 15000,
    status: 'Pending'
  }
];

const displayOrders = computed(() => {
  return props.orders && props.orders.length > 0 ? props.orders : fallbackOrders;
});

const getItemsSummary = (order) => {
  if (order.items && order.items.length > 0) {
    return order.items.map(i => `${i.quantity || 1}x ${i.name || i.product?.name || 'Item'}`).join(', ');
  }
  return order.item || '-';
};
</script>

<style scoped>
.orders-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--paper);
  box-shadow: 0 2px 10px rgba(36, 25, 18, 0.04);
}

.section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 22px 18px;
}

.section-eyebrow {
  margin: 0 0 5px;
  color: var(--muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.section-title {
  margin: 0;
  color: var(--ink);
  font-family:
    Georgia,
    "Times New Roman",
    serif;
  font-size: 21px;
  font-weight: 600;
  letter-spacing: -0.025em;
}

.view-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--red);
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  text-decoration: none;
}

.view-link:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.orders-table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  min-width: 620px;
  border-collapse: collapse;
  text-align: left;
}

.orders-table th {
  padding: 10px 22px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: var(--soft);
  color: var(--muted);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;
}

.orders-table td {
  padding: 14px 22px;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  font-size: 11px;
  vertical-align: middle;
}

.orders-table tbody tr:last-child td {
  border-bottom: 0;
}

.orders-table tbody tr:hover {
  background: rgba(247, 243, 239, 0.45);
}

.order-id {
  color: var(--ink);
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  text-decoration: none;
}

.order-id:hover {
  color: var(--red);
  text-decoration: underline;
}

.customer-name {
  font-weight: 600;
}

.item-name {
  color: var(--muted);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}

.order-total {
  color: var(--ink);
  font-weight: 700;
  white-space: nowrap;
}

.mobile-orders {
  display: none;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 860px) {
  .section-header {
    padding: 20px 18px 16px;
  }

  .orders-table-wrapper {
    display: none;
  }

  .mobile-orders {
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--line);
  }

  .mobile-order {
    padding: 15px 18px;
    border-bottom: 1px solid var(--line);
  }

  .mobile-order:last-child {
    border-bottom: 0;
  }

  .mobile-order-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .mobile-order-customer {
    margin-top: 10px;
    color: var(--ink);
    font-size: 13px;
    font-weight: 600;
  }

  .mobile-order-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-top: 6px;
  }
}
</style>