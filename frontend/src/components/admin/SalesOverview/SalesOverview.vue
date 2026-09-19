<template>
  <section class="sales-overview-card" aria-labelledby="salesOverviewTitle">
    <div class="card-header"><div><h2 id="salesOverviewTitle" class="card-title">Aktivitas Penjualan</h2></div><div class="period-toggle" role="group" aria-label="Rentang waktu"><button type="button" class="toggle-btn" :class="{ active: activeTab === 'weekly' }" @click="activeTab = 'weekly'">Mingguan</button><button type="button" class="toggle-btn" :class="{ active: activeTab === 'hourly' }" @click="activeTab = 'hourly'">Jam Hari Ini</button></div></div>
    <div class="chart-container">
      <div v-if="currentData.length" class="chart-bars">
        <div v-for="item in currentData" :key="item.label" class="chart-bar-group">
          <div class="bar-track">
            <div class="bar-fill" :style="{ height: `${Math.max(12, ((Number(item.amount) || 0) / maxAmount) * 100)}%` }" :class="{ 'bar-highlight': item.isToday || item.isCurrentHour }">
              <span class="bar-tooltip">{{ format(item.amount) }}</span>
            </div>
          </div>
          <span class="bar-label" :class="{ 'label-highlight': item.isToday || item.isCurrentHour }">{{ item.label }}</span>
        </div>
      </div>
      <p v-else class="chart-empty">Belum ada data penjualan pada periode ini.</p>
    </div>
    <div class="card-footer-metrics">
      <div class="footer-metric"><span class="metric-label">Total Pemasukan</span><strong class="metric-val">{{ format(summary.total_revenue) }}</strong><span class="metric-ratio">{{ summary.paid_orders || 0 }} pesanan lunas</span></div>
      <div class="metric-divider"></div>
      <div class="footer-metric"><span class="metric-label">Item Terjual</span><strong class="metric-val">{{ summary.total_items_sold || 0 }}</strong><span class="metric-ratio">{{ summary.total_orders || 0 }} transaksi hari ini</span></div>
      <div class="metric-divider"></div>
      <div class="footer-metric"><span class="metric-label">Rata-rata Order</span><strong class="metric-val">{{ format(summary.average_order_value) }}</strong><span class="metric-ratio">per pesanan lunas</span></div>
    </div>
  </section>
</template>

<script>
import SalesOverviewScript from './SalesOverview.js';
export default { ...SalesOverviewScript };
</script>
