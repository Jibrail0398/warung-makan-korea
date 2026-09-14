<template>
  <section class="stock-card" aria-labelledby="lowStockTitle">
    <div class="section-header"><div><p class="section-eyebrow">Inventory</p><h2 id="lowStockTitle" class="section-title">Low stock alert</h2></div><RouterLink to="/admin/products" class="view-link">View products <span aria-hidden="true">→</span></RouterLink></div>
    <div class="stock-list">
      <article v-for="product in lowStockProducts" :key="product.name" class="stock-item">
        <div class="stock-product"><span class="product-name">{{ product.name }}</span><span class="stock-description">{{ product.stock }} items remaining</span></div>
        <div class="stock-number" :aria-label="`${product.stock} items remaining`">{{ product.stock }}</div>
      </article>
    </div>
  </section>
</template>

<script>
export default {
  name: 'LowStockAlert',
  setup() {
    const lowStockProducts = [{ name: 'Beras Pandan', stock: 4 }, { name: 'Kecap Manis', stock: 6 }, { name: 'Kerupuk Udang', stock: 3 }];
    return { lowStockProducts };
  }
};
</script>
