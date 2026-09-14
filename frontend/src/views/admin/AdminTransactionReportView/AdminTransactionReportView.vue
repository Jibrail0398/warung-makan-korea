<template>
  <div class="report-page">
    <header class="page-header no-print">
      <div><p class="page-eyebrow">REKAPITULASI LAPORAN</p><h1 class="page-title">Laporan Transaksi</h1><p class="page-description">Daftar seluruh riwayat transaksi pesanan harian dan bulanan beserta status pembayaran.</p></div>
      <div class="header-actions">
        <button type="button" class="btn-print" @click="handlePrint"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><polyline points="6 9 6 2 18 2 18 9" stroke="currentColor" stroke-width="1.8" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" stroke-width="1.8" /><rect x="6" y="14" width="12" height="8" stroke="currentColor" stroke-width="1.8" /></svg><span>Cetak Rekap Laporan</span></button>
      </div>
    </header>
    <section class="period-selector-card no-print">
      <div class="period-tabs">
        <button type="button" class="tab-btn" :class="{ active: periodType === 'today' }" @click="setPeriod('today')">Harian (Hari Ini)</button>
        <button type="button" class="tab-btn" :class="{ active: periodType === 'month' }" @click="setPeriod('month')">Bulanan (Bulan Ini)</button>
      </div>
      <div class="date-picker-wrap">
        <label class="picker-label">Pilih Tanggal / Periode:</label>
        <input v-if="periodType === 'today'" type="date" v-model="selectedDate" class="picker-input" @change="loadReport" />
        <input v-else type="month" v-model="selectedMonth" class="picker-input" @change="loadReport" />
      </div>
    </section>
    <div class="print-report-header"><h2>WARUNG NUSANTARA — LAPORAN TRANSAKSI</h2><p>Periode: {{ periodTitle }} | Dicetak pada: {{ printTimestamp }}</p></div>
    <section class="summary-metrics-grid">
      <div class="metric-card"><span class="m-label">Total Transaksi</span><strong class="m-val">{{ reportData.summary?.totalOrders || 0 }}</strong><span class="m-sub">Semua status</span></div>
      <div class="metric-card"><span class="m-label">Transaksi Berhasil</span><strong class="m-val success-val">{{ reportData.summary?.completedOrders || 0 }}</strong><span class="m-sub">Pesanan selesai</span></div>
      <div class="metric-card"><span class="m-label">Transaksi Batal</span><strong class="m-val danger-val">{{ reportData.summary?.cancelledOrders || 0 }}</strong><span class="m-sub">Dibatalkan</span></div>
      <div class="metric-card"><span class="m-label">Total Nilai Transaksi</span><strong class="m-val price-val">{{ reportData.summary?.formattedRevenue || '₩0' }}</strong><span class="m-sub">Pemasukan bersih</span></div>
    </section>
    <section class="table-card">
      <table class="report-table">
        <thead><tr><th scope="col">Tanggal & Jam</th><th scope="col">No. Pesanan</th><th scope="col">Customer</th><th scope="col">Tipe</th><th scope="col">Item Dipesan</th><th scope="col">Metode Bayar</th><th scope="col">Total</th><th scope="col">Status Pesanan</th></tr></thead>
        <tbody v-if="reportData.orders?.length > 0">
          <tr v-for="order in reportData.orders" :key="order.id">
            <td><span class="date-text">{{ order.date }}</span><small class="time-text">{{ order.time || '-' }}</small></td>
            <td><strong class="code-text">{{ order.orderNumber || order.id }}</strong></td>
            <td><div class="cust-info"><span>{{ order.customer?.name }}</span><small>{{ order.customer?.phone }}</small></div></td>
            <td><span class="type-text">{{ order.orderType }}</span></td>
            <td><span class="items-desc">{{ order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ') }}</span></td>
            <td><span>{{ order.paymentMethod }}</span></td>
            <td><strong class="row-total">₩{{ (order.total || 0).toLocaleString('ko-KR') }}</strong></td>
            <td><StatusBadge :status="order.status" /></td>
          </tr>
        </tbody>
        <tbody v-else><tr><td colspan="8" class="empty-row">Tidak ada data transaksi pada periode ini.</td></tr></tbody>
      </table>
    </section>
  </div>
</template>

<script>
import AdminTransactionReportScript from './AdminTransactionReportView.js';
export default { ...AdminTransactionReportScript };
</script>
