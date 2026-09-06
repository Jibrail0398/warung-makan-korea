<template>
  <div class="dashboard-page">
    <header class="dashboard-heading">
      <p class="dashboard-eyebrow">
        Warung Nusantara
      </p>

      <h1 class="dashboard-title">
        Dashboard
      </h1>

      <p class="dashboard-description">
        Welcome back, Admin.
        Here's what's happening with your store today.
      </p>
    </header>

    <section
      class="stats-grid"
      aria-label="Today's store statistics"
    >
      <StatCard
        label="Orders today"
        value="24"
        trend="+12.5%"
        description="vs yesterday"
        tone="red"
        :icon="OrderIcon"
      />

      <StatCard
        label="Revenue"
        value="₩1,240,000"
        trend="+8.4%"
        description="vs yesterday"
        tone="red"
        :icon="RevenueIcon"
      />

      <StatCard
        label="Pending orders"
        value="8"
        description="Needs attention"
        tone="warm"
        :icon="PendingIcon"
      />

      <StatCard
        label="Completed orders"
        value="16"
        trend="+4"
        description="today"
        tone="success"
        :icon="CompletedIcon"
      />
    </section>

    <SalesOverview />

    <section
      class="dashboard-bottom-grid"
      aria-label="Orders and inventory"
    >
      <RecentOrders />

      <LowStockAlert />
    </section>
  </div>
</template>

<script setup>
import { h } from 'vue'

import StatCard from '@/components/admin/StatCard.vue'
import SalesOverview from '@/components/admin/SalesOverview.vue'
import RecentOrders from '@/components/admin/RecentOrders.vue'
import LowStockAlert from '@/components/admin/LowStockAlert.vue'

const OrderIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none'
      },
      [
        h('rect', {
          x: '4',
          y: '5',
          width: '16',
          height: '15',
          rx: '2',
          stroke: 'currentColor',
          'stroke-width': '1.8'
        }),
        h('path', {
          d: 'M8 5V3',
          stroke: 'currentColor',
          'stroke-width': '1.8',
          'stroke-linecap': 'round'
        }),
        h('path', {
          d: 'M16 5V3',
          stroke: 'currentColor',
          'stroke-width': '1.8',
          'stroke-linecap': 'round'
        }),
        h('path', {
          d: 'M8 10H16',
          stroke: 'currentColor',
          'stroke-width': '1.8',
          'stroke-linecap': 'round'
        }),
        h('path', {
          d: 'M8 14H13',
          stroke: 'currentColor',
          'stroke-width': '1.8',
          'stroke-linecap': 'round'
        })
      ]
    )
  }
}

const RevenueIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none'
      },
      [
        h('path', {
          d: 'M12 3V21',
          stroke: 'currentColor',
          'stroke-width': '1.8',
          'stroke-linecap': 'round'
        }),
        h('path', {
          d: 'M16 7.5C16 5.8 14.3 5 12 5C9.7 5 8 5.9 8 7.5C8 9.1 9.4 9.8 12 10.5C14.6 11.2 16 11.9 16 13.7C16 15.6 14.3 17 12 17C9.7 17 8 16.2 8 14.5',
          stroke: 'currentColor',
          'stroke-width': '1.8',
          'stroke-linecap': 'round'
        })
      ]
    )
  }
}

const PendingIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none'
      },
      [
        h('circle', {
          cx: '12',
          cy: '12',
          r: '8',
          stroke: 'currentColor',
          'stroke-width': '1.8'
        }),
        h('path', {
          d: 'M12 7V12L15 14',
          stroke: 'currentColor',
          'stroke-width': '1.8',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round'
        })
      ]
    )
  }
}

const CompletedIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none'
      },
      [
        h('circle', {
          cx: '12',
          cy: '12',
          r: '8',
          stroke: 'currentColor',
          'stroke-width': '1.8'
        }),
        h('path', {
          d: 'M8.5 12L11 14.5L16 9.5',
          stroke: 'currentColor',
          'stroke-width': '1.8',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round'
        })
      ]
    )
  }
}
</script>

<style scoped>
.dashboard-page {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

.dashboard-heading {
  margin-bottom: 28px;
}

.dashboard-eyebrow {
  margin: 0 0 7px;
  color: var(--red);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.dashboard-title {
  margin: 0;
  color: var(--ink);
  font-family:
    Georgia,
    "Times New Roman",
    serif;
  font-size: clamp(30px, 4vw, 40px);
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 1.1;
}

.dashboard-description {
  max-width: 560px;
  margin: 9px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.65;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.dashboard-bottom-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  gap: 24px;
  margin-top: 24px;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-bottom-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 860px) {
  .dashboard-heading {
    margin-bottom: 22px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }

  .dashboard-bottom-grid {
    gap: 20px;
    margin-top: 20px;
  }
}

@media (max-width: 480px) {
  .dashboard-title {
    font-size: 30px;
  }

  .dashboard-description {
    font-size: 12px;
  }
}
</style>