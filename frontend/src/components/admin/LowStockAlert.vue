<template>
  <section
    class="stock-card"
    aria-labelledby="lowStockTitle"
  >
    <div class="section-header">
      <div>
        <p class="section-eyebrow">Inventory</p>

        <h2 id="lowStockTitle" class="section-title">
          Low stock alert
        </h2>
      </div>

      <RouterLink
        to="/admin/products"
        class="view-link"
      >
        View products
        <span aria-hidden="true">→</span>
      </RouterLink>
    </div>

    <div class="stock-list">
      <article
        v-for="product in lowStockProducts"
        :key="product.name"
        class="stock-item"
      >
        <div class="stock-product">
          <span class="product-name">
            {{ product.name }}
          </span>

          <span class="stock-description">
            {{ product.stock }} items remaining
          </span>
        </div>

        <div
          class="stock-number"
          :aria-label="`${product.stock} items remaining`"
        >
          {{ product.stock }}
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
const lowStockProducts = [
  {
    name: 'Beras Pandan',
    stock: 4
  },
  {
    name: 'Kecap Manis',
    stock: 6
  },
  {
    name: 'Kerupuk Udang',
    stock: 3
  }
]
</script>

<style scoped>
.stock-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--paper);
  box-shadow: 0 2px 10px rgba(36, 25, 18, 0.04);
}

.section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 22px 20px 18px;
}

.section-eyebrow {
  margin: 0 0 5px;
  color: var(--muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.section-title {
  margin: 0;
  color: var(--ink);
  font-family:
    Georgia,
    "Times New Roman",
    serif;
  font-size: 21px;
  font-weight: 600;
  letter-spacing: -0.025em;
}

.view-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--red);
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

.view-link:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.stock-list {
  border-top: 1px solid var(--line);
}

.stock-item {
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--line);
}

.stock-item:last-child {
  border-bottom: 0;
}

.stock-product {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.product-name {
  color: var(--ink);
  font-size: 12px;
  font-weight: 700;
}

.stock-description {
  margin-top: 4px;
  color: var(--muted);
  font-size: 10px;
}

.stock-number {
  min-width: 30px;
  color: var(--red);
  font-family:
    Georgia,
    "Times New Roman",
    serif;
  font-size: 22px;
  font-weight: 600;
  text-align: right;
}
</style>