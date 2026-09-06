<template>
  <div class="order-detail-page-wrap">
    <AppHeader variant="default" />

    <main class="order-detail-page">
      <div class="container">
        <!-- Back Navigation & Breadcrumb -->
        <div class="nav-back-row">
          <router-link to="/order-history" class="back-link">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 12H5m6-6-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Back to Order History
          </router-link>
        </div>

        <!-- Page heading -->
        <section class="order-heading">
          <span class="eyebrow">Order detail &amp; tracking</span>
          <div class="heading-row">
            <div>
              <h1>Order #{{ order.id || order.orderId || orderId }}</h1>
              <p>Detailed breakdown and current status of your order.</p>
            </div>
            <span class="order-status-badge" :class="statusClass">
              {{ order.status || 'Payment Verification' }}
            </span>
          </div>
        </section>

        <!-- Current status card -->
        <section class="status-card" :class="statusClass">
          <div class="status-copy">
            <span class="status-label">
              {{ order.status || 'Payment Verification' }}
            </span>
            <h2>{{ order.statusMessage || 'Menunggu Verifikasi Pembayaran' }}</h2>
            <p>{{ order.statusDescription || 'Bukti transfer sedang diperiksa kasir.' }}</p>
          </div>
          <div class="status-icon">
            <!-- Icon based on status -->
            <svg v-if="isCompleted" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg v-else-if="isCancelled" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8" />
            </svg>
          </div>
        </section>

        <!-- Progress tracking -->
        <OrderTrackingProgress :status="order.status" />

        <!-- Order information layout -->
        <section class="order-layout">
          <OrderDetailCard :order="order" />
          <OrderPaymentCard :order="order" :items="order.items || []" />
        </section>

        <!-- Payment proof & receipt section + Modal -->
        <PaymentProofModal
          :order="order"
          @download="handleDownloadReceipt"
          @print="handlePrintReceipt"
        />

        <!-- Bottom Page Actions -->
        <div class="bottom-actions">
          <router-link to="/order-history" class="btn-secondary">
            View All Orders
          </router-link>
          <router-link to="/menu" class="btn-primary">
            Order Again / Browse Menu
          </router-link>
        </div>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from '../components/layout/AppHeader.vue';
import AppFooter from '../components/layout/AppFooter.vue';
import OrderTrackingProgress from '../components/orders/OrderTrackingProgress.vue';
import OrderDetailCard from '../components/orders/OrderDetailCard.vue';
import OrderPaymentCard from '../components/orders/OrderPaymentCard.vue';
import PaymentProofModal from '../components/orders/PaymentProofModal.vue';
import ToastNotification from '../components/common/ToastNotification.vue';
import { orderService } from '../services/orderService.js';
import { useToast } from '../composables/useToast.js';

const route = useRoute();
const { isToastVisible, toastMessage, showToast } = useToast();

const order = ref({});
const isLoading = ref(true);

const orderId = computed(() => route.params.id || 'ORD-001');

const statusClass = computed(() => {
  const s = (order.value.status || '').toLowerCase().replace(/\s+/g, '-');
  return `status-${s}`;
});

const isCompleted = computed(() => {
  const s = (order.value.status || '').toLowerCase();
  return s.includes('completed') || s.includes('selesai');
});

const isCancelled = computed(() => {
  const s = (order.value.status || '').toLowerCase();
  return s.includes('cancelled') || s.includes('batal');
});

async function loadOrder() {
  isLoading.value = true;
  try {
    order.value = await orderService.getOrderById(orderId.value);
  } finally {
    isLoading.value = false;
  }
}

function handleDownloadReceipt() {
  showToast(`Receipt for order #${order.value.id || orderId.value} downloaded`);
}

function handlePrintReceipt() {
  window.print();
}

onMounted(() => {
  loadOrder();
});

watch(() => route.params.id, () => {
  loadOrder();
});
</script>

<style scoped>
.order-detail-page-wrap {
  min-height: 100vh;
  background: var(--paper);
  color: var(--ink);
}

.order-detail-page {
  padding: 36px 0 80px;
}

.nav-back-row {
  margin-bottom: 22px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 0.86rem;
  font-weight: 700;
  transition: color var(--ease), gap var(--ease);
}

.back-link:hover {
  color: var(--red);
  gap: 11px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
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
  letter-spacing: -.04em;
  line-height: 1.1;
}

.heading-row p {
  color: var(--muted);
  font-size: 0.95rem;
  margin-top: 4px;
}

.order-status-badge {
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--soft);
  color: var(--ink);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.order-status-badge.status-completed {
  background: #edf7f0;
  color: #287a45;
}

.order-status-badge.status-cancelled {
  background: #fdf0f0;
  color: #a33a3a;
}

.order-status-badge.status-in-progress,
.order-status-badge.status-processing {
  background: #edf4fb;
  color: #365f91;
}

.order-status-badge.status-payment-verification,
.order-status-badge.status-waiting-payment {
  background: #fdf8eb;
  color: #9a7018;
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

.status-card.status-completed {
  border-color: #c7e6d0;
  background: #f4faf6;
}

.status-card.status-cancelled {
  border-color: #f7d4d4;
  background: #fdf6f6;
}

.status-card.status-in-progress,
.status-card.status-processing {
  border-color: #cfdff2;
  background: #f4f8fd;
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

.status-card.status-completed .status-label {
  color: #287a45;
}

.status-card.status-cancelled .status-label {
  color: #a33a3a;
}

.status-card.status-in-progress .status-label,
.status-card.status-processing .status-label {
  color: #365f91;
}

.status-copy h2 {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.35rem;
  font-weight: 500;
  letter-spacing: -.02em;
}

.status-copy p {
  color: var(--muted);
  font-size: 0.86rem;
  margin-top: 2px;
}

.status-icon {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 50%;
  background: #fff;
  color: var(--red);
  box-shadow: 0 4px 14px rgba(0, 0, 0, .06);
}

.status-card.status-completed .status-icon {
  color: #287a45;
}

.status-card.status-cancelled .status-icon {
  color: #a33a3a;
}

.status-card.status-in-progress .status-icon,
.status-card.status-processing .status-icon {
  color: #365f91;
}

.order-layout {
  display: grid;
  grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr);
  gap: 22px;
  align-items: stretch;
}

.bottom-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 36px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}

.btn-primary {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
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
  min-height: 48px;
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
  .order-layout {
    grid-template-columns: 1fr;
  }

  .heading-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

@media (max-width: 640px) {
  .order-detail-page {
    padding: 24px 0 60px;
  }

  .status-card {
    padding: 20px;
  }

  .bottom-actions {
    flex-direction: column;
  }

  .bottom-actions .btn-primary,
  .bottom-actions .btn-secondary {
    width: 100%;
  }
}
</style>
