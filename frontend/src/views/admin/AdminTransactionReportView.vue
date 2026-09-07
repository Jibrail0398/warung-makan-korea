<template>
  <div class="report-page">
    <header class="page-header no-print">
      <div>
        <p class="page-eyebrow">REKAPITULASI LAPORAN</p>
        <h1 class="page-title">Laporan Transaksi</h1>
        <p class="page-description">
          Daftar seluruh riwayat transaksi pesanan harian dan bulanan beserta status pembayaran.
        </p>
      </div>

      <div class="header-actions">
        <button type="button" class="btn-print" @click="handlePrint">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <polyline points="6 9 6 2 18 2 18 9" stroke="currentColor" stroke-width="1.8" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" stroke-width="1.8" />
            <rect x="6" y="14" width="12" height="8" stroke="currentColor" stroke-width="1.8" />
          </svg>
          <span>Cetak Rekap Laporan</span>
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
          Harian (Hari Ini)
        </button>
        <button
          type="button"
          class="tab-btn"
          :class="{ active: periodType === 'month' }"
          @click="setPeriod('month')"
        >
          Bulanan (Bulan Ini)
        </button>
      </div>

      <div class="date-picker-wrap">
        <label class="picker-label">Pilih Tanggal / Periode:</label>
        <input
          v-if="periodType === 'today'"
          type="date"
          v-model="selectedDate"
          class="picker-input"
          @change="loadReport"
        />
        <input
          v-else
          type="month"
          v-model="selectedMonth"
          class="picker-input"
          @change="loadReport"
        />
      </div>
    </section>

    <!-- Report Header for Print -->
    <div class="print-report-header">
      <h2>WARUNG NUSANTARA — LAPORAN TRANSAKSI</h2>
      <p>Periode: {{ periodTitle }} | Dicetak pada: {{ printTimestamp }}</p>
    </div>

    <!-- Summary Metrics -->
    <section class="summary-metrics-grid">
      <div class="metric-card">
        <span class="m-label">Total Transaksi</span>
        <strong class="m-val">{{ reportData.summary?.totalOrders || 0 }}</strong>
        <span class="m-sub">Semua status</span>
      </div>
      <div class="metric-card">
        <span class="m-label">Transaksi Berhasil</span>
        <strong class="m-val success-val">{{ reportData.summary?.completedOrders || 0 }}</strong>
        <span class="m-sub">Pesanan selesai</span>
      </div>
      <div class="metric-card">
        <span class="m-label">Transaksi Batal</span>
        <strong class="m-val danger-val">{{ reportData.summary?.cancelledOrders || 0 }}</strong>
        <span class="m-sub">Dibatalkan</span>
      </div>
      <div class="metric-card">
        <span class="m-label">Total Nilai Transaksi</span>
        <strong class="m-val price-val">{{ reportData.summary?.formattedRevenue || '₩0' }}</strong>
        <span class="m-sub">Pemasukan bersih</span>
      </div>
    </section>

    <!-- Detailed Transactions Table -->
    <section class="table-card">
      <table class="report-table">
        <thead>
          <tr>
            <th scope="col">Tanggal & Jam</th>
            <th scope="col">No. Pesanan</th>
            <th scope="col">Customer</th>
            <th scope="col">Tipe</th>
            <th scope="col">Item Dipesan</th>
            <th scope="col">Metode Bayar</th>
            <th scope="col">Total</th>
            <th scope="col">Status Pesanan</th>
          </tr>
        </thead>
        <tbody v-if="reportData.orders?.length > 0">
          <tr v-for="order in reportData.orders" :key="order.id">
            <td>
              <span class="date-text">{{ order.date }}</span>
              <small class="time-text">{{ order.time || '-' }}</small>
            </td>
            <td>
              <strong class="code-text">{{ order.orderNumber || order.id }}</strong>
            </td>
            <td>
              <div class="cust-info">
                <span>{{ order.customer?.name }}</span>
                <small>{{ order.customer?.phone }}</small>
              </div>
            </td>
            <td>
              <span class="type-text">{{ order.orderType }}</span>
            </td>
            <td>
              <span class="items-desc">{{ order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ') }}</span>
            </td>
            <td>
              <span>{{ order.paymentMethod }}</span>
            </td>
            <td>
              <strong class="row-total">₩{{ (order.total || 0).toLocaleString('ko-KR') }}</strong>
            </td>
            <td>
              <StatusBadge :status="order.status" />
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="8" class="empty-row">
              Tidak ada data transaksi pada periode ini.
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { adminService } from '../../services/adminService.js';
import StatusBadge from '../../components/admin/StatusBadge.vue';

const periodType = ref('today');
const todayStr = new Date().toISOString().split('T')[0];
const monthStr = todayStr.substring(0, 7);

const selectedDate = ref(todayStr);
const selectedMonth = ref(monthStr);

const reportData = ref({ orders: [], summary: {} });
const printTimestamp = ref('');

const loadReport = async () => {
  try {
    reportData.value = await adminService.getTransactionReport({
      period: periodType.value,
      date: selectedDate.value,
      month: selectedMonth.value
    });
    const now = new Date();
    printTimestamp.value = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  } catch (err) {
    console.error('Load report error:', err);
  }
};

onMounted(() => {
  loadReport();
});

const setPeriod = (type) => {
  periodType.value = type;
  loadReport();
};

const periodTitle = computed(() => {
  if (periodType.value === 'today') {
    return `Harian (${selectedDate.value})`;
  }
  return `Bulanan (${selectedMonth.value})`;
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

.summary-metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  padding: 18px 20px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid var(--line);
  box-shadow: 0 2px 8px rgba(36, 25, 18, 0.03);
  display: flex;
  flex-direction: column;
}

.m-label {
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--muted);
}

.m-val {
  font-size: 1.6rem;
  font-family: Georgia, "Times New Roman", serif;
  color: var(--ink);
  margin: 4px 0 2px;
}

.m-sub {
  font-size: 0.72rem;
  color: var(--muted);
}

.success-val {
  color: var(--success);
}

.danger-val {
  color: var(--color-danger, #dc2626);
}

.price-val {
  color: var(--red);
}

.table-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow-x: auto;
  box-shadow: 0 2px 10px rgba(36, 25, 18, 0.04);
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  min-width: 850px;
}

.report-table th {
  padding: 12px 16px;
  background: var(--soft);
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--line);
}

.report-table td {
  padding: 13px 16px;
  border-bottom: 1px solid var(--line);
  font-size: 0.82rem;
  vertical-align: middle;
}

.report-table tbody tr:last-child td {
  border-bottom: none;
}

.date-text {
  display: block;
  font-weight: 650;
}

.time-text {
  color: var(--muted);
  font-size: 0.7rem;
}

.code-text {
  color: var(--ink);
}

.cust-info {
  display: flex;
  flex-direction: column;
}

.cust-info small {
  color: var(--muted);
  font-size: 0.72rem;
}

.items-desc {
  max-width: 200px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row-total {
  color: var(--ink);
}

.empty-row {
  padding: 36px;
  text-align: center;
  color: var(--muted);
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
  .print-report-header h2 {
    font-size: 16px;
    margin: 0 0 4px;
  }
  .print-report-header p {
    font-size: 11px;
    color: #555;
    margin: 0;
  }
  .summary-metrics-grid {
    grid-template-columns: repeat(4, 1fr);
    margin-bottom: 18px;
  }
  .metric-card {
    border: 1px solid #ccc;
    box-shadow: none;
  }
  .table-card {
    border: 1px solid #ccc;
    box-shadow: none;
  }
}

@media (max-width: 960px) {
  .summary-metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .summary-metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
