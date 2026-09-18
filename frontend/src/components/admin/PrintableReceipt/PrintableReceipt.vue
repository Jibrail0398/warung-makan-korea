<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="print-modal-backdrop" @click.self="$emit('close')">
      <div class="print-dialog" role="dialog" aria-modal="true" aria-labelledby="printTitle">
        <div class="dialog-header no-print">
          <h3 id="printTitle">Pratinjau Struk Pesanan</h3>
          <div class="header-actions">
            <button type="button" class="btn-print" @click="handlePrint">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <polyline points="6 9 6 2 18 2 18 9" stroke="currentColor" stroke-width="1.8" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" stroke-width="1.8" />
                <rect x="6" y="14" width="12" height="8" stroke="currentColor" stroke-width="1.8" />
              </svg>
              <span>Cetak</span>
            </button>
            <button type="button" class="btn-download" @click="handleDownload">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3v12m0 0 4-4m-4 4-4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              </svg>
              <span>Download</span>
            </button>
            <button type="button" class="btn-close" aria-label="Tutup" @click="$emit('close')">✕</button>
          </div>
        </div>

        <div id="receipt-print-area" class="receipt-preview thermal-receipt">
          <div class="receipt-header">
            <h1 class="restaurant-name">WARUNG MAKAN KOREA</h1>
            <p class="restaurant-subtitle">Struk Pesanan</p>
            <div class="receipt-divider receipt-divider-dashed"></div>
          </div>

          <div class="receipt-meta">
            <div class="meta-row"><span>No. Pesanan:</span><strong>#{{ order?.id }}</strong></div>
            <div class="meta-row"><span>Waktu:</span><span>{{ formatDateTime(order?.created_at) }}</span></div>
            <div class="meta-row"><span>Pelanggan:</span><span>{{ order?.customer_name || '-' }}</span></div>
            <div class="meta-row"><span>Telepon:</span><span>{{ order?.customer_phone || '-' }}</span></div>
            <div v-if="order?.table_number" class="meta-row"><span>Meja:</span><span>Meja {{ order.table_number }}</span></div>
          </div>

          <div class="receipt-divider receipt-divider-dashed"></div>

          <div class="receipt-items-heading">
            <span>ITEM</span>
            <span>JUMLAH</span>
          </div>
          <div class="receipt-divider receipt-divider-dashed"></div>

          <table class="receipt-items">
            <tbody>
              <tr v-for="item in order?.items" :key="item.id">
                <td class="col-item">
                  <span class="item-title">{{ item.product?.name || 'Produk' }}</span>
                  <span class="item-sub">{{ item.quantity }} x {{ formatPrice(item.price) }}</span>
                </td>
                <td class="col-total">{{ formatPrice(item.sub_total || item.price * item.quantity) }}</td>
              </tr>
            </tbody>
          </table>

          <div class="receipt-divider receipt-divider-dashed"></div>

          <div class="receipt-totals">
            <div class="total-row grand-total">
              <strong>TOTAL</strong>
              <strong class="total-amount">{{ formatPrice(order?.total_price) }}</strong>
            </div>
          </div>

          <div class="receipt-divider receipt-divider-dashed"></div>

          <div class="receipt-footer">
            <p class="footer-msg">Terima Kasih Atas Kunjungan Anda!</p>
            <p class="footer-korean">감사합니다 / Selamat Menikmati</p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { generateReceiptPdf } from '../../../utils/receiptPdf.js';
import './PrintableReceipt.css';

export default {
  name: 'PrintableReceipt',
  props: { isOpen: Boolean, order: Object },
  emits: ['close'],
  setup(props) {
    const formatPrice = (value) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(Number(value) || 0);
    const formatDateTime = (value) => {
      if (!value) return '-';
      return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
    };

    const handlePrint = () => { window.print(); };

    const handleDownload = () => {
      if (!props.order) return;
      generateReceiptPdf(props.order).save(`struk-${props.order.id}.pdf`);
    };

    return { handlePrint, handleDownload, formatPrice, formatDateTime };
  }
};
</script>
