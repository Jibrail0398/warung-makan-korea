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
        <button
          type="button"
          class="tab-btn"
          :class="{ active: periodType === 'today' }"
          @click="setPeriod('today')"
        >
          Hari Ini
        </button>
        <button
          type="button"
          class="tab-btn"
          :class="{ active: periodType === 'month' }"
          @click="setPeriod('month')"
        >
          Bulan Ini
        </button>
      </div>

      <div class="date-picker-wrap">
        <label class="picker-label">Pilih Bulan:</label>
        <input
          type="month"
          v-model="selectedMonth"
          class="picker-input"
          @change="loadReport"
        />
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

    <!-- Two Column Analysis: Category Ratio & Top Selling Products -->
    <div class="analysis-grid">
      <!-- Category Contribution Ratio -->
      <section class="card ratio-card">
        <h3 class="card-title">Kontribusi Kategori Penjualan</h3>
        <p class="card-subtitle">Perbandingan omset antara hidangan siap makan dan produk mentah.</p>

        <div class="ratio-bar-wrap">
          <div
            class="ratio-bar restaurant-bar"
            :style="{ width: `${restaurantPercent}%` }"
          >
            <span>{{ restaurantPercent }}%</span>
          </div>
          <div
            class="ratio-bar raw-bar"
            :style="{ width: `${rawPercent}%` }"
          >
            <span>{{ rawPercent }}%</span>
          </div>
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

      <!-- Top 5 Highest Revenue Generating Items -->
      <section class="card top-items-card">
        <h3 class="card-title">5 Produk Terlaris & Kontribusi Omset</h3>
        <p class="card-subtitle">Produk yang menghasilkan volume pendapatan tertinggi.</p>

        <div class="top-list">
          <div
            v-for="(prod, idx) in finData.topProducts"
            :key="prod.name"
            class="top-item-row"
          >
            <div class="top-rank-badge">{{ idx + 1 }}</div>
            <div class="top-prod-info">
              <strong>{{ prod.name }}</strong>
              <small>{{ prod.qty }} unit terjual</small>
            </div>
            <div class="top-prod-rev">
              <strong>₩{{ (prod.revenue || 0).toLocaleString('ko-KR') }}</strong>
            </div>
          </div>
          <div v-if="!finData.topProducts?.length" class="empty-top">
            <p>Belum ada data produk terjual pada periode ini.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { adminService } from '../../services/adminService.js';

const periodType = ref('month');
const todayStr = new Date().toISOString().split('T')[0];
const monthStr = todayStr.substring(0, 7);

const selectedMonth = ref(monthStr);
const finData = ref({});
const printTimestamp = ref('');

const loadReport = async () => {
  try {
    finData.value = await adminService.getFinancialReport({
      period: periodType.value,
      month: selectedMonth.value
    });
    const now = new Date();
    printTimestamp.value = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  } catch (err) {
    console.error('Load financial report error:', err);
  }
};

onMounted(() => {
  loadReport();
});

const setPeriod = (type) => {
  periodType.value = type;
  loadReport();
};

const restaurantPercent = computed(() => {
  const tot = finData.value.totalRevenue || 0;
  if (!tot) return 50;
  const rest = finData.value.breakdown?.restaurantRevenue || 0;
  return Math.round((rest / tot) * 100);
});

const rawPercent = computed(() => {
  return 100 - restaurantPercent.value;
});

const handlePrint = () => {
  window.print();
};
</script>

<style scoped>
.report-page {
  width: 100%;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.page-eyebrow {
  margin: 0 0 6px;
  color: var(--red);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.page-title {
  margin: 0;
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(26px, 3.2vw, 34px);
  font-weight: 500;
  letter-spacing: -0.03em;
}

.page-description {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 0.86rem;
}

.btn-print {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 18px;
  border-radius: var(--r-sm);
  background: var(--red);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 750;
  cursor: pointer;
  transition: all var(--ease);
}

.btn-print:hover {
  background: var(--red-dark);
}

.period-selector-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid var(--line);
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.period-tabs {
  display: flex;
  gap: 6px;
  padding: 3px;
  background: var(--soft);
  border-radius: var(--r-sm);
  border: 1px solid var(--line);
}

.tab-btn {
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--muted);
  cursor: pointer;
  transition: all var(--ease);
}

.tab-btn.active {
  background: #fff;
  color: var(--ink);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.date-picker-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.picker-label {
  font-size: 0.8rem;
  font-weight: 650;
  color: var(--muted);
}

.picker-input {
  height: 38px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: #fff;
  font-size: 0.84rem;
  color: var(--ink);
  outline: none;
}

.financial-metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid var(--line);
  box-shadow: 0 2px 8px rgba(36, 25, 18, 0.03);
  display: flex;
  flex-direction: column;
}

.highlight-card {
  background: #fffdfc;
  border-color: rgba(165, 29, 45, 0.25);
}

.m-label {
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--muted);
}

.m-val {
  font-size: 1.65rem;
  font-family: Georgia, "Times New Roman", serif;
  color: var(--ink);
  margin: 4px 0 2px;
}

.m-sub {
  font-size: 0.72rem;
  color: var(--muted);
}

.text-red {
  color: var(--red);
}

.text-warm {
  color: #854d0e;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.card {
  padding: 24px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid var(--line);
  box-shadow: 0 2px 10px rgba(36, 25, 18, 0.04);
}

.card-title {
  margin: 0;
  font-size: 1.15rem;
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 600;
  color: var(--ink);
}

.card-subtitle {
  margin: 4px 0 20px;
  font-size: 0.8rem;
  color: var(--muted);
}

.ratio-bar-wrap {
  display: flex;
  height: 38px;
  border-radius: var(--r-sm);
  overflow: hidden;
  margin-bottom: 20px;
}

.ratio-bar {
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 0.78rem;
  font-weight: 800;
  transition: width 400ms ease;
}

.restaurant-bar {
  background: var(--red);
}

.raw-bar {
  background: #b45309;
}

.ratio-legend {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.legend-item {
  display: flex;
  gap: 10px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  margin-top: 4px;
  flex-shrink: 0;
}

.red-dot {
  background: var(--red);
}

.warm-dot {
  background: #b45309;
}

.legend-item strong {
  display: block;
  font-size: 0.84rem;
  color: var(--ink);
}

.legend-item small {
  color: var(--muted);
  font-size: 0.75rem;
}

.top-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.top-item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--r-sm);
  background: var(--soft);
}

.top-rank-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--red);
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 0.72rem;
  font-weight: 800;
}

.top-prod-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.top-prod-info strong {
  font-size: 0.86rem;
  color: var(--ink);
}

.top-prod-info small {
  font-size: 0.72rem;
  color: var(--muted);
}

.top-prod-rev {
  font-size: 0.9rem;
  color: var(--ink);
}

.empty-top {
  padding: 24px;
  text-align: center;
  color: var(--muted);
  font-size: 0.82rem;
}

.print-report-header {
  display: none;
}

@media print {
  body * {
    visibility: hidden;
  }
  .no-print {
    display: none !important;
  }
  .report-page, .report-page * {
    visibility: visible;
  }
  .report-page {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: #fff;
    padding: 20px;
  }
  .print-report-header {
    display: block;
    margin-bottom: 18px;
    border-bottom: 2px solid #000;
    padding-bottom: 10px;
  }
}

@media (max-width: 960px) {
  .financial-metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .analysis-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .financial-metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
