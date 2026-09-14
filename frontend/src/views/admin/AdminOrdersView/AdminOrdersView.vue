<template>
  <div class="orders-monitoring-view">
    <header class="page-header">
      <div>
        <p class="page-eyebrow">OPERASIONAL KASIR & DAPUR</p>
        <h1 class="page-title">Monitoring Pesanan</h1>
        <p class="page-description">Pantau pesanan masuk, verifikasi bukti transfer pembayaran, dan update status pesanan secara real-time.</p>
      </div>
      <div class="header-actions">
        <button type="button" class="btn-simulate" title="Simulasikan order baru masuk" @click="handleSimulateIncoming">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
          <span>Simulasi Order Baru</span>
        </button>
      </div>
    </header>
    <section class="filter-section">
      <div class="status-tabs" role="tablist">
        <button type="button" role="tab" class="tab-btn" :class="{ active: selectedTab === 'all' }" @click="selectedTab = 'all'">Semua ({{ orders.length }})</button>
        <button type="button" role="tab" class="tab-btn" :class="{ active: selectedTab === 'unpaid' }" @click="selectedTab = 'unpaid'">Unpaid ({{ countByPaymentStatus('unpaid') }})</button>
        <button type="button" role="tab" class="tab-btn" :class="{ active: selectedTab === 'awaiting_verification' }" @click="selectedTab = 'awaiting_verification'">Awaiting Verification ({{ countByPaymentStatus('awaiting_verification') }})</button>
        <button type="button" role="tab" class="tab-btn" :class="{ active: selectedTab === 'paid' }" @click="selectedTab = 'paid'">Paid ({{ countByPaymentStatus('paid') }})</button>
      </div>
      <div class="search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.8" /><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
        <input type="text" v-model="searchQuery" placeholder="Cari ID pesanan / nama / no HP..." class="search-input" />
      </div>
    </section>
    <div class="table-container">
      <table class="orders-table">
        <thead>
          <tr><th scope="col">ID Pesanan</th><th scope="col">Waktu</th><th scope="col">Customer</th><th scope="col">No. Meja</th><th scope="col">Item Pesanan</th><th scope="col">Total Harga</th><th scope="col">Status Pembayaran</th><th scope="col">Bukti Transfer</th><th scope="col">Status Pesanan</th><th scope="col" class="col-actions">Aksi</th></tr>
        </thead>
        <tbody v-if="filteredOrders.length > 0">
          <tr v-for="order in filteredOrders" :key="order.id">
            <td><router-link :to="`/admin/orders/${order.id}`" class="order-link-code">#{{ order.id }}</router-link></td>
            <td><div class="time-cell"><span>{{ new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span><small>{{ new Date(order.created_at).toLocaleDateString() }}</small></div></td>
            <td><div class="customer-cell"><strong>{{ order.customer_name || 'Guest' }}</strong><small>{{ order.customer_phone || '-' }}</small></div></td>
            <td><span class="order-type-tag">{{ order.table_number ? `Meja ${order.table_number}` : 'Takeaway' }}</span></td>
            <td><div class="items-cell"><span class="items-summary">{{ order.items?.map(i => `${i.quantity}x ${i.product?.name || 'Item'}`).join(', ') }}</span></div></td>
            <td><span class="price-val">₩{{ (order.total_price || 0).toLocaleString('ko-KR') }}</span></td>
            <td><span class="payment-status-badge" :class="order.payment_status">{{ order.payment_status }}</span></td>
            <td><a v-if="order.payment_receipt_url" :href="order.payment_receipt_url" target="_blank" class="proof-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8" /><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" /><polyline points="21 15 16 10 5 21" stroke="currentColor" stroke-width="1.8" /></svg><span>Lihat Bukti</span></a><span v-else class="no-proof-text">-</span></td>
            <td><StatusBadge :status="order.status" /></td>
            <td class="col-actions"><div class="quick-actions"><router-link :to="`/admin/orders/${order.id}`" class="action-btn detail-btn">Detail</router-link></div></td>
          </tr>
        </tbody>
        <tbody v-else><tr><td colspan="10" class="empty-state-row"><div class="empty-box"><p>Tidak ada pesanan pada status ini.</p></div></td></tr></tbody>
      </table>
    </div>
    <div class="mobile-orders-list">
      <article v-for="order in filteredOrders" :key="`m-${order.id}`" class="mobile-order-card">
        <div class="m-card-header"><div><router-link :to="`/admin/orders/${order.id}`" class="order-link-code">#{{ order.id }}</router-link><span class="m-time">{{ new Date(order.created_at).toLocaleString() }}</span></div><StatusBadge :status="order.status" /></div>
        <div class="m-card-body">
          <div class="m-row"><span class="m-label">Customer:</span><strong>{{ order.customer_name }} ({{ order.customer_phone }})</strong></div>
          <div class="m-row"><span class="m-label">Item:</span><span>{{ order.items?.map(i => `${i.quantity}x ${i.product?.name || 'Item'}`).join(', ') }}</span></div>
          <div class="m-row"><span class="m-label">Total:</span><strong class="price-val">₩{{ (order.total_price || 0).toLocaleString('ko-KR') }}</strong></div>
          <div v-if="order.payment_receipt_url" class="m-row"><span class="m-label">Bukti Bayar:</span><a :href="order.payment_receipt_url" target="_blank" class="proof-btn">Lihat Bukti</a></div>
        </div>
        <div class="m-card-footer"><router-link :to="`/admin/orders/${order.id}`" class="action-btn detail-btn full-btn">Buka Detail</router-link></div>
      </article>
    </div>
  </div>
</template>

<script>
import AdminOrdersScript from './AdminOrdersView.js';
export default { ...AdminOrdersScript };
</script>
