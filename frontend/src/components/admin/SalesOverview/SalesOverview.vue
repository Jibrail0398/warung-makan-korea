<template>
  <section class="sales-overview-card" aria-labelledby="salesOverviewTitle">
    <div class="card-header"><div><p class="card-eyebrow">RINGKASAN PENJUALAN</p><h2 id="salesOverviewTitle" class="card-title">Aktivitas Penjualan Minggu Ini</h2></div><div class="period-toggle" role="group" aria-label="Rentang waktu"><button type="button" class="toggle-btn" :class="{ active: activeTab === 'weekly' }" @click="activeTab = 'weekly'">Mingguan</button><button type="button" class="toggle-btn" :class="{ active: activeTab === 'hourly' }" @click="activeTab = 'hourly'">Jam Hari Ini</button></div></div>
    <div class="chart-container"><div class="chart-bars"><div v-for="item in currentData" :key="item.label" class="chart-bar-group"><div class="bar-track"><div class="bar-fill" :style="{ height: `${Math.max(12, (item.amount / maxAmount) * 100)}%` }" :class="{ 'bar-highlight': item.isToday || item.isCurrentHour }"><span class="bar-tooltip">₩{{ item.amount.toLocaleString('ko-KR') }}</span></div></div><span class="bar-label" :class="{ 'label-highlight': item.isToday || item.isCurrentHour }">{{ item.label }}</span></div></div></div>
    <div class="card-footer-metrics">
      <div class="footer-metric"><span class="metric-label">Menu Restoran</span><strong class="metric-val">₩890,000</strong><span class="metric-ratio">71.8% dari total</span></div>
      <div class="metric-divider"></div>
      <div class="footer-metric"><span class="metric-label">Raw Material</span><strong class="metric-val">₩350,000</strong><span class="metric-ratio">28.2% dari total</span></div>
      <div class="metric-divider"></div>
      <div class="footer-metric"><span class="metric-label">Rata-rata Order</span><strong class="metric-val">₩51,667</strong><span class="metric-ratio">24 transaksi selesai</span></div>
    </div>
  </section>
</template>

<script>
import SalesOverviewScript from './SalesOverview.js';
export default { ...SalesOverviewScript };
</script>
