<template>
  <div class="orders-page-wrap">
    <AppHeader variant="default" />
    <main class="order-page"><div class="container">
      <section class="order-heading"><span class="eyebrow">Order tracking</span><div class="heading-row"><div><h1>Order #{{ order.orderId || 'ORD-001' }}</h1><p>Track your order and payment status.</p></div><span class="order-status-badge">{{ order.status || 'Payment Verification' }}</span></div></section>
      <section class="status-card"><div class="status-copy"><span class="status-label">{{ order.status || 'Payment Verification' }}</span><h2>{{ order.statusMessage || 'Menunggu Verifikasi Pembayaran' }}</h2><p>{{ order.statusDescription || 'Bukti transfer sedang diperiksa kasir.' }}</p></div><div class="status-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8" /></svg></div></section>
      <OrderTrackingProgress />
      <section class="order-layout"><OrderDetailCard :order="order" /><OrderPaymentCard :order="order" :items="order.items || []" /></section>
      <PaymentProofModal @download="handleDownloadReceipt" @print="handlePrintReceipt" />
    </div></main>
    <AppFooter />
    <ToastNotification :visible="isToastVisible" :message="toastMessage" />
  </div>
</template>

<script>
import OrdersViewScript from './OrdersView.js';
export default { ...OrdersViewScript };
</script>
