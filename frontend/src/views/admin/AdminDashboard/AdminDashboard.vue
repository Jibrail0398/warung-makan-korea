<template>
  <div class="dashboard-page">
    <header class="dashboard-heading">
      <p class="dashboard-eyebrow">
        Aneka Rasa Restoran
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

<script>
import AdminDashboardScript from './AdminDashboard.js';

export default {
  ...AdminDashboardScript
};
</script>
