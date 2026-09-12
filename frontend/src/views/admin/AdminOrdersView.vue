<template>
  <div class="orders-monitoring-view">
    <header class="page-header">
      <div>
        <p class="page-eyebrow">OPERASIONAL KASIR & DAPUR</p>
        <h1 class="page-title">Monitoring Pesanan</h1>
        <p class="page-description">
          Pantau pesanan masuk, verifikasi bukti transfer pembayaran, dan update status pesanan secara real-time.
        </p>
      </div>

      <div class="header-actions">
        <button
          type="button"
          class="btn-simulate"
          title="Simulasikan order baru masuk"
          @click="handleSimulateIncoming"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>Simulasi Order Baru</span>
        </button>
      </div>
    </header>

    <!-- Status Tabs & Filter -->
    <section class="filter-section">
      <div class="status-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          class="tab-btn"
          :class="{ active: selectedTab === 'all' }"
          @click="selectedTab = 'all'"
        >
          Semua ({{ orders.length }})
        </button>
        <button
          type="button"
          role="tab"
          class="tab-btn"
          :class="{ active: selectedTab === 'pending' }"
          @click="selectedTab = 'pending'"
        >
          Pending ({{ countByStatus('pending') }})
        </button>
        <button
          type="button"
          role="tab"
          class="tab-btn"
          :class="{ active: selectedTab === 'processing' }"
          @click="selectedTab = 'processing'"
        >
          Processing ({{ countByStatus('processing') }})
        </button>
        <button
          type="button"
          role="tab"
          class="tab-btn"
          :class="{ active: selectedTab === 'completed' }"
          @click="selectedTab = 'completed'"
        >
          Completed ({{ countByStatus('completed') }})
        </button>
        <button
          type="button"
          role="tab"
          class="tab-btn"
          :class="{ active: selectedTab === 'cancelled' }"
          @click="selectedTab = 'cancelled'"
        >
          Cancelled ({{ countByStatus('cancelled') }})
        </button>
      </div>

      <div class="search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cari ID pesanan / nama / no HP..."
          class="search-input"
        />
      </div>
    </section>

    <!-- Desktop Orders Table -->
    <div class="table-container">
      <table class="orders-table">
        <thead>
          <tr>
            <th scope="col">ID Pesanan</th>
            <th scope="col">Waktu</th>
            <th scope="col">Customer</th>
            <th scope="col">No. Meja</th>
            <th scope="col">Item Pesanan</th>
            <th scope="col">Total Harga</th>
            <th scope="col">Status Pembayaran</th>
            <th scope="col">Bukti Transfer</th>
            <th scope="col">Status Pesanan</th>
            <th scope="col" class="col-actions">Aksi</th>
          </tr>
        </thead>
        <tbody v-if="filteredOrders.length > 0">
          <tr v-for="order in filteredOrders" :key="order.id">
            <td>
              <router-link :to="`/admin/orders/${order.id}`" class="order-link-code">
                #{{ order.id }}
              </router-link>
            </td>
            <td>
              <div class="time-cell">
                <span>{{ new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
                <small>{{ new Date(order.created_at).toLocaleDateString() }}</small>
              </div>
            </td>
            <td>
              <div class="customer-cell">
                <strong>{{ order.customer_name || 'Guest' }}</strong>
                <small>{{ order.customer_phone || '-' }}</small>
              </div>
            </td>
            <td>
              <span class="order-type-tag">
                {{ order.table_number ? `Meja ${order.table_number}` : 'Takeaway' }}
              </span>
            </td>
            <td>
              <div class="items-cell">
                <span class="items-summary">
                  {{ order.items?.map(i => `${i.quantity}x ${i.product?.name || 'Item'}`).join(', ') }}
                </span>
              </div>
            </td>
            <td>
              <span class="price-val">₩{{ (order.total_price || 0).toLocaleString('ko-KR') }}</span>
            </td>
            <td>
              <span class="payment-status-badge" :class="order.payment_status">
                {{ order.payment_status }}
              </span>
            </td>
            <td>
              <a
                v-if="order.payment_receipt_url"
                :href="order.payment_receipt_url"
                target="_blank"
                class="proof-btn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8" />
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                  <polyline points="21 15 16 10 5 21" stroke="currentColor" stroke-width="1.8" />
                </svg>
                <span>Lihat Bukti</span>
              </a>
              <span v-else class="no-proof-text">-</span>
            </td>
            <td>
              <StatusBadge :status="order.status" />
            </td>
            <td class="col-actions">
              <div class="quick-actions">
                <router-link :to="`/admin/orders/${order.id}`" class="action-btn detail-btn">
                  Detail
                </router-link>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="10" class="empty-state-row">
              <div class="empty-box">
                <p>Tidak ada pesanan pada status ini.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Orders Card List -->
    <div class="mobile-orders-list">
      <article
        v-for="order in filteredOrders"
        :key="`m-${order.id}`"
        class="mobile-order-card"
      >
        <div class="m-card-header">
          <div>
            <router-link :to="`/admin/orders/${order.id}`" class="order-link-code">
              #{{ order.id }}
            </router-link>
            <span class="m-time">{{ new Date(order.created_at).toLocaleString() }}</span>
          </div>
          <StatusBadge :status="order.status" />
        </div>

        <div class="m-card-body">
          <div class="m-row">
            <span class="m-label">Customer:</span>
            <strong>{{ order.customer_name }} ({{ order.customer_phone }})</strong>
          </div>
          <div class="m-row">
            <span class="m-label">Item:</span>
            <span>{{ order.items?.map(i => `${i.quantity}x ${i.product?.name || 'Item'}`).join(', ') }}</span>
          </div>
          <div class="m-row">
            <span class="m-label">Total:</span>
            <strong class="price-val">₩{{ (order.total_price || 0).toLocaleString('ko-KR') }}</strong>
          </div>
          <div v-if="order.payment_receipt_url" class="m-row">
            <span class="m-label">Bukti Bayar:</span>
            <a :href="order.payment_receipt_url" target="_blank" class="proof-btn">
              Lihat Bukti
            </a>
          </div>
        </div>

        <div class="m-card-footer">
          <router-link :to="`/admin/orders/${order.id}`" class="action-btn detail-btn full-btn">
            Buka Detail
          </router-link>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { audioService } from '../../services/audioService.js';
import { orderService } from '../../services/orderService.js';
import StatusBadge from '../../components/admin/StatusBadge.vue';

const orders = ref([]);
const selectedTab = ref('all');
const searchQuery = ref('');

const loadOrders = async () => {
  try {
    const data = await orderService.getAllOrders();
    orders.value = data.data || data;
  } catch (e) {
    console.error('Load orders error:', e);
  }
};

onMounted(() => {
  loadOrders();
});

const countByStatus = (status) => {
  return orders.value.filter(o => o.status === status).length;
};

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const tabMatch = selectedTab.value === 'all' || order.status === selectedTab.value;
    const q = searchQuery.value.trim().toLowerCase();
    const searchMatch = !q || (
      (order.id + ' ' + (order.customer_name || '') + ' ' + (order.customer_phone || ''))
        .toLowerCase()
        .includes(q)
    );
    return tabMatch && searchMatch;
  });
});

const handleSimulateIncoming = async () => {
  audioService.playOrderChime();
  await loadOrders();
};
</script>

<style scoped>
.orders-monitoring-view {
  width: 100%;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.page-eyebrow {
  margin: 0 0 6px;
  color: var(--red);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.page-title {
  margin: 0;
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(26px, 3.2vw, 34px);
  font-weight: 500;
  letter-spacing: -0.03em;
}

.page-description {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 0.86rem;
}

.btn-simulate {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border-radius: var(--r-sm);
  border: 1px solid rgba(165, 29, 45, 0.25);
  background: var(--red-soft);
  color: var(--red);
  font-size: 0.82rem;
  font-weight: 750;
  cursor: pointer;
  transition: all var(--ease);
}

.btn-simulate:hover {
  background: var(--red);
  color: #fff;
}

.filter-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.status-tabs {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px;
  border-radius: var(--r-sm);
  background: var(--soft);
  border: 1px solid var(--line);
  overflow-x: auto;
  max-width: 100%;
}

.tab-btn {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--muted);
  white-space: nowrap;
  cursor: pointer;
  transition: all var(--ease);
}

.tab-btn.active {
  background: #fff;
  color: var(--ink);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box svg {
  position: absolute;
  left: 12px;
  color: var(--muted);
}

.search-input {
  width: 260px;
  height: 38px;
  padding: 0 12px 0 36px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: #fff;
  font-size: 0.82rem;
  outline: none;
}

.search-input:focus {
  border-color: var(--red);
}

.table-container {
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow-x: auto;
  box-shadow: 0 2px 10px rgba(36, 25, 18, 0.04);
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  min-width: 900px;
}

.orders-table th {
  padding: 12px 16px;
  background: var(--soft);
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--line);
}

.orders-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--line);
  font-size: 0.82rem;
  vertical-align: middle;
}

.orders-table tbody tr:last-child td {
  border-bottom: none;
}

.orders-table tbody tr:hover {
  background: rgba(247, 243, 239, 0.4);
}

.order-link-code {
  font-weight: 750;
  color: var(--ink);
  text-decoration: none;
  font-size: 0.86rem;
}

.order-link-code:hover {
  color: var(--red);
  text-decoration: underline;
}

.time-cell {
  display: flex;
  flex-direction: column;
}

.time-cell small {
  color: var(--muted);
  font-size: 0.7rem;
}

.customer-cell {
  display: flex;
  flex-direction: column;
}

.customer-cell strong {
  color: var(--ink);
}

.customer-cell small {
  color: var(--muted);
  font-size: 0.72rem;
}

.order-type-tag {
  font-size: 0.78rem;
  font-weight: 650;
  color: var(--ink);
}

.table-num {
  color: var(--muted);
  font-size: 0.72rem;
}

.items-cell {
  display: flex;
  flex-direction: column;
  max-width: 220px;
}

.items-summary {
  font-size: 0.8rem;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-note-text {
  color: var(--red);
  font-size: 0.7rem;
  font-style: italic;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price-val {
  font-weight: 750;
  color: var(--ink);
}

.proof-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 700;
  background: var(--warm);
  color: var(--ink);
  border: 1px solid var(--line);
  cursor: pointer;
  transition: all var(--ease);
}

.proof-btn.verified {
  background: #edf7ee;
  color: var(--success);
  border-color: rgba(36, 107, 71, 0.2);
}

.proof-btn:hover {
  border-color: var(--red);
}

.no-proof-text {
  color: var(--muted);
}

.quick-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: flex-end;
}

.action-btn {
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 750;
  cursor: pointer;
  text-decoration: none;
  transition: all var(--ease);
}

.verify-btn {
  background: var(--red-soft);
  color: var(--red);
  border: 1px solid rgba(165, 29, 45, 0.25);
}

.verify-btn:hover {
  background: var(--red);
  color: #fff;
}

.ready-btn {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
}

.ready-btn:hover {
  background: #f59e0b;
  color: #fff;
}

.complete-btn {
  background: #edf7ee;
  color: var(--success);
  border: 1px solid rgba(36, 107, 71, 0.25);
}

.complete-btn:hover {
  background: var(--success);
  color: #fff;
}

.detail-btn {
  background: #fff;
  color: var(--muted);
  border: 1px solid var(--line);
}

.detail-btn:hover {
  color: var(--ink);
  border-color: var(--ink);
}

.empty-box {
  padding: 36px;
  text-align: center;
  color: var(--muted);
}

.mobile-orders-list {
  display: none;
}

@media (max-width: 900px) {
  .table-container {
    display: none;
  }

  .mobile-orders-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .mobile-order-card {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 16px;
  }

  .m-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--line);
  }

  .m-time {
    display: block;
    font-size: 0.72rem;
    color: var(--muted);
    margin-top: 2px;
  }

  .m-card-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 0;
    font-size: 0.82rem;
  }

  .m-row {
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }

  .m-label {
    color: var(--muted);
  }

  .m-card-footer {
    display: flex;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid var(--line);
  }

  .full-btn {
    flex: 1;
    text-align: center;
    height: 36px;
    display: grid;
    place-items: center;
  }
}
</style>
