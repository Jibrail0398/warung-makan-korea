<template>
  <div class="order-detail-page">
    <div class="detail-top-nav">
      <router-link to="/admin/orders" class="back-link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
        <span>Kembali ke Monitoring Pesanan</span>
      </router-link>
      <div class="top-actions">
        <button type="button" class="btn-print-receipt" @click="isPrintOpen = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><polyline points="6 9 6 2 18 2 18 9" stroke="currentColor" stroke-width="1.8" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" stroke-width="1.8" /><rect x="6" y="14" width="12" height="8" stroke="currentColor" stroke-width="1.8" /></svg>
          <span>Cetak Struk Pesanan</span>
        </button>
      </div>
    </div>
    <div v-if="order" class="order-detail-grid">
      <div class="detail-main-col">
        <section class="card order-main-card">
          <div class="card-header">
            <div>
              <span class="order-date-time">{{ order.date }} • {{ order.time || '12:30' }}</span>
              <h1 class="order-title">Pesanan {{ order.orderNumber || order.id }}</h1>
            </div>
            <StatusBadge :status="order.status" />
          </div>
          <div class="status-progress-box">
            <h3 class="progress-title">Progres Status Pesanan</h3>
            <div class="status-steps">
              <div v-for="(step, idx) in statusSteps" :key="step.key" class="step-item" :class="{ 'step-done': currentStepIndex > idx, 'step-current': currentStepIndex === idx, 'step-cancelled': isCancelled }">
                <div class="step-circle">
                  <span v-if="isCancelled && currentStepIndex === idx">✕</span>
                  <span v-else-if="currentStepIndex > idx">✓</span>
                  <span v-else>{{ idx + 1 }}</span>
                </div>
                <span class="step-label">{{ step.label }}</span>
              </div>
            </div>
          </div>
          <div class="status-actions-panel">
            <span class="action-label">Ubah Status Cepat:</span>
            <div class="action-btns-group">
              <button v-if="order.status === 'Payment Verification'" type="button" class="btn-flow btn-process" @click="changeStatus('Processing')">Verifikasi Pembayaran & Masak</button>
              <button v-if="order.status === 'Processing'" type="button" class="btn-flow btn-ready" @click="changeStatus('Ready')">Tandai Pesanan Siap</button>
              <button v-if="order.status === 'Ready'" type="button" class="btn-flow btn-complete" @click="changeStatus('Completed')">Selesaikan Pesanan</button>
              <button v-if="!['Completed', 'Cancelled'].includes(order.status)" type="button" class="btn-flow btn-cancel-order" @click="changeStatus('Cancelled')">Batalkan Pesanan</button>
            </div>
          </div>
        </section>
        <section class="card items-card">
          <h2 class="card-section-title">Daftar Item Pesanan ({{ order.items?.length || 0 }})</h2>
          <div class="items-list">
            <div v-for="item in order.items" :key="item.id || item.name" class="order-item-row">
              <div class="item-meta">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-type-tag">{{ item.category === 'raw' ? 'Raw Material' : 'Menu Restoran' }}</span>
                <small class="item-price-unit">@ ₩{{ (item.price || 0).toLocaleString('ko-KR') }}</small>
              </div>
              <div class="item-qty"><span>{{ item.quantity }}x</span></div>
              <div class="item-subtotal"><strong>₩{{ ((item.subtotal || (item.price * item.quantity)) || 0).toLocaleString('ko-KR') }}</strong></div>
            </div>
          </div>
          <div class="order-pricing-summary">
            <div class="pricing-row"><span>Subtotal Produk</span><span>₩{{ (order.subtotal || order.total || 0).toLocaleString('ko-KR') }}</span></div>
            <div class="pricing-row"><span>Pajak & Layanan</span><span>₩0</span></div>
            <div class="pricing-row grand-total-row"><strong>Total Pembayaran</strong><strong class="grand-total-val">₩{{ (order.total || 0).toLocaleString('ko-KR') }}</strong></div>
          </div>
        </section>
      </div>
      <div class="detail-sidebar-col">
        <section class="card customer-card">
          <h2 class="card-section-title">Informasi Pelanggan</h2>
          <div class="customer-info-list">
            <div class="info-item"><span class="info-label">Nama Pelanggan:</span><strong>{{ order.customer?.name || 'Customer' }}</strong></div>
            <div class="info-item"><span class="info-label">Nomor HP (Korea):</span><a :href="`tel:${order.customer?.phone}`" class="phone-link">{{ order.customer?.phone }}</a></div>
            <div class="info-item"><span class="info-label">Tipe Layanan:</span><span class="type-badge">{{ order.orderType || 'Dine In' }} {{ order.tableNumber ? `(${order.tableNumber})` : '' }}</span></div>
            <div v-if="order.address" class="info-item"><span class="info-label">Alamat Pengiriman:</span><span>{{ order.address }}</span></div>
            <div v-if="order.note" class="info-item note-item"><span class="info-label">Catatan Pesanan:</span><p class="customer-note">{{ order.note }}</p></div>
          </div>
        </section>
        <section class="card payment-card">
          <div class="payment-header">
            <h2 class="card-section-title">Bukti Transfer</h2>
            <span class="payment-tag" :class="`pay-${(order.paymentStatus || '').toLowerCase().replace(/\s+/g, '-')}`">{{ order.paymentStatus || 'Waiting Verification' }}</span>
          </div>
          <div class="payment-meta-info">
            <div class="meta-line"><span>Metode:</span><strong>{{ order.paymentMethod || 'Bank Transfer' }}</strong></div>
            <div class="meta-line"><span>Total Tagihan:</span><strong>₩{{ (order.total || 0).toLocaleString('ko-KR') }}</strong></div>
          </div>
          <div class="proof-container">
            <div v-if="order.paymentProof" class="proof-wrapper">
              <img :src="order.paymentProof" alt="Bukti Transfer" class="proof-thumbnail" />
              <button type="button" class="zoom-proof-btn" @click="isProofViewerOpen = true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.8" /><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="1.8" /><line x1="11" y1="8" x2="11" y2="14" stroke="currentColor" stroke-width="1.8" /><line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" stroke-width="1.8" /></svg>
                <span>Lihat Ukuran Penuh</span>
              </button>
            </div>
            <div v-else class="no-proof-box"><p>Customer belum mengunggah bukti pembayaran.</p></div>
          </div>
          <div v-if="order.paymentProof && order.paymentStatus !== 'Verified'" class="proof-decision-btns">
            <button type="button" class="btn-approve-proof" @click="handleVerifyProof(true)">Konfirmasi & Terima Bayar</button>
            <button type="button" class="btn-reject-proof" @click="handleVerifyProof(false)">Tolak Bukti</button>
          </div>
        </section>
      </div>
    </div>
    <PrintableReceipt :isOpen="isPrintOpen" :order="order" @close="isPrintOpen = false" />
    <PaymentProofViewer :isOpen="isProofViewerOpen" :order="order" @close="isProofViewerOpen = false" @approve="handleVerifyProof(true)" @reject="handleVerifyProof(false)" />
  </div>
</template>

<script>
import AdminOrderDetailScript from './AdminOrderDetailView.js';
export default { ...AdminOrderDetailScript };
</script>
