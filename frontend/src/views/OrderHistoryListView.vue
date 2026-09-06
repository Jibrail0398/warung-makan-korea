<template>
  <div class="order-history-page">
    <AppHeader variant="default" />

    <main class="order-history-main">
      <div class="container">
        <header class="page-heading">
          <div>
            <p class="eyebrow">Your orders</p>
            <h1>Order History</h1>
            <p class="page-description">
              View your previous orders and their current status.
            </p>
          </div>
        </header>

        <section class="history-toolbar">
          <div class="search-wrapper">
            <label for="order-search" class="search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.7" />
                <path d="m16 16 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
              </svg>
              <span class="sr-only">Search orders</span>
              <input
                id="order-search"
                v-model="searchQuery"
                type="search"
                placeholder="Search by order ID or product name..."
                autocomplete="off"
              />
            </label>
          </div>

          <div class="filter-buttons" role="group" aria-label="Filter orders by status">
            <button
              v-for="filter in filters"
              :key="filter.value"
              type="button"
              :class="{ active: activeFilter === filter.value }"
              :aria-pressed="activeFilter === filter.value"
              @click="setFilter(filter.value)"
            >
              {{ filter.label }}
            </button>
          </div>
        </section>

        <section class="orders-list" aria-live="polite" :aria-busy="isLoading">
          <!-- Loading skeleton -->
          <div v-if="isLoading" class="skeleton-list">
            <div v-for="n in 3" :key="n" class="skeleton-order-card">
              <div class="skeleton-line skeleton-header"></div>
              <div class="skeleton-line skeleton-body"></div>
              <div class="skeleton-line skeleton-footer"></div>
            </div>
          </div>

          <!-- Orders list -->
          <div v-else-if="filteredOrders.length">
            <OrderCard
              v-for="order in filteredOrders"
              :key="order.id"
              :order="order"
              @view="handleViewOrder"
            />
          </div>

          <!-- Empty state -->
          <div v-else class="empty-state">
            <div class="empty-state-inner">
              <span class="empty-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M3 6h18M16 10a4 4 0 0 1-8 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <h2>No orders found</h2>
              <p v-if="searchQuery || activeFilter !== 'all'">
                We could not find any orders matching your filters.
              </p>
              <p v-else>
                You have not placed any orders yet. Discover our delicious Indonesian menu and raw materials.
              </p>
              <div class="empty-actions">
                <button
                  v-if="searchQuery || activeFilter !== 'all'"
                  type="button"
                  class="btn-secondary"
                  @click="resetFilters"
                >
                  Reset Filters
                </button>
                <router-link to="/menu" class="btn-primary">
                  Browse Menu
                </router-link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '../components/layout/AppHeader.vue';
import AppFooter from '../components/layout/AppFooter.vue';
import OrderCard from '../components/orders/OrderCard.vue';
import { orderService } from '../services/orderService.js';

const router = useRouter();

const searchQuery = ref('');
const activeFilter = ref('all');
const isLoading = ref(false);
const orders = ref([]);

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Cancelled', value: 'cancelled' }
];

const filteredOrders = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return orders.value.filter((order) => {
    const statusLower = (order.status || '').toLowerCase().replace(/\s+/g, '-');
    let matchesFilter = activeFilter.value === 'all';
    if (activeFilter.value === 'completed') {
      matchesFilter = statusLower.includes('completed') || statusLower.includes('selesai');
    } else if (activeFilter.value === 'in-progress') {
      matchesFilter =
        statusLower.includes('progress') ||
        statusLower.includes('verification') ||
        statusLower.includes('preparing') ||
        statusLower.includes('ready') ||
        statusLower.includes('waiting');
    } else if (activeFilter.value === 'cancelled') {
      matchesFilter = statusLower.includes('cancelled') || statusLower.includes('batal');
    }

    const orderIdMatch = (order.id || order.orderId || '').toLowerCase().includes(query);
    const itemsMatch = (order.items || []).some((item) =>
      (item.name || '').toLowerCase().includes(query)
    );

    return matchesFilter && (!query || orderIdMatch || itemsMatch);
  });
});

function setFilter(val) {
  activeFilter.value = val;
}

function resetFilters() {
  searchQuery.value = '';
  activeFilter.value = 'all';
}

function handleViewOrder(order) {
  const orderId = order.id || order.orderId;
  router.push(`/order-history/${orderId}`);
}

onMounted(async () => {
  isLoading.value = true;
  try {
    orders.value = await orderService.getOrderHistory();
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.order-history-page {
  min-height: 100vh;
  background: var(--paper);
  color: var(--ink);
}

.order-history-main {
  padding: 58px 0 90px;
}

.page-heading {
  margin-bottom: 34px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  color: var(--red);
  font-size: .76rem;
  font-weight: 800;
  letter-spacing: .14em;
  line-height: 1;
  text-transform: uppercase;
}

.eyebrow::before {
  width: 28px;
  height: 2px;
  background: currentColor;
  content: "";
}

.page-heading h1 {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 500;
  letter-spacing: -.045em;
  line-height: 1.08;
}

.page-description {
  max-width: 520px;
  margin: 12px 0 0;
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.6;
}

.history-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--line);
}

.search-wrapper {
  flex: 1;
  max-width: 440px;
}

.search-box {
  display: flex;
  height: 48px;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--paper);
  transition: border-color var(--ease), box-shadow var(--ease);
}

.search-box:focus-within {
  border-color: var(--red);
  box-shadow: 0 0 0 4px rgba(165, 29, 45, .08);
}

.search-box svg {
  color: #7d756f;
  flex-shrink: 0;
}

.search-box input {
  width: 100%;
  height: 100%;
  border: 0;
  background: transparent;
  outline: 0;
  color: var(--ink);
  font-size: 0.88rem;
}

.filter-buttons {
  display: flex;
  padding: 4px;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: var(--soft);
}

.filter-buttons button {
  min-height: 38px;
  padding: 0 16px;
  border-radius: var(--r-sm);
  color: var(--muted);
  font-size: .82rem;
  font-weight: 700;
  white-space: nowrap;
  transition: color var(--ease), background var(--ease), box-shadow var(--ease);
}

.filter-buttons button:hover {
  color: var(--red);
}

.filter-buttons button.active {
  background: #fff;
  color: var(--red);
  box-shadow: 0 3px 12px rgba(36, 25, 18, .08);
}

.orders-list {
  max-width: 900px;
}

.skeleton-list {
  display: grid;
  gap: 16px;
}

.skeleton-order-card {
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: var(--soft);
  animation: pulse 1.1s ease-in-out infinite alternate;
}

.skeleton-line {
  background: #ebe5df;
  border-radius: 6px;
}

.skeleton-header {
  height: 38px;
  width: 50%;
  margin-bottom: 20px;
}

.skeleton-body {
  height: 60px;
  width: 100%;
  margin-bottom: 20px;
}

.skeleton-footer {
  height: 24px;
  width: 40%;
}

@keyframes pulse {
  from { opacity: .52; }
  to { opacity: 1; }
}

.empty-state {
  display: grid;
  min-height: 300px;
  place-items: center;
  padding: 50px 20px;
  border: 1px dashed #d6cec7;
  border-radius: var(--r-md);
  background: var(--soft);
  text-align: center;
}

.empty-state-inner {
  max-width: 400px;
}

.empty-icon {
  display: grid;
  width: 54px;
  height: 54px;
  place-items: center;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: #fff;
  color: var(--red);
  box-shadow: 0 4px 14px rgba(0, 0, 0, .05);
}

.empty-state h2 {
  margin-bottom: 8px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.6rem;
  font-weight: 500;
}

.empty-state p {
  margin-bottom: 24px;
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.55;
}

.empty-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.btn-primary {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  padding: 0 22px;
  border-radius: var(--r-sm);
  background: var(--red);
  color: #fff;
  font-size: .84rem;
  font-weight: 780;
  letter-spacing: .02em;
  text-transform: uppercase;
  transition: background var(--ease), transform var(--ease);
}

.btn-primary:hover {
  background: #8f1827;
  transform: translateY(-1px);
}

.btn-secondary {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: #fff;
  color: var(--ink);
  font-size: .84rem;
  font-weight: 750;
  cursor: pointer;
  transition: border-color var(--ease), color var(--ease);
}

.btn-secondary:hover {
  border-color: var(--red);
  color: var(--red);
}

@media (max-width: 860px) {
  .order-history-main {
    padding: 42px 0 65px;
  }

  .history-toolbar {
    align-items: stretch;
    flex-direction: column;
    gap: 16px;
  }

  .search-wrapper {
    max-width: none;
  }

  .filter-buttons {
    width: 100%;
    overflow-x: auto;
  }

  .filter-buttons button {
    flex: 1;
    min-width: max-content;
  }
}

@media (max-width: 480px) {
  .empty-actions {
    flex-direction: column;
    width: 100%;
  }

  .empty-actions .btn-primary,
  .empty-actions .btn-secondary {
    width: 100%;
  }
}
</style>