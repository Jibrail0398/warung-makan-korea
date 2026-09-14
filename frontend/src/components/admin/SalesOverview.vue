<template>
  <section class="sales-overview-card" aria-labelledby="salesOverviewTitle">
    <div class="card-header">
      <div>
        <p class="card-eyebrow">RINGKASAN PENJUALAN</p>
        <h2 id="salesOverviewTitle" class="card-title">Aktivitas Penjualan Minggu Ini</h2>
      </div>

      <div class="period-toggle" role="group" aria-label="Rentang waktu">
        <button
          type="button"
          class="toggle-btn"
          :class="{ active: activeTab === 'weekly' }"
          @click="activeTab = 'weekly'"
        >
          Mingguan
        </button>
        <button
          type="button"
          class="toggle-btn"
          :class="{ active: activeTab === 'hourly' }"
          @click="activeTab = 'hourly'"
        >
          Jam Hari Ini
        </button>
      </div>
    </div>

    <!-- Chart Bar Visualization -->
    <div class="chart-container">
      <div class="chart-bars">
        <div
          v-for="item in currentData"
          :key="item.label"
          class="chart-bar-group"
        >
          <div class="bar-track">
            <div
              class="bar-fill"
              :style="{ height: `${Math.max(12, (item.amount / maxAmount) * 100)}%` }"
              :class="{ 'bar-highlight': item.isToday || item.isCurrentHour }"
            >
              <span class="bar-tooltip">₩{{ item.amount.toLocaleString('ko-KR') }}</span>
            </div>
          </div>
          <span class="bar-label" :class="{ 'label-highlight': item.isToday || item.isCurrentHour }">
            {{ item.label }}
          </span>
        </div>
      </div>
    </div>

    <!-- Key Metrics Summary -->
    <div class="card-footer-metrics">
      <div class="footer-metric">
        <span class="metric-label">Menu Restoran</span>
        <strong class="metric-val">₩890,000</strong>
        <span class="metric-ratio">71.8% dari total</span>
      </div>
      <div class="metric-divider"></div>
      <div class="footer-metric">
        <span class="metric-label">Raw Material</span>
        <strong class="metric-val">₩350,000</strong>
        <span class="metric-ratio">28.2% dari total</span>
      </div>
      <div class="metric-divider"></div>
      <div class="footer-metric">
        <span class="metric-label">Rata-rata Order</span>
        <strong class="metric-val">₩51,667</strong>
        <span class="metric-ratio">24 transaksi selesai</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';

const activeTab = ref('weekly');

const weeklyData = [
  { label: 'Sen', amount: 920000, isToday: false },
  { label: 'Sel', amount: 1150000, isToday: false },
  { label: 'Rab', amount: 840000, isToday: false },
  { label: 'Kam', amount: 1240000, isToday: true },
  { label: 'Jum', amount: 1480000, isToday: false },
  { label: 'Sab', amount: 2100000, isToday: false },
  { label: 'Min', amount: 1950000, isToday: false }
];

const hourlyData = [
  { label: '11:00', amount: 180000, isCurrentHour: false },
  { label: '12:00', amount: 340000, isCurrentHour: false },
  { label: '13:00', amount: 290000, isCurrentHour: false },
  { label: '14:00', amount: 120000, isCurrentHour: false },
  { label: '15:00', amount: 95000, isCurrentHour: false },
  { label: '16:00', amount: 150000, isCurrentHour: false },
  { label: '17:00', amount: 220000, isCurrentHour: false },
  { label: '18:00', amount: 380000, isCurrentHour: true }
];

const currentData = computed(() => {
  return activeTab.value === 'weekly' ? weeklyData : hourlyData;
});

const maxAmount = computed(() => {
  return Math.max(...currentData.value.map(d => d.amount)) || 1;
});
</script>

<style scoped>
.sales-overview-card {
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--paper);
  padding: 24px;
  box-shadow: 0 2px 10px rgba(36, 25, 18, 0.04);
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.card-eyebrow {
  margin: 0 0 5px;
  color: var(--red);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.card-title {
  margin: 0;
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 21px;
  font-weight: 600;
  letter-spacing: -0.025em;
}

.period-toggle {
  display: inline-flex;
  padding: 3px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--soft);
}

.toggle-btn {
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--muted);
  background: transparent;
  cursor: pointer;
  transition: all var(--ease);
}

.toggle-btn.active {
  background: #fff;
  color: var(--ink);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.chart-container {
  padding: 10px 0 20px;
  border-bottom: 1px solid var(--line);
}

.chart-bars {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 12px;
  height: 180px;
  align-items: end;
}

.chart-bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  gap: 8px;
}

.bar-track {
  width: 100%;
  max-width: 44px;
  height: 100%;
  display: flex;
  align-items: flex-end;
  border-radius: 6px 6px 0 0;
  background: var(--soft);
}

.bar-fill {
  position: relative;
  width: 100%;
  border-radius: 6px 6px 0 0;
  background: rgba(165, 29, 45, 0.35);
  transition: height 350ms cubic-bezier(0.2, 0.9, 0.3, 1), background var(--ease);
  cursor: pointer;
}

.bar-fill:hover {
  background: rgba(165, 29, 45, 0.7);
}

.bar-fill.bar-highlight {
  background: var(--red);
}

.bar-tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  border-radius: 4px;
  background: var(--ink);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 160ms ease;
  z-index: 10;
}

.bar-fill:hover .bar-tooltip {
  opacity: 1;
}

.bar-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--muted);
}

.bar-label.label-highlight {
  color: var(--red);
  font-weight: 800;
}

.card-footer-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding-top: 20px;
}

.footer-metric {
  display: flex;
  flex-direction: column;
}

.metric-label {
  font-size: 0.74rem;
  color: var(--muted);
  font-weight: 600;
}

.metric-val {
  font-size: 1.15rem;
  font-family: Georgia, "Times New Roman", serif;
  color: var(--ink);
  margin: 3px 0;
}

.metric-ratio {
  font-size: 0.7rem;
  color: var(--muted);
}

.metric-divider {
  display: none;
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
  }
  .card-footer-metrics {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
