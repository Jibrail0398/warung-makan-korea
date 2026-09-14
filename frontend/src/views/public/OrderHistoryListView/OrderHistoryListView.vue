<template>
  <div class="order-history-page">
    <AppHeader variant="default" />
    <main class="order-history-main"><div class="container">
      <header class="page-heading"><div><p class="eyebrow">Your orders</p><h1>Order History</h1><p class="page-description">View your previous orders and their current status.</p></div></header>
      <section class="history-toolbar">
        <div class="search-wrapper"><label for="order-search" class="search-box"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.7" /><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" /></svg><span class="sr-only">Search orders</span><input id="order-search" v-model="searchQuery" type="search" placeholder="Search by order ID or product name..." autocomplete="off" /></label></div>
        <div class="filter-buttons" role="group" aria-label="Filter orders by status"><button v-for="filter in filters" :key="filter.value" type="button" :class="{ active: activeFilter === filter.value }" :aria-pressed="activeFilter === filter.value" @click="setFilter(filter.value)">{{ filter.label }}</button></div>
      </section>
      <section class="orders-list" aria-live="polite" :aria-busy="isLoading">
        <div v-if="isLoading" class="skeleton-list"><div v-for="n in 3" :key="n" class="skeleton-order-card"><div class="skeleton-line skeleton-header"></div><div class="skeleton-line skeleton-body"></div><div class="skeleton-line skeleton-footer"></div></div></div>
        <div v-else-if="filteredOrders.length"><OrderCard v-for="order in filteredOrders" :key="order.id" :order="order" @view="handleViewOrder" /></div>
        <div v-else class="empty-state"><div class="empty-state-inner"><span class="empty-icon" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg></span><h2>No orders found</h2><p v-if="searchQuery || activeFilter !== 'all'">We could not find any orders matching your filters.</p><p v-else>You have not placed any orders yet. Discover our delicious Indonesian menu and raw materials.</p><div class="empty-actions"><button v-if="searchQuery || activeFilter !== 'all'" type="button" class="btn-secondary" @click="resetFilters">Reset Filters</button><router-link to="/menu" class="btn-primary">Browse Menu</router-link></div></div></div>
      </section>
    </div></main>
    <AppFooter />
  </div>
</template>

<script>
import OrderHistoryListScript from './OrderHistoryListView.js';
export default { ...OrderHistoryListScript };
</script>
