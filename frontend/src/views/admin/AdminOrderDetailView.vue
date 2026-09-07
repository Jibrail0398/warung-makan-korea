<template>
  <div class="order-detail-page">
    <!-- Top Bar Navigation -->
    <div class="detail-top-nav">
      <router-link to="/admin/orders" class="back-link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>Kembali ke Monitoring Pesanan</span>
      </router-link>

      <div class="top-actions">
        <button type="button" class="btn-print-receipt" @click="isPrintOpen = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <polyline points="6 9 6 2 18 2 18 9" stroke="currentColor" stroke-width="1.8" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" stroke-width="1.8" />
            <rect x="6" y="14" width="12" height="8" stroke="currentColor" stroke-width="1.8" />
          </svg>
          <span>Cetak Struk Pesanan</span>
        </button>
      </div>
    </div>

    <div v-if="order" class="order-detail-grid">
      <!-- Left Column: Order Information, Items & Status Progress -->
      <div class="detail-main-col">
        <section class="card order-main-card">
          <div class="card-header">
            <div>
              <span class="order-date-time">{{ order.date }} • {{ order.time || '12:30' }}</span>
              <h1 class="order-title">Pesanan {{ order.orderNumber || order.id }}</h1>
            </div>
            <StatusBadge :status="order.status" />
          </div>

          <!-- Status Progression Flow -->
          <div class="status-progress-box">
            <h3 class="progress-title">Progres Status Pesanan</h3>
            <div class="status-steps">
              <div
                v-for="(step, idx) in statusSteps"
                :key="step.key"
                class="step-item"
                :class="{
                  'step-done': currentStepIndex > idx,
                  'step-current': currentStepIndex === idx,
                  'step-cancelled': isCancelled
                }"
              >
                <div class="step-circle">
                  <span v-if="isCancelled && currentStepIndex === idx">✕</span>
                  <span v-else-if="currentStepIndex > idx">✓</span>
                  <span v-else>{{ idx + 1 }}</span>
                </div>
                <span class="step-label">{{ step.label }}</span>
              </div>
            </div>
          </div>

          <!-- Order Status Action Controls -->
          <div class="status-actions-panel">
            <span class="action-label">Ubah Status Cepat:</span>
            <div class="action-btns-group">
              <button
                v-if="order.status === 'Payment Verification'"
                type="button"
                class="btn-flow btn-process"
                @click="changeStatus('Processing')"
              >
                Verifikasi Pembayaran & Masak
              </button>

              <button
                v-if="order.status === 'Processing'"
                type="button"
                class="btn-flow btn-ready"
                @click="changeStatus('Ready')"
              >
                Tandai Pesanan Siap
              </button>

              <button
                v-if="order.status === 'Ready'"
                type="button"
                class="btn-flow btn-complete"
                @click="changeStatus('Completed')"
              >
                Selesaikan Pesanan
              </button>

              <button
                v-if="!['Completed', 'Cancelled'].includes(order.status)"
                type="button"
                class="btn-flow btn-cancel-order"
                @click="changeStatus('Cancelled')"
              >
                Batalkan Pesanan
              </button>
            </div>
          </div>
        </section>

        <!-- Itemized List Card -->
        <section class="card items-card">
          <h2 class="card-section-title">Daftar Item Pesanan ({{ order.items?.length || 0 }})</h2>

          <div class="items-list">
            <div
              v-for="item in order.items"
              :key="item.id || item.name"
              class="order-item-row"
            >
              <div class="item-meta">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-type-tag">{{ item.category === 'raw' ? 'Raw Material' : 'Menu Restoran' }}</span>
                <small class="item-price-unit">@ ₩{{ (item.price || 0).toLocaleString('ko-KR') }}</small>
              </div>

              <div class="item-qty">
                <span>{{ item.quantity }}x</span>
              </div>

              <div class="item-subtotal">
                <strong>₩{{ ((item.subtotal || (item.price * item.quantity)) || 0).toLocaleString('ko-KR') }}</strong>
              </div>
            </div>
          </div>

          <!-- Total Calculation Breakdown -->
          <div class="order-pricing-summary">
            <div class="pricing-row">
              <span>Subtotal Produk</span>
              <span>₩{{ (order.subtotal || order.total || 0).toLocaleString('ko-KR') }}</span>
            </div>
            <div class="pricing-row">
              <span>Pajak & Layanan</span>
              <span>₩0</span>
            </div>
            <div class="pricing-row grand-total-row">
              <strong>Total Pembayaran</strong>
              <strong class="grand-total-val">₩{{ (order.total || 0).toLocaleString('ko-KR') }}</strong>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column: Customer Details & Payment Proof Verification -->
      <div class="detail-sidebar-col">
        <!-- Customer Info Card -->
        <section class="card customer-card">
          <h2 class="card-section-title">Informasi Pelanggan</h2>

          <div class="customer-info-list">
            <div class="info-item">
              <span class="info-label">Nama Pelanggan:</span>
              <strong>{{ order.customer?.name || 'Customer' }}</strong>
            </div>
            <div class="info-item">
              <span class="info-label">Nomor HP (Korea):</span>
              <a :href="`tel:${order.customer?.phone}`" class="phone-link">{{ order.customer?.phone }}</a>
            </div>
            <div class="info-item">
              <span class="info-label">Tipe Layanan:</span>
              <span class="type-badge">{{ order.orderType || 'Dine In' }} {{ order.tableNumber ? `(${order.tableNumber})` : '' }}</span>
            </div>
            <div v-if="order.address" class="info-item">
              <span class="info-label">Alamat Pengiriman:</span>
              <span>{{ order.address }}</span>
            </div>
            <div v-if="order.note" class="info-item note-item">
              <span class="info-label">Catatan Pesanan:</span>
              <p class="customer-note">{{ order.note }}</p>
            </div>
          </div>
        </section>

        <!-- Payment Info & Transfer Proof Card -->
        <section class="card payment-card">
          <div class="payment-header">
            <h2 class="card-section-title">Bukti Transfer</h2>
            <span class="payment-tag" :class="`pay-${(order.paymentStatus || '').toLowerCase().replace(/\s+/g, '-')}`">
              {{ order.paymentStatus || 'Waiting Verification' }}
            </span>
          </div>

          <div class="payment-meta-info">
            <div class="meta-line">
              <span>Metode:</span>
              <strong>{{ order.paymentMethod || 'Bank Transfer' }}</strong>
            </div>
            <div class="meta-line">
              <span>Total Tagihan:</span>
              <strong>₩{{ (order.total || 0).toLocaleString('ko-KR') }}</strong>
            </div>
          </div>

          <!-- Proof Preview -->
          <div class="proof-container">
            <div v-if="order.paymentProof" class="proof-wrapper">
              <img :src="order.paymentProof" alt="Bukti Transfer" class="proof-thumbnail" />
              <button type="button" class="zoom-proof-btn" @click="isProofViewerOpen = true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="1.8" />
                  <line x1="11" y1="8" x2="11" y2="14" stroke="currentColor" stroke-width="1.8" />
                  <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" stroke-width="1.8" />
                </svg>
                <span>Lihat Ukuran Penuh</span>
              </button>
            </div>
            <div v-else class="no-proof-box">
              <p>Customer belum mengunggah bukti pembayaran.</p>
            </div>
          </div>

          <!-- Verification Trigger Buttons -->
          <div v-if="order.paymentProof && order.paymentStatus !== 'Verified'" class="proof-decision-btns">
            <button type="button" class="btn-approve-proof" @click="handleVerifyProof(true)">
              Konfirmasi & Terima Bayar
            </button>
            <button type="button" class="btn-reject-proof" @click="handleVerifyProof(false)">
              Tolak Bukti
            </button>
          </div>
        </section>
      </div>
    </div>

    <!-- Printable Receipt Modal -->
    <PrintableReceipt
      :isOpen="isPrintOpen"
      :order="order"
      @close="isPrintOpen = false"
    />

    <!-- Payment Proof Viewer Lightbox -->
    <PaymentProofViewer
      :isOpen="isProofViewerOpen"
      :order="order"
      @close="isProofViewerOpen = false"
      @approve="handleVerifyProof(true)"
      @reject="handleVerifyProof(false)"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { adminService } from '../../services/adminService.js';
import StatusBadge from '../../components/admin/StatusBadge.vue';
import PrintableReceipt from '../../components/admin/PrintableReceipt.vue';
import PaymentProofViewer from '../../components/admin/PaymentProofViewer.vue';

const route = useRoute();
const order = ref(null);
const isPrintOpen = ref(false);
const isProofViewerOpen = ref(false);

const statusSteps = [
  { key: 'verification', label: 'Verifikasi' },
  { key: 'processing', label: 'Diproses' },
  { key: 'ready', label: 'Siap' },
  { key: 'completed', label: 'Selesai' }
];

const loadOrder = async () => {
  const id = route.params.id;
  const res = await adminService.getOrderById(id);
  order.value = res || {
    id: id || 'WN-10230',
    orderNumber: `#${id || 'WN-10230'}`,
    date: '2026-08-27',
    time: '17:35',
    customer: { name: 'Andi Pratama', phone: '+82 10 9988 7766' },
    orderType: 'Takeaway',
    note: 'Bungkus rapi, pisahkan kuah.',
    status: 'Payment Verification',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Waiting Verification',
    paymentProof: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=900',
    items: [{ id: 2, name: 'Rendang', price: 15000, quantity: 1, subtotal: 15000, category: 'restaurant' }],
    total: 15000
  };
};

onMounted(() => {
  loadOrder();
});

const isCancelled = computed(() => {
  return (order.value?.status || '').toLowerCase() === 'cancelled';
});

const currentStepIndex = computed(() => {
  const s = (order.value?.status || '').toLowerCase();
  if (s === 'completed' || s === 'selesai') return 3;
  if (s === 'ready' || s === 'siap') return 2;
  if (s === 'processing' || s === 'diproses' || s === 'in progress') return 1;
  return 0; // Payment verification
});

const changeStatus = async (newStatus) => {
  if (!order.value) return;
  const updated = await adminService.updateOrderStatus(order.value.id, newStatus);
  order.value = updated;
};

const handleVerifyProof = async (isApproved) => {
  if (!order.value) return;
  const updated = await adminService.verifyPaymentProof(order.value.id, isApproved);
  order.value = updated;
  isProofViewerOpen.value = false;
};
</script>

<style scoped>
.order-detail-page {
  width: 100%;
}

.detail-top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 0.84rem;
  font-weight: 700;
  text-decoration: none;
  transition: color var(--ease);
}

.back-link:hover {
  color: var(--red);
}

.btn-print-receipt {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border-radius: var(--r-sm);
  border: 1px solid var(--line);
  background: #ffffff;
  color: var(--ink);
  font-size: 0.82rem;
  font-weight: 750;
  cursor: pointer;
  transition: all var(--ease);
}

.btn-print-receipt:hover {
  border-color: var(--red);
  color: var(--red);
}

.order-detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(320px, 1fr);
  gap: 24px;
  align-items: start;
}

.card {
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(36, 25, 18, 0.04);
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.order-date-time {
  font-size: 0.76rem;
  color: var(--muted);
  font-weight: 600;
}

.order-title {
  margin: 4px 0 0;
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.6rem;
  font-weight: 600;
}

.card-section-title {
  margin: 0 0 16px;
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.15rem;
  font-weight: 600;
}

.status-progress-box {
  padding: 16px;
  border-radius: var(--r-sm);
  background: var(--soft);
  border: 1px solid var(--line);
  margin-bottom: 20px;
}

.progress-title {
  margin: 0 0 14px;
  font-size: 0.76rem;
  font-weight: 800;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.status-steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.step-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid var(--line);
  background: #fff;
  color: var(--muted);
  display: grid;
  place-items: center;
  font-size: 0.72rem;
  font-weight: 800;
}

.step-done .step-circle {
  border-color: var(--red);
  background: var(--red);
  color: #fff;
}

.step-current .step-circle {
  border-color: var(--red);
  color: var(--red);
  box-shadow: 0 0 0 3px var(--red-soft);
}

.step-cancelled .step-circle {
  border-color: #dc2626;
  background: #dc2626;
  color: #fff;
}

.step-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--muted);
}

.step-done .step-label, .step-current .step-label {
  color: var(--ink);
}

.status-actions-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
  flex-wrap: wrap;
}

.action-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--muted);
}

.action-btns-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-flow {
  padding: 8px 16px;
  border-radius: var(--r-sm);
  font-size: 0.8rem;
  font-weight: 750;
  cursor: pointer;
  transition: all var(--ease);
}

.btn-process {
  background: var(--red);
  color: #fff;
  border: none;
}

.btn-process:hover {
  background: var(--red-dark);
}

.btn-ready {
  background: #f59e0b;
  color: #fff;
  border: none;
}

.btn-ready:hover {
  background: #d97706;
}

.btn-complete {
  background: var(--success);
  color: #fff;
  border: none;
}

.btn-complete:hover {
  background: #1b5336;
}

.btn-cancel-order {
  background: transparent;
  color: var(--color-danger, #dc2626);
  border: 1px solid #fca5a5;
}

.btn-cancel-order:hover {
  background: #fef2f2;
}

.items-list {
  border-bottom: 1px solid var(--line);
  margin-bottom: 16px;
}

.order-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
}

.order-item-row:last-child {
  border-bottom: none;
}

.item-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.item-name {
  font-size: 0.9rem;
  font-weight: 750;
  color: var(--ink);
}

.item-type-tag {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 750;
  color: var(--red);
  text-transform: uppercase;
}

.item-price-unit {
  font-size: 0.76rem;
  color: var(--muted);
}

.item-qty {
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--muted);
}

.item-subtotal {
  font-size: 0.92rem;
  color: var(--ink);
}

.order-pricing-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.84rem;
}

.pricing-row {
  display: flex;
  justify-content: space-between;
  color: var(--muted);
}

.grand-total-row {
  padding-top: 10px;
  border-top: 1px solid var(--line);
  color: var(--ink);
}

.grand-total-val {
  font-size: 1.15rem;
  color: var(--red);
}

.customer-info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 0.84rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 0.72rem;
  color: var(--muted);
  font-weight: 600;
}

.phone-link {
  color: var(--red);
  font-weight: 750;
  text-decoration: none;
}

.type-badge {
  display: inline-flex;
  width: fit-content;
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--soft);
  font-weight: 700;
  color: var(--ink);
}

.note-item {
  padding: 10px 12px;
  background: #fef9f6;
  border-left: 3px solid var(--red);
  border-radius: 0 var(--r-sm) var(--r-sm) 0;
}

.customer-note {
  margin: 4px 0 0;
  font-size: 0.8rem;
  color: var(--ink);
}

.payment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.payment-header .card-section-title {
  margin-bottom: 0;
}

.payment-tag {
  font-size: 0.72rem;
  font-weight: 750;
  padding: 2px 8px;
  border-radius: 4px;
}

.payment-tag.pay-verified {
  background: #edf7ee;
  color: var(--success);
}

.payment-tag.pay-waiting-verification {
  background: #fef3c7;
  color: #92400e;
}

.payment-meta-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--line);
  font-size: 0.82rem;
}

.meta-line {
  display: flex;
  justify-content: space-between;
}

.proof-container {
  width: 100%;
  border-radius: var(--r-sm);
  border: 1px solid var(--line);
  overflow: hidden;
  background: var(--soft);
}

.proof-wrapper {
  position: relative;
  width: 100%;
  height: 180px;
}

.proof-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.zoom-proof-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  border-radius: 4px;
  background: rgba(25, 21, 18, 0.85);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  backdrop-filter: blur(2px);
}

.no-proof-box {
  padding: 30px 16px;
  text-align: center;
  color: var(--muted);
  font-size: 0.8rem;
}

.proof-decision-btns {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 14px;
}

.btn-approve-proof {
  padding: 9px 14px;
  border-radius: var(--r-sm);
  background: var(--success);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 750;
  cursor: pointer;
}

.btn-reject-proof {
  padding: 8px 14px;
  border-radius: var(--r-sm);
  background: #fef2f2;
  border: 1px solid #fca5a5;
  color: #dc2626;
  font-size: 0.8rem;
  font-weight: 750;
  cursor: pointer;
}

@media (max-width: 960px) {
  .order-detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
