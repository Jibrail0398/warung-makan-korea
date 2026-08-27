<template>
  <section class="menu-section" id="menu" aria-labelledby="menuTitle">
    <div class="container">
      <div class="menu-heading-row">
        <div>
          <span class="eyebrow">Our selection</span>
          <h2 class="section-title" id="menuTitle">Order from our menu</h2>
        </div>
        <p class="section-copy">Discover ready-to-enjoy dishes and pantry essentials selected for an authentic Indonesian table.</p>
      </div>

      <div class="menu-controls">
        <label class="search-box" for="searchInput">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.7" />
            <path d="m16 16 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
          </svg>
          <span class="sr-only">Search products</span>
          <input
            id="searchInput"
            type="search"
            :value="searchQuery"
            @input="$emit('update:searchQuery', $event.target.value)"
            placeholder="Search food or ingredients..."
            autocomplete="off"
          />
        </label>

        <div class="category-tabs" id="categoryTabs" role="group" aria-label="Product categories">
          <button
            type="button"
            :class="{ active: currentCategory === 'all' }"
            :aria-pressed="currentCategory === 'all'"
            @click="$emit('selectCategory', 'all')"
          >
            All
          </button>
          <button
            type="button"
            :class="{ active: currentCategory === 'restaurant' }"
            :aria-pressed="currentCategory === 'restaurant'"
            @click="$emit('selectCategory', 'restaurant')"
          >
            Restaurant Menu
          </button>
          <button
            type="button"
            :class="{ active: currentCategory === 'raw' }"
            :aria-pressed="currentCategory === 'raw'"
            @click="$emit('selectCategory', 'raw')"
          >
            Raw Material
          </button>
        </div>
      </div>

      <div id="productGridContainer" aria-live="polite" :aria-busy="isLoading">
        <div v-if="isLoading" class="skeleton-grid" aria-label="Loading products">
          <div v-for="n in 4" :key="n" class="skeleton-card" aria-hidden="true">
            <div class="skeleton-image"></div>
            <div class="skeleton-copy"></div>
          </div>
        </div>

        <div v-else-if="products.length === 0" class="empty-state">
          <div class="empty-state-inner">
            <h3>No products found</h3>
            <p>Try another search term or choose a different category.</p>
            <button class="btn-primary" type="button" @click="$emit('resetFilters')">View all products</button>
          </div>
        </div>

        <div v-else class="product-grid">
          <MenuCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            :quantity="cartStore.getQuantity(product.id)"
            @select="navigateToProduct"
            @increase="handleIncrease"
            @decrease="handleDecrease"
          />
        </div>
      </div>

      <div class="view-all-row">
        <router-link class="text-link" to="/menu">
          View all products
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useCartStore } from '../../stores/cart.js';
import MenuCard from '../common/MenuCard.vue';

const props = defineProps({
  products: {
    type: Array,
    default: () => []
  },
  currentCategory: {
    type: String,
    default: 'all'
  },
  searchQuery: {
    type: String,
    default: ''
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'update:searchQuery',
  'selectCategory',
  'resetFilters',
  'showToast'
]);

const cartStore = useCartStore();

function navigateToProduct(id) {
  window.location.href = `/products/${id}`;
}

function handleIncrease(product) {
  const currentQty = cartStore.getQuantity(product.id);
  cartStore.increaseQuantity(product);
  emit(
    'showToast',
    currentQty === 0
      ? `${product.name} added to cart`
      : `${product.name} quantity increased`
  );
}

function handleDecrease(product) {
  const currentQty = cartStore.getQuantity(product.id);
  cartStore.decreaseQuantity(product);
  if (currentQty <= 1) {
    emit('showToast', `${product.name} removed from cart`);
  } else {
    emit('showToast', `${product.name} quantity decreased`);
  }
}
</script>

<style scoped>
.menu-section {
  padding: 78px 0 72px;
}

.menu-heading-row {
  display: grid;
  grid-template-columns: 1fr minmax(280px, 430px);
  align-items: end;
  gap: 40px;
  margin-bottom: 34px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  color: var(--red);
  font-size: .76rem;
  font-weight: 800;
  letter-spacing: .14em;
  line-height: 1;
  text-transform: uppercase;
}

.eyebrow::before {
  width: 28px;
  height: 2px;
  background: currentColor;
  content: "";
}

.section-title {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 500;
  letter-spacing: -.045em;
  line-height: 1.08;
}

.section-copy {
  color: var(--muted);
}

.menu-heading-row .section-copy {
  justify-self: end;
  max-width: 410px;
}

.menu-controls {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) auto;
  gap: 16px;
  align-items: center;
  margin-bottom: 28px;
}

.search-box {
  display: flex;
  height: 52px;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--paper);
  transition: border-color var(--ease), box-shadow var(--ease);
}

.search-box:focus-within {
  border-color: var(--red);
  box-shadow: 0 0 0 4px rgba(165, 29, 45, .08);
}

.search-box svg {
  color: #7d756f;
}

.search-box input {
  width: 100%;
  height: 100%;
  border: 0;
  background: transparent;
  outline: 0;
}

.category-tabs {
  display: flex;
  padding: 4px;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: var(--soft);
}

.category-tabs button {
  min-height: 42px;
  padding: 0 17px;
  border-radius: var(--r-sm);
  color: var(--muted);
  font-size: .84rem;
  font-weight: 700;
  white-space: nowrap;
  transition: color var(--ease), background var(--ease), box-shadow var(--ease);
}

.category-tabs button:hover {
  color: var(--red);
}

.category-tabs button.active {
  background: #fff;
  color: var(--red);
  box-shadow: 0 3px 12px rgba(36, 25, 18, .08);
}

.product-grid, .skeleton-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;
}

.empty-state {
  display: grid;
  min-height: 280px;
  place-items: center;
  padding: 40px 20px;
  border: 1px dashed #d6cec7;
  border-radius: var(--r-md);
  background: var(--soft);
  text-align: center;
}

.empty-state-inner {
  max-width: 340px;
}

.empty-state h3 {
  margin-bottom: 6px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.5rem;
  font-weight: 500;
}

.empty-state p {
  margin-bottom: 20px;
  color: var(--muted);
}

.btn-primary {
  display: inline-flex;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  border-radius: var(--r-sm);
  background: var(--red);
  color: #fff;
  font-size: .88rem;
  font-weight: 780;
  text-transform: uppercase;
}

.skeleton-card {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: var(--soft);
}

.skeleton-image {
  aspect-ratio: 1 / 1;
  background: #ebe5df;
}

.skeleton-copy {
  height: 88px;
  margin: 17px;
  border-radius: 8px;
  background: #ebe5df;
}

.skeleton-image, .skeleton-copy {
  animation: pulse 1.1s ease-in-out infinite alternate;
}

@keyframes pulse {
  from { opacity: .52; }
  to { opacity: 1; }
}

.view-all-row {
  display: flex;
  justify-content: center;
  margin-top: 38px;
}

.text-link {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding-bottom: 3px;
  border-bottom: 1px solid var(--ink);
  font-size: .88rem;
  font-weight: 750;
  transition: color var(--ease), border-color var(--ease), gap var(--ease);
}

.text-link:hover {
  gap: 13px;
  border-color: var(--red);
  color: var(--red);
}

@media (max-width: 1040px) {
  .product-grid, .skeleton-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .menu-heading-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .menu-heading-row .section-copy {
    justify-self: start;
  }
  .menu-controls {
    grid-template-columns: 1fr;
  }
  .category-tabs {
    width: max-content;
    max-width: 100%;
    overflow-x: auto;
  }
}

@media (max-width: 640px) {
  .menu-section {
    padding: 58px 0;
  }
  .menu-heading-row {
    margin-bottom: 26px;
  }
  .category-tabs {
    width: 100%;
  }
  .category-tabs button {
    flex: 0 0 auto;
    min-height: 40px;
    padding: 0 14px;
  }
  .product-grid, .skeleton-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
}
</style>
