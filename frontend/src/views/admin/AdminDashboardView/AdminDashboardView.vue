<template>
  <div class="dashboard-view">
    <!-- Header Greeting -->
    <header class="dashboard-heading">
      <div class="heading-content">
        <h1 class="dashboard-title">Dashboard Admin & Kasir</h1>
      </div>

      <div class="heading-quick-actions">
        <router-link to="/admin/orders" class="quick-btn primary-quick-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" stroke-width="1.8" />
            <rect x="8" y="2" width="8" height="4" rx="1" stroke="currentColor" stroke-width="1.8" />
          </svg>
          <span>Monitoring Pesanan</span>
        </router-link>

        <router-link to="/admin/products" class="quick-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <span>Kelola Produk</span>
        </router-link>
      </div>
    </header>

    <!-- Key Metrics Grid -->
    <section class="stats-grid" aria-label="Statistik Toko Hari Ini">
      <StatCard
        label="Pesanan Hari Ini"
        :value="stats.todayOrders"
        description="Semua status hari ini"
        tone="red"
        :icon="OrderIcon"
      />

      <StatCard
        label="Total Pemasukan"
        :value="stats.todayRevenue"
        description="Pesanan lunas hari ini"
        tone="red"
        :icon="RevenueIcon"
      />

      <StatCard
        label="Perlu Perhatian"
        :value="stats.pendingOrders"
        description="Menunggu verifikasi / masak"
        tone="warm"
        :icon="PendingIcon"
      />

      <StatCard
        label="Pesanan Selesai"
        :value="stats.completedOrders"
        description="Selesai hari ini"
        tone="success"
        :icon="CompletedIcon"
      />
    </section>

    <!-- Visual Sales Overview Chart -->
    <SalesOverview :weekly-data="weeklyData" :hourly-data="hourlyData" :summary="reportSummary" :format-currency="formatCurrency" />

    <!-- Recent Orders -->
    <section class="dashboard-bottom-grid" aria-label="Pesanan terbaru">
      <RecentOrders />
    </section>
  </div>
</template>

<script>
import AdminDashboardViewScript from './AdminDashboardView.js';

export default {
  ...AdminDashboardViewScript
};
</script>
