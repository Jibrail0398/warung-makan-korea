<template>
  <div class="orders-page-wrap">
    <AppHeader variant="default" />

    <main class="order-page">
      <div class="container">
        <!-- Page heading -->
        <section class="order-heading">
          <span class="eyebrow">Order tracking</span>
          <div class="heading-row">
            <div>
              <h1>Order #{{ order.orderId || 'ORD-001' }}</h1>
              <p>Track your order and payment status.</p>
            </div>
            <span class="order-status-badge">
              {{ order.status || 'Payment Verification' }}
            </span>
          </div>
        </section>

        <!-- Current status card -->
        <section class="status-card">
          <div class="status-copy">
            <span class="status-label">
              {{ order.status || 'Payment Verification' }}
            </span>
            <h2>{{ order.statusMessage || 'Menunggu Verifikasi Pembayaran' }}</h2>
            <p>{{ order.statusDescription || 'Bukti transfer sedang diperiksa kasir.' }}</p>
          </div>
          <div class="status-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8" />
            </svg>
          </div>
        </section>

        <!-- Progress tracking -->
        <OrderTrackingProgress />

        <!-- Order information layout -->
        <section class="order-layout">
          <OrderDetailCard :order="order" />
          <OrderPaymentCard :order="order" :items="order.items || []" />
        </section>

        <!-- Payment proof & receipt section + Modal -->
        <PaymentProofModal
          @download="handleDownloadReceipt"
          @print="handlePrintReceipt"
        />
      </div>
    </main>

    <AppFooter />

    <ToastNotification
      :visible="isToastVisible"
      :message="toastMessage"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppHeader from '../components/layout/AppHeader.vue';
import AppFooter from '../components/layout/AppFooter.vue';
import OrderTrackingProgress from '../components/orders/OrderTrackingProgress.vue';
import OrderDetailCard from '../components/orders/OrderDetailCard.vue';
import OrderPaymentCard from '../components/orders/OrderPaymentCard.vue';
import PaymentProofModal from '../components/orders/PaymentProofModal.vue';
import ToastNotification from '../components/common/ToastNotification.vue';
import { useOrderStore } from '../stores/order.js';
import { useToast } from '../composables/useToast.js';

const orderStore = useOrderStore();
const { isToastVisible, toastMessage, showToast } = useToast();

const order = ref({});

function handleDownloadReceipt() {
  showToast('Receipt download started');
}

function handlePrintReceipt() {
  window.print();
}

onMounted(async () => {
  await orderStore.fetchActiveOrder();
  if (orderStore.currentOrder) {
    order.value = orderStore.currentOrder;
  }
});
</script>

<style scoped>
.order-page {
  padding: 48px 0 80px;
  background: var(--paper);
}

.eyebrow {
  display: block;
  color: var(--red);
  font-size: .7rem;
  font-weight: 800;
  letter-spacing: .15em;
  text-transform: uppercase;
}

.order-heading {
  margin-bottom: 28px;
}

.heading-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 4px;
}

.heading-row h1 {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 500;
}

.heading-row p {
  color: var(--muted);
  font-size: 0.95rem;
}

.order-status-badge {
  padding: 8px 14px;
  border-radius: 999px;
  background: var(--red-soft);
  color: var(--red);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.status-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: var(--soft);
  margin-bottom: 32px;
}

.status-label {
  display: block;
  margin-bottom: 4px;
  color: var(--red);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.status-copy h2 {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.35rem;
  font-weight: 500;
}

.status-copy p {
  color: var(--muted);
  font-size: 0.86rem;
}

.status-icon {
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border-radius: 50%;
  background: #fff;
  color: var(--red);
  box-shadow: 0 4px 14px rgba(0, 0, 0, .06);
}

.order-layout {
  display: grid;
  grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr);
  gap: 22px;
  align-items: stretch;
}

@media (max-width: 860px) {
  .order-layout {
    grid-template-columns: 1fr;
  }
}
</style>
