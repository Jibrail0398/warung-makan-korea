<template>
  <div class="dashboard-view">
    <!-- Header Greeting -->
    <header class="dashboard-heading">
      <div class="heading-content">
        <p class="dashboard-eyebrow">RINGKASAN OPERASIONAL</p>
        <h1 class="dashboard-title">Dashboard Admin & Kasir</h1>
        <p class="dashboard-description">
          Selamat datang kembali, <strong>{{ adminName }}</strong>. Berikut adalah ringkasan pesanan dan penjualan hari ini.
        </p>
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
        trend="+14.2%"
        description="vs kemarin"
        tone="red"
        :icon="OrderIcon"
      />

      <StatCard
        label="Total Pemasukan"
        :value="stats.todayRevenue"
        trend="+8.5%"
        description="vs kemarin"
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
        trend="+18"
        description="hari ini"
        tone="success"
        :icon="CompletedIcon"
      />
    </section>

    <!-- Visual Sales Overview Chart -->
    <SalesOverview />

    <!-- Bottom Two Column Grid -->
    <section class="dashboard-bottom-grid" aria-label="Pesanan terbaru dan stok produk">
      <RecentOrders />
      <LowStockAlert />
    </section>
  </div>
</template>

<script setup>
import { h, ref, onMounted, computed } from 'vue';
import { useAdminAuthStore } from '../../stores/adminAuth.js';
import { adminService } from '../../services/adminService.js';
import StatCard from '../../components/admin/StatCard.vue';
import SalesOverview from '../../components/admin/SalesOverview.vue';
import RecentOrders from '../../components/admin/RecentOrders.vue';
import LowStockAlert from '../../components/admin/LowStockAlert.vue';

const adminAuthStore = useAdminAuthStore();
const adminName = computed(() => adminAuthStore.adminUser?.name || 'Admin');

const stats = ref({
  todayOrders: '28',
  todayRevenue: '₩1,240,000',
  pendingOrders: '4',
  completedOrders: '24'
});

onMounted(async () => {
  try {
    const report = await adminService.getTransactionReport({ period: 'today' });
    if (report && report.summary) {
      stats.value = {
        todayOrders: String(report.summary.totalOrders || 28),
        todayRevenue: report.summary.formattedRevenue || '₩1,240,000',
        pendingOrders: String(report.summary.pendingOrders || 4),
        completedOrders: String(report.summary.completedOrders || 24)
      };
    }
  } catch (err) {
    console.warn('Load dashboard metrics failed:', err);
  }
});

const OrderIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none' }, [
      h('rect', { x: '4', y: '5', width: '16', height: '15', rx: '2', stroke: 'currentColor', 'stroke-width': '1.8' }),
      h('path', { d: 'M8 5V3M16 5V3M8 10h8M8 14h5', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round' })
    ]);
  }
};

const RevenueIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none' }, [
      h('path', { d: 'M12 3V21', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round' }),
      h('path', { d: 'M16 7.5C16 5.8 14.3 5 12 5C9.7 5 8 5.9 8 7.5C8 9.1 9.4 9.8 12 10.5C14.6 11.2 16 11.9 16 13.7C16 15.6 14.3 17 12 17C9.7 17 8 16.2 8 14.5', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round' })
    ]);
  }
};

const PendingIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none' }, [
      h('circle', { cx: '12', cy: '12', r: '8', stroke: 'currentColor', 'stroke-width': '1.8' }),
      h('path', { d: 'M12 7v5l3 2', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
    ]);
  }
};

const CompletedIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none' }, [
      h('circle', { cx: '12', cy: '12', r: '8', stroke: 'currentColor', 'stroke-width': '1.8' }),
      h('path', { d: 'M8.5 12l2.5 2.5 5-5', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
    ]);
  }
};
</script>

<style scoped>
.dashboard-view {
  width: 100%;
}

.dashboard-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.dashboard-eyebrow {
  margin: 0 0 6px;
  color: var(--red);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.dashboard-title {
  margin: 0;
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(28px, 3.5vw, 36px);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.dashboard-description {
  max-width: 580px;
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.6;
}

.heading-quick-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quick-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  min-height: 42px;
  border-radius: var(--r-sm);
  border: 1px solid var(--line);
  background: var(--paper);
  color: var(--ink);
  font-size: 0.82rem;
  font-weight: 700;
  text-decoration: none;
  transition: all var(--ease);
}

.quick-btn:hover {
  border-color: var(--red);
  color: var(--red);
}

.primary-quick-btn {
  background: var(--red);
  color: #fff;
  border-color: var(--red);
}

.primary-quick-btn:hover {
  background: var(--red-dark);
  color: #fff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.dashboard-bottom-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(300px, 1fr);
  gap: 24px;
}

@media (max-width: 1120px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .dashboard-bottom-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 680px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .heading-quick-actions {
    width: 100%;
  }
  .quick-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>
