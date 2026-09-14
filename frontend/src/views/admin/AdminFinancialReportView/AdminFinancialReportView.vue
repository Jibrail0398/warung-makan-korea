<template>
  <div class="report-page">
    <header class="page-header no-print">
      <div>
        <p class="page-eyebrow">ANALISIS KEUANGAN & OMSET</p>
        <h1 class="page-title">Laporan Keuangan</h1>
        <p class="page-description">
          Ringkasan omset pemasukan harian dan bulanan, perbandingan Menu Restoran vs Raw Material, dan produk terlaris.
        </p>
      </div>

      <div class="header-actions">
        <button type="button" class="btn-print" @click="handlePrint">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <polyline points="6 9 6 2 18 2 18 9" stroke="currentColor" stroke-width="1.8" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" stroke-width="1.8" />
            <rect x="6" y="14" width="12" height="8" stroke="currentColor" stroke-width="1.8" />
          </svg>
          <span>Cetak Laporan Keuangan</span>
        </button>
      </div>
    </header>

    <!-- Period Filter Selector -->
    <section class="period-selector-card no-print">
      <div class="period-tabs">
        <button type="button" class="tab-btn" :class="{ active: periodType === 'today' }" @click="setPeriod('today')">Hari Ini</button>
        <button type="button" class="tab-btn" :class="{ active: periodType === 'month' }" @click="setPeriod('month')">Bulan Ini</button>
      </div>

      <div class="date-picker-wrap">
        <label class="picker-label">Pilih Bulan:</label>
        <input type="month" v-model="selectedMonth" class="picker-input" @change="loadReport" />
      </div>
    </section>

    <!-- Print Header -->
    <div class="print-report-header">
      <h2>WARUNG NUSANTARA — LAPORAN KEUANGAN & OMSET</h2>
      <p>Periode: {{ periodType === 'today' ? 'Hari Ini' : selectedMonth }} | Dicetak: {{ printTimestamp }}</p>
    </div>

    <!-- Top Key Metrics -->
    <section class="financial-metrics-grid">
      <div class="metric-card highlight-card">
        <span class="m-label">Total Omset Pendapatan</span>
        <strong class="m-val">{{ finData.formattedRevenue || '₩0' }}</strong>
        <span class="m-sub">{{ finData.completedCount || 0 }} pesanan sukses terbayar</span>
      </div>
      <div class="metric-card">
        <span class="m-label">Rata-rata Nilai Transaksi</span>
        <strong class="m-val">{{ finData.formattedAvgOrderValue || '₩0' }}</strong>
        <span class="m-sub">Average ticket size per order</span>
      </div>
      <div class="metric-card">
        <span class="m-label">Pendapatan Menu Restoran</span>
        <strong class="m-val text-red">{{ finData.breakdown?.formattedRestaurantRevenue || '₩0' }}</strong>
        <span class="m-sub">Makanan siap saji</span>
      </div>
      <div class="metric-card">
        <span class="m-label">Pendapatan Raw Material</span>
        <strong class="m-val text-warm">{{ finData.breakdown?.formattedRawRevenue || '₩0' }}</strong>
        <span class="m-sub">Bahan mentah & sembako</span>
      </div>
    </section>

    <!-- Two Column Analysis -->
    <div class="analysis-grid">
      <section class="card ratio-card">
        <h3 class="card-title">Kontribusi Kategori Penjualan</h3>
        <p class="card-subtitle">Perbandingan omset antara hidangan siap makan dan produk mentah.</p>
        <div class="ratio-bar-wrap">
          <div class="ratio-bar restaurant-bar" :style="{ width: `${restaurantPercent}%` }"><span>{{ restaurantPercent }}%</span></div>
          <div class="ratio-bar raw-bar" :style="{ width: `${rawPercent}%` }"><span>{{ rawPercent }}%</span></div>
        </div>
        <div class="ratio-legend">
          <div class="legend-item">
            <span class="legend-dot red-dot"></span>
            <div>
              <strong>Menu Restoran</strong>
              <small>{{ finData.breakdown?.formattedRestaurantRevenue || '₩0' }} ({{ restaurantPercent }}%)</small>
            </div>
          </div>
          <div class="legend-item">
            <span class="legend-dot warm-dot"></span>
            <div>
              <strong>Raw Material</strong>
              <small>{{ finData.breakdown?.formattedRawRevenue || '₩0' }} ({{ rawPercent }}%)</small>
            </div>
          </div>
        </div>
      </section>

      <section class="card top-items-card">
        <h3 class="card-title">5 Produk Terlaris & Kontribusi Omset</h3>
        <p class="card-subtitle">Produk yang menghasilkan volume pendapatan tertinggi.</p>
        <div class="top-list">
          <div v-for="(prod, idx) in finData.topProducts" :key="prod.name" class="top-item-row">
            <div class="top-rank-badge">{{ idx + 1 }}</div>
            <div class="top-prod-info">
              <strong>{{ prod.name }}</strong>
              <small>{{ prod.qty }} unit terjual</small>
            </div>
            <div class="top-prod-rev"><strong>₩{{ (prod.revenue || 0).toLocaleString('ko-KR') }}</strong></div>
          </div>
          <div v-if="!finData.topProducts?.length" class="empty-top">
            <p>Belum ada data produk terjual pada periode ini.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import AdminFinancialReportScript from './AdminFinancialReportView.js';
export default { ...AdminFinancialReportScript };
</script>
