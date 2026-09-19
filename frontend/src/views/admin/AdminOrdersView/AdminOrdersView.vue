<template>
  <div class="orders-monitoring-view">
    <header class="page-header">
      <div>
        <h1 class="page-title">Monitoring Pesanan</h1>
      </div>
    </header>

    <section class="filter-section">
      <div class="filter-controls">
        <div class="date-filter">
          <label class="filter-label" for="orderDateFilter">Tanggal</label>
          <input
            id="orderDateFilter"
            type="date"
            v-model="filterDate"
            class="filter-input"
          />
        </div>

        <select v-model="paymentStatusFilter" class="filter-input payment-filter" aria-label="Filter status pembayaran">
          <option value="all">Semua Status Pembayaran</option>
          <option value="unpaid">Unpaid</option>
          <option value="awaiting_verification">Awaiting Verification</option>
          <option value="paid">Paid</option>
        </select>

        <select v-model="orderStatusFilter" class="filter-input order-status-filter" aria-label="Filter status pesanan">
          <option value="all">Semua Status Pesanan</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <div class="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.8" /><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
          <input type="text" v-model="searchQuery" placeholder="Cari ID pesanan / nama / no HP..." class="search-input" />
        </div>
      </div>
    </section>

    <div class="table-container">
      <table class="orders-table">
        <thead>
          <tr>
            <th scope="col">ID Pesanan</th>
            <th scope="col">Waktu</th>
            <th scope="col">Customer</th>
            <th scope="col">Item Pesanan</th>
            <th scope="col">Total Harga</th>
            <th scope="col">Status Pembayaran</th>
            <th scope="col">Bukti Transfer</th>
            <th scope="col">Status Pesanan</th>
            <th scope="col" class="col-actions">Aksi</th>
          </tr>
        </thead>
        <tbody v-if="isPageLoading">
          <tr>
            <td colspan="9" class="empty-state-row">
              <LoadingSpinner size="md" color="primary" text="Memuat daftar pesanan..." center />
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="filteredOrders.length > 0">
          <tr v-for="order in filteredOrders" :key="order.id">
            <td><router-link :to="`/admin/orders/${order.id}`" class="order-link-code">#{{ order.id }}</router-link></td>
            <td><div class="time-cell"><span>{{ new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span><small>{{ new Date(order.created_at).toLocaleDateString() }}</small></div></td>
            <td><div class="customer-cell"><strong>{{ order.customer_name || 'Guest' }}</strong><small>{{ order.customer_phone || '-' }}</small></div></td>
            <td><div class="items-cell"><span class="items-summary">{{ order.items?.map(i => `${i.quantity}x ${i.product?.name || 'Item'}`).join(', ') }}</span></div></td>
            <td><span class="price-val">₩{{ (order.total_price || 0).toLocaleString('ko-KR') }}</span></td>
            <td><span class="payment-status-badge" :class="order.payment_status">{{ paymentStatusLabel(order.payment_status) }}</span></td>
            <td>
              <div class="proof-cell">
                <img
                  v-if="order.payment_receipt_url"
                  :src="order.payment_receipt_url"
                  alt="Bukti Transfer"
                  class="proof-thumb"
                  title="Klik untuk memperbesar bukti transfer"
                  @click="openProof(order)"
                />
                <span v-else class="no-proof-text">-</span>
              </div>
            </td>
            <td><StatusBadge :status="order.status" /></td>
            <td class="col-actions"><div class="quick-actions"><router-link :to="`/admin/orders/${order.id}`" class="action-btn detail-btn">Detail</router-link></div></td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="9" class="empty-state-row">
              <div class="empty-box"><p>Tidak ada pesanan pada tanggal {{ filterDate }}.</p></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mobile-orders-list">
      <div v-if="isPageLoading" class="mobile-loading">
        <LoadingSpinner size="md" color="primary" text="Memuat daftar pesanan..." center />
      </div>
      <template v-else-if="filteredOrders.length > 0">
        <article v-for="order in filteredOrders" :key="`m-${order.id}`" class="mobile-order-card">
          <div class="m-card-header"><div><router-link :to="`/admin/orders/${order.id}`" class="order-link-code">#{{ order.id }}</router-link><span class="m-time">{{ new Date(order.created_at).toLocaleString() }}</span></div><StatusBadge :status="order.status" /></div>
          <div class="m-card-body">
            <div class="m-row"><span class="m-label">Customer:</span><strong>{{ order.customer_name }} ({{ order.customer_phone }})</strong></div>
            <div class="m-row"><span class="m-label">Item:</span><span>{{ order.items?.map(i => `${i.quantity}x ${i.product?.name || 'Item'}`).join(', ') }}</span></div>
            <div class="m-row"><span class="m-label">Total:</span><strong class="price-val">₩{{ (order.total_price || 0).toLocaleString('ko-KR') }}</strong></div>
            <div v-if="order.payment_receipt_url" class="m-row">
              <span class="m-label">Bukti Bayar:</span>
              <img
                :src="order.payment_receipt_url"
                alt="Bukti Transfer"
                class="proof-thumb"
                title="Klik untuk memperbesar bukti transfer"
                @click="openProof(order)"
              />
            </div>
          </div>
          <div class="m-card-footer"><router-link :to="`/admin/orders/${order.id}`" class="action-btn detail-btn full-btn">Buka Detail</router-link></div>
        </article>
      </template>
      <div v-else class="empty-box">
        <p>Tidak ada pesanan yang sesuai filter.</p>
      </div>
    </div>

    <!-- Modal Bukti Transfer -->
    <PaymentProofViewer
      :isOpen="isProofViewerOpen"
      :order="selectedOrderForProof"
      @close="isProofViewerOpen = false"
    />
  </div>
</template>

<script>
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner.vue';
import AdminOrdersScript from './AdminOrdersView.js';

export default {
  ...AdminOrdersScript,
  components: {
    LoadingSpinner,
    ...AdminOrdersScript.components
  }
};
</script>
