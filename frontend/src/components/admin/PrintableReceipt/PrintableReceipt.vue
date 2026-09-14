<template>
  <div v-if="isOpen" class="print-modal-backdrop" @click.self="$emit('close')">
    <div class="print-dialog" role="dialog" aria-modal="true" aria-labelledby="printTitle">
      <div class="dialog-header no-print"><h3 id="printTitle">Pratinjau Struk Pesanan</h3><div class="header-actions"><button type="button" class="btn-print" @click="handlePrint"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><polyline points="6 9 6 2 18 2 18 9" stroke="currentColor" stroke-width="1.8" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" stroke-width="1.8" /><rect x="6" y="14" width="12" height="8" stroke="currentColor" stroke-width="1.8" /></svg><span>Cetak (Print)</span></button><button type="button" class="btn-close" @click="$emit('close')">✕</button></div></div>
      <div id="receipt-print-area" class="thermal-receipt">
        <div class="receipt-header"><div class="receipt-stars">================================</div><h1 class="restaurant-name">WARUNG NUSANTARA</h1><p class="restaurant-subtitle">Authentic Indonesian Cuisine in Korea</p><div class="receipt-stars">================================</div></div>
        <div class="receipt-meta"><div class="meta-row"><span>Order ID:</span><strong>{{ order?.orderNumber || order?.id }}</strong></div><div class="meta-row"><span>Tanggal:</span><span>{{ order?.date }} {{ order?.time }}</span></div><div class="meta-row"><span>Tipe:</span><span>{{ order?.orderType || 'Dine In' }} {{ order?.tableNumber ? `(${order.tableNumber})` : '' }}</span></div></div>
        <div class="receipt-customer"><div class="receipt-divider">--------------------------------</div><div class="meta-row"><span>Customer:</span><strong>{{ order?.customer?.name }}</strong></div><div class="meta-row"><span>Telepon:</span><span>{{ order?.customer?.phone }}</span></div><div class="receipt-divider">--------------------------------</div></div>
        <table class="receipt-items"><thead><tr><th class="col-item">Item</th><th class="col-qty">Qty</th><th class="col-total">Total</th></tr></thead><tbody><tr v-for="item in order?.items" :key="item.id || item.name"><td class="col-item"><span class="item-title">{{ item.name }}</span><small class="item-unit-price">@ ₩{{ (item.price || 0).toLocaleString('ko-KR') }}</small></td><td class="col-qty">{{ item.quantity }}x</td><td class="col-total">₩{{ ((item.subtotal || (item.price * item.quantity)) || 0).toLocaleString('ko-KR') }}</td></tr></tbody></table>
        <div class="receipt-divider">--------------------------------</div>
        <div class="receipt-totals"><div class="total-row grand-total"><strong>TOTAL</strong><strong class="total-amount">₩{{ (order?.total || 0).toLocaleString('ko-KR') }}</strong></div></div>
        <div class="receipt-payment"><div class="meta-row"><span>Pembayaran:</span><span>{{ order?.paymentMethod || 'Bank Transfer' }}</span></div><div class="meta-row"><span>Status:</span><strong>{{ (order?.paymentStatus || 'Verified').toUpperCase() }}</strong></div></div>
        <div class="receipt-footer"><div class="receipt-stars">================================</div><p class="footer-msg">Terima Kasih Atas Kunjungan Anda!</p><p class="footer-korean">감사합니다 / Selamat Menikmati</p><div class="receipt-stars">================================</div></div>
      </div>
    </div>
  </div>
</template>

<script>
import './PrintableReceipt.css';
export default {
  name: 'PrintableReceipt',
  props: { isOpen: Boolean, order: Object },
  emits: ['close'],
  setup() {
    const handlePrint = () => { window.print(); };
    return { handlePrint };
  }
};
</script>
