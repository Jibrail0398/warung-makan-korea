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
/* =========================================================
   PRINT RECEIPT MODAL
   ========================================================= */

/* Backdrop modal */
.print-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;

  /* Jangan pakai grid + place-items:center.
     Kalau receipt lebih tinggi dari viewport,
     bagian header bisa keluar dari layar. */
  display: flex;
  justify-content: center;
  align-items: flex-start;

  padding: 20px;
  box-sizing: border-box;

  background: rgba(25, 21, 18, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  overflow-y: auto;
  overflow-x: hidden;
}


/* =========================================================
   DIALOG
   ========================================================= */

.print-dialog {
  position: relative;

  width: 100%;
  max-width: 440px;

  /* Modal tidak boleh lebih tinggi dari viewport */
  max-height: calc(100dvh - 40px);

  background: #ffffff;
  border: 1px solid var(--line, #dddddd);
  border-radius: 12px;

  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.18),
    0 8px 10px -6px rgba(0, 0, 0, 0.12);

  overflow-y: auto;
  overflow-x: hidden;

  flex-shrink: 0;
}


/* =========================================================
   HEADER MODAL
   ========================================================= */

.dialog-header {
  position: sticky;
  top: 0;
  z-index: 100;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  width: 100%;
  padding: 14px 16px;
  box-sizing: border-box;

  background: var(--soft, #f7f7f7);
  border-bottom: 1px solid var(--line, #dddddd);
}

.dialog-header h3 {
  flex: 1;
  min-width: 0;

  margin: 0;

  font-size: 0.95rem;
  font-weight: 750;
  line-height: 1.3;

  color: var(--ink, #222222);

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


/* =========================================================
   HEADER ACTIONS
   ========================================================= */

.header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;

  flex-shrink: 0;
}


/* =========================================================
   PRINT BUTTON
   ========================================================= */

.btn-print {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  min-height: 34px;

  padding: 8px 12px;

  border: none;
  border-radius: 6px;

  background: #dc2626;
  color: #ffffff;

  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 750;
  line-height: 1;

  cursor: pointer;

  white-space: nowrap;
  flex-shrink: 0;

  transition:
    background-color 0.2s ease,
    transform 0.1s ease;
}

.btn-print:hover {
  background: #b91c1c;
}

.btn-print:active {
  transform: scale(0.97);
}

.btn-print:focus-visible {
  outline: 2px solid #dc2626;
  outline-offset: 2px;
}

.btn-print svg {
  width: 16px;
  height: 16px;

  flex-shrink: 0;
}


/* =========================================================
   CLOSE BUTTON
   ========================================================= */

.btn-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 34px;
  height: 34px;

  padding: 0;

  border: none;
  border-radius: 6px;

  background: transparent;
  color: var(--muted, #666666);

  font-family: inherit;
  font-size: 18px;
  line-height: 1;

  cursor: pointer;

  flex-shrink: 0;

  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.btn-close:hover {
  background: rgba(0, 0, 0, 0.06);
  color: #111111;
}

.btn-close:focus-visible {
  outline: 2px solid #777777;
  outline-offset: 2px;
}


/* =========================================================
   THERMAL RECEIPT
   ========================================================= */

.thermal-receipt {
  width: 100%;

  padding: 24px;
  margin: 0 auto;

  box-sizing: border-box;

  background: #ffffff;
  color: #000000;

  font-family: "Courier New", Courier, monospace;
  font-size: 12px;
  line-height: 1.45;
}


/* =========================================================
   RECEIPT HEADER
   ========================================================= */

.receipt-header {
  text-align: center;
  margin-bottom: 12px;
}

.restaurant-name {
  margin: 6px 0 2px;

  font-size: 16px;
  font-weight: 900;
  line-height: 1.3;

  letter-spacing: 0.05em;
}

.restaurant-subtitle {
  margin: 0 0 6px;

  font-size: 10px;
  line-height: 1.4;
}


/* =========================================================
   DIVIDERS
   ========================================================= */

.receipt-stars,
.receipt-divider {
  width: 100%;

  margin: 4px 0;

  text-align: center;

  color: #555555;

  letter-spacing: -1px;

  overflow: hidden;
  white-space: nowrap;
}


/* =========================================================
   META / CUSTOMER / PAYMENT
   ========================================================= */

.receipt-meta,
.receipt-customer,
.receipt-payment {
  margin: 8px 0;
}

.meta-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;

  margin: 3px 0;
}

.meta-row > span:first-child {
  flex-shrink: 0;
}

.meta-row > span:last-child,
.meta-row > strong:last-child {
  min-width: 0;

  text-align: right;

  word-break: break-word;
}


/* =========================================================
   ITEMS TABLE
   ========================================================= */

.receipt-items {
  width: 100%;

  margin: 8px 0;

  border-collapse: collapse;
  border-spacing: 0;

  table-layout: fixed;

  text-align: left;
}

.receipt-items th {
  padding: 4px 0;

  border-bottom: 1px dashed #000000;

  font-weight: 800;
  line-height: 1.3;
}

.receipt-items td {
  padding: 6px 0;

  vertical-align: top;

  line-height: 1.4;
}

.receipt-items th.col-item,
.receipt-items td.col-item {
  width: 55%;
  padding-right: 6px;
}

.receipt-items th.col-qty,
.receipt-items td.col-qty {
  width: 15%;

  text-align: center;
}

.receipt-items th.col-total,
.receipt-items td.col-total {
  width: 30%;

  text-align: right;
}

.item-title {
  display: block;

  font-weight: 700;

  word-break: break-word;
}

.item-unit-price {
  display: block;

  margin-top: 2px;

  font-size: 10px;
  line-height: 1.3;

  color: #444444;
}


/* =========================================================
   TOTAL
   ========================================================= */

.receipt-totals {
  margin: 8px 0;
}

.total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.grand-total {
  margin: 6px 0;

  font-size: 14px;
  font-weight: 900;
}

.total-amount {
  text-align: right;
  white-space: nowrap;
}


/* =========================================================
   RECEIPT FOOTER
   ========================================================= */

.receipt-footer {
  margin-top: 14px;

  text-align: center;
}

.footer-msg {
  margin: 6px 0 2px;

  font-weight: 750;
}

.footer-korean {
  margin: 0 0 6px;

  font-size: 10px;
  line-height: 1.4;
}


/* =========================================================
   RESPONSIVE
   ========================================================= */

@media screen and (max-width: 520px) {
  .print-modal-backdrop {
    padding: 10px;
  }

  .print-dialog {
    max-height: calc(100dvh - 20px);
    border-radius: 10px;
  }

  .dialog-header {
    gap: 8px;
    padding: 12px;
  }

  .dialog-header h3 {
    font-size: 0.85rem;
  }

  .btn-print {
    padding: 8px 10px;
    font-size: 0.72rem;
  }

  .thermal-receipt {
    padding: 18px;
  }
}


/* =========================================================
   PRINT MODE
   ========================================================= */

@media print {
  /*
   * Sembunyikan seluruh halaman,
   * lalu tampilkan hanya receipt.
   *
   * :global() digunakan karena style ini scoped.
   */
  :global(body *) {
    visibility: hidden !important;
  }

  :global(html),
  :global(body) {
    width: 100%;
    height: auto;

    margin: 0 !important;
    padding: 0 !important;

    background: #ffffff !important;

    overflow: visible !important;
  }

  /*
   * Jangan tampilkan header modal
   * (tombol Print dan Close).
   */
  .no-print {
    display: none !important;
  }

  /*
   * Parent modal dibuat netral
   * agar tidak memengaruhi posisi receipt.
   */
  .print-modal-backdrop {
    position: static !important;

    display: block !important;

    width: auto !important;
    height: auto !important;

    padding: 0 !important;
    margin: 0 !important;

    background: transparent !important;

    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;

    overflow: visible !important;
  }

  .print-dialog {
    position: static !important;

    width: auto !important;
    max-width: none !important;
    max-height: none !important;

    padding: 0 !important;
    margin: 0 !important;

    background: transparent !important;

    border: none !important;
    border-radius: 0 !important;

    box-shadow: none !important;

    overflow: visible !important;
  }

  /*
   * Tampilkan receipt dan semua anaknya.
   */
  #receipt-print-area,
  #receipt-print-area * {
    visibility: visible !important;
  }

  /*
   * Format thermal 80mm.
   */
  #receipt-print-area {
    position: absolute !important;

    top: 0 !important;
    left: 0 !important;

    width: 80mm !important;

    padding: 4mm !important;
    margin: 0 !important;

    box-sizing: border-box !important;

    background: #ffffff !important;
    color: #000000 !important;

    box-shadow: none !important;
  }

  /*
   * Hindari pemisahan row item ke halaman lain.
   */
  .receipt-items tr,
  .receipt-meta,
  .receipt-customer,
  .receipt-payment,
  .receipt-totals,
  .receipt-footer {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /*
   * Pastikan warna/text tercetak normal.
   */
  #receipt-print-area {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}


/* =========================================================
   PRINT PAGE
   ========================================================= */

@page {
  size: 80mm auto;
  margin: 0;
}
</style>
