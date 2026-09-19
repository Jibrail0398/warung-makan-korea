<template>
  <div class="order-detail-page-wrap">
    <AppHeader variant="default" />
    <main class="order-detail-page"><div class="container">
      <router-link :to="'/'" class="back-link"><span aria-hidden="true">←</span> Belanja Kembali</router-link>
      <section v-if="isLoading" class="state-panel">
        <LoadingSpinner size="md" color="primary" text="Memuat detail pesanan..." center />
      </section>
      <section v-else-if="loadError" class="state-panel state-error" role="alert">{{ loadError }}</section>
      <template v-else>
        <header class="page-heading"><div><h1>Pesanan #{{ order.id }}</h1><p class="created-at">{{ formatDateTime(order.created_at) }}</p></div><span class="status-badge" :class="`status-${paymentStatus}`">{{ paymentStatusLabel }}</span></header>
        <section class="summary-strip" aria-label="Ringkasan pesanan"><div><span>Pelanggan</span><strong>{{ order.customer_name || 'Tidak dicantumkan' }}</strong></div><div><span>Nomor telepon</span><strong>{{ order.customer_phone || 'Tidak dicantumkan' }}</strong></div></section>
        <section class="content-grid">
          <article class="order-panel items-panel"><div class="panel-heading"><div><h2>{{ items.length }} produk</h2></div><span class="item-count">{{ totalQuantity }} item</span></div><div v-if="items.length" class="items-list"><div v-for="item in items" :key="item.id" class="item-row"><div><h3>{{ item.product?.name || 'Produk' }}</h3><p>{{ formatPrice(item.price) }} × {{ item.quantity }}</p></div><strong>{{ formatPrice(item.sub_total || item.price * item.quantity) }}</strong></div></div><p v-else class="muted-copy">Belum ada item pada pesanan ini.</p><div class="total-row"><span>Total harga</span><strong>{{ formatPrice(order.total_price) }}</strong></div></article>
          <aside class="order-panel status-panel"><div class="status-mark" :class="`status-${paymentStatus}`" aria-hidden="true">{{ paymentStatus === 'paid' ? '✓' : paymentStatus === 'unpaid' ? '!' : '…' }}</div><h2>{{ paymentStatusLabel }}</h2><p>{{ paymentStatusDescription }}</p></aside>
        </section>
        <section class="receipt-panel"><div><h2>Download Struk</h2></div><button type="button" class="download-button" :disabled="!isPaid" @click="handleDownloadReceipt"><span aria-hidden="true">↓</span> Download struk</button></section>
      </template>
    </div></main>
    <AppFooter />
    <ToastNotification :visible="isToastVisible" :message="toastMessage" />
  </div>
</template>

<script>
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner.vue';
import OrderHistoryDetailScript from './OrderHistoryDetailView.js';

export default {
  ...OrderHistoryDetailScript,
  components: {
    LoadingSpinner,
    ...OrderHistoryDetailScript.components
  }
};
</script>
