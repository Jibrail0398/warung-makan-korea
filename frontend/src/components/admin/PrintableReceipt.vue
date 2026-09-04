<template>
  <div v-if="isOpen" class="print-modal-backdrop" @click.self="$emit('close')">
    <div class="print-dialog" role="dialog" aria-modal="true" aria-labelledby="printTitle">
      <div class="dialog-header no-print">
        <h3 id="printTitle">Pratinjau Struk Pesanan</h3>
        <div class="header-actions">
          <button type="button" class="btn-print" @click="handlePrint">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <polyline points="6 9 6 2 18 2 18 9" stroke="currentColor" stroke-width="1.8" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" stroke-width="1.8" />
              <rect x="6" y="14" width="12" height="8" stroke="currentColor" stroke-width="1.8" />
            </svg>
            <span>Cetak (Print)</span>
          </button>
          <button type="button" class="btn-close" @click="$emit('close')">✕</button>
        </div>
      </div>

      <!-- Thermal Printable Receipt Area -->
      <div id="receipt-print-area" class="thermal-receipt">
        <div class="receipt-header">
          <div class="receipt-stars">================================</div>
          <h1 class="restaurant-name">WARUNG NUSANTARA</h1>
          <p class="restaurant-subtitle">Authentic Indonesian Cuisine in Korea</p>
          <div class="receipt-stars">================================</div>
        </div>

        <div class="receipt-meta">
          <div class="meta-row">
            <span>Order ID:</span>
            <strong>{{ order?.orderNumber || order?.id }}</strong>
          </div>
          <div class="meta-row">
            <span>Tanggal:</span>
            <span>{{ order?.date }} {{ order?.time }}</span>
          </div>
          <div class="meta-row">
            <span>Tipe:</span>
            <span>{{ order?.orderType || 'Dine In' }} {{ order?.tableNumber ? `(${order.tableNumber})` : '' }}</span>
          </div>
        </div>

        <div class="receipt-customer">
          <div class="receipt-divider">--------------------------------</div>
          <div class="meta-row">
            <span>Customer:</span>
            <strong>{{ order?.customer?.name }}</strong>
          </div>
          <div class="meta-row">
            <span>Telepon:</span>
            <span>{{ order?.customer?.phone }}</span>
          </div>
          <div class="receipt-divider">--------------------------------</div>
        </div>

        <!-- Items Table -->
        <table class="receipt-items">
          <thead>
            <tr>
              <th class="col-item">Item</th>
              <th class="col-qty">Qty</th>
              <th class="col-total">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order?.items" :key="item.id || item.name">
              <td class="col-item">
                <span class="item-title">{{ item.name }}</span>
                <small class="item-unit-price">@ ₩{{ (item.price || 0).toLocaleString('ko-KR') }}</small>
              </td>
              <td class="col-qty">{{ item.quantity }}x</td>
              <td class="col-total">₩{{ ((item.subtotal || (item.price * item.quantity)) || 0).toLocaleString('ko-KR') }}</td>
            </tr>
          </tbody>
        </table>

        <div class="receipt-divider">--------------------------------</div>

        <div class="receipt-totals">
          <div class="total-row grand-total">
            <strong>TOTAL</strong>
            <strong class="total-amount">₩{{ (order?.total || 0).toLocaleString('ko-KR') }}</strong>
          </div>
        </div>

        <div class="receipt-payment">
          <div class="meta-row">
            <span>Pembayaran:</span>
            <span>{{ order?.paymentMethod || 'Bank Transfer' }}</span>
          </div>
          <div class="meta-row">
            <span>Status:</span>
            <strong>{{ (order?.paymentStatus || 'Verified').toUpperCase() }}</strong>
          </div>
        </div>

        <div class="receipt-footer">
          <div class="receipt-stars">================================</div>
          <p class="footer-msg">Terima Kasih Atas Kunjungan Anda!</p>
          <p class="footer-korean">감사합니다 / Selamat Menikmati</p>
          <div class="receipt-stars">================================</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  order: Object
});

defineEmits(['close']);

const handlePrint = () => {
  window.print();
};
</script>

<style scoped>
.print-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(25, 21, 18, 0.6);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  z-index: 70;
  padding: 20px;
  overflow-y: auto;
}

.print-dialog {
  width: 100%;
  max-width: 440px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: var(--soft);
  border-bottom: 1px solid var(--line);
}

.dialog-header h3 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 750;
  color: var(--ink);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-print {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--r-sm);
  background: var(--red);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 750;
  cursor: pointer;
}

.btn-print:hover {
  background: var(--red-dark);
}

.btn-close {
  color: var(--muted);
  padding: 4px 8px;
  cursor: pointer;
}

/* Thermal receipt format conforming to DESIGN.md Section 27 */
.thermal-receipt {
  padding: 24px;
  background: #ffffff;
  font-family: 'Courier New', Courier, monospace;
  font-size: 12px;
  line-height: 1.45;
  color: #000;
  margin: 0 auto;
}

.receipt-header {
  text-align: center;
  margin-bottom: 12px;
}

.restaurant-name {
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 0.05em;
  margin: 6px 0 2px;
}

.restaurant-subtitle {
  font-size: 10px;
  margin: 0 0 6px;
}

.receipt-stars, .receipt-divider {
  text-align: center;
  letter-spacing: -1px;
  color: #555;
  margin: 4px 0;
}

.receipt-meta, .receipt-customer, .receipt-payment {
  margin: 8px 0;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  margin: 3px 0;
}

.receipt-items {
  width: 100%;
  border-collapse: collapse;
  margin: 8px 0;
  text-align: left;
}

.receipt-items th {
  padding: 4px 0;
  font-weight: 800;
  border-bottom: 1px dashed #000;
}

.receipt-items td {
  padding: 6px 0;
  vertical-align: top;
}

.col-item {
  width: 55%;
}

.col-qty {
  width: 15%;
  text-align: center;
}

.col-total {
  width: 30%;
  text-align: right;
}

.item-title {
  display: block;
  font-weight: 700;
}

.item-unit-price {
  font-size: 10px;
  color: #444;
}

.receipt-totals {
  margin: 8px 0;
}

.grand-total {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 900;
  margin: 6px 0;
}

.receipt-footer {
  text-align: center;
  margin-top: 14px;
}

.footer-msg {
  font-weight: 750;
  margin: 6px 0 2px;
}

.footer-korean {
  font-size: 10px;
  margin: 0 0 6px;
}

@media print {
  body * {
    visibility: hidden;
  }
  .print-modal-backdrop {
    position: absolute;
    inset: 0;
    background: transparent;
    padding: 0;
  }
  .print-dialog {
    border: none;
    box-shadow: none;
    max-width: 100%;
  }
  .no-print {
    display: none !important;
  }
  #receipt-print-area, #receipt-print-area * {
    visibility: visible;
  }
  #receipt-print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 80mm;
    padding: 0;
    margin: 0;
  }
}
</style>
