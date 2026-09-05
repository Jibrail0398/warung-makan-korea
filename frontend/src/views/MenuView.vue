<template>
  <div class="menu-page">
    <AppHeader variant="default" />

    <main class="menu-main">
      <div class="container">
        <!-- Page Header -->
        <header class="page-heading-row">
          <div>
            <span class="eyebrow">Our complete selection</span>
            <h1 class="page-title">All Menu &amp; Products</h1>
          </div>
          <p class="page-copy">
            Explore our complete offering of freshly prepared Indonesian restaurant dishes and authentic cooking ingredients in Korea.
          </p>
        </header>

        <!-- Search & Filter Controls -->
        <div class="menu-controls">
          <label class="search-box" for="allMenuSearch">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.7" />
              <path d="m16 16 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
            </svg>
            <span class="sr-only">Search all products</span>
            <input
              id="allMenuSearch"
              v-model="searchQuery"
              type="search"
              placeholder="Search food or ingredients..."
              autocomplete="off"
            />
          </label>

          <div class="category-tabs" role="group" aria-label="Product categories">
            <button
              type="button"
              :class="{ active: currentCategory === 'all' }"
              :aria-pressed="currentCategory === 'all'"
              @click="setCategory('all')"
            >
              All ({{ allCount }})
            </button>
            <button
              type="button"
              :class="{ active: currentCategory === 'restaurant' }"
              :aria-pressed="currentCategory === 'restaurant'"
              @click="setCategory('restaurant')"
            >
              Restaurant Menu ({{ restaurantCount }})
            </button>
            <button
              type="button"
              :class="{ active: currentCategory === 'raw' }"
              :aria-pressed="currentCategory === 'raw'"
              @click="setCategory('raw')"
            >
              Raw Material ({{ rawCount }})
            </button>
          </div>
        </div>

        <!-- Subcategories Pills Row -->
        <div v-if="availableSubcategories.length > 0" class="subcategories-filter-row">
          <button
            type="button"
            class="subcat-chip-btn"
            :class="{ active: currentSubcategory === 'all' }"
            @click="setSubcategory('all')"
          >
            All Subcategories
          </button>
          <button
            v-for="sub in availableSubcategories"
            :key="sub.id"
            type="button"
            class="subcat-chip-btn"
            :class="{ active: currentSubcategory === sub.id }"
            @click="setSubcategory(sub.id)"
          >
            {{ sub.name }}
          </button>
        </div>

        <!-- Product Grid Area -->
        <div aria-live="polite" :aria-busy="isLoading">
          <!-- Loading skeleton -->
          <div v-if="isLoading" class="skeleton-grid" aria-label="Loading products">
            <div v-for="n in 8" :key="n" class="skeleton-card" aria-hidden="true">
              <div class="skeleton-image"></div>
              <div class="skeleton-copy"></div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredProducts.length === 0" class="empty-state">
            <div class="empty-state-inner">
              <span class="empty-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M3 6h18M16 10a4 4 0 0 1-8 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <h3>No products found</h3>
              <p>Try searching for a different dish, ingredient, or select another category.</p>
              <button class="btn-primary" type="button" @click="resetFilters">
                Reset Filters
              </button>
            </div>
          </div>

          <!-- Product Grid -->
          <div v-else>
            <div class="products-count-bar">
              <span>Showing <strong>{{ filteredProducts.length }}</strong> products</span>
            </div>

            <div class="product-grid">
              <MenuCard
                v-for="product in filteredProducts"
                :key="product.id"
                :product="product"
                :quantity="cartStore.getQuantity(product.id)"
                @select="handleSelectProduct"
                @increase="handleIncrease"
                @decrease="handleDecrease"
              />
            </div>
          </div>
        </div>

        <!-- Cart shortcut banner when cart has items -->
        <div v-if="cartStore.cartCount > 0" class="cart-floating-banner">
          <div class="floating-banner-inner">
            <div class="banner-info">
              <span class="banner-count">{{ cartStore.cartCount }} item{{ cartStore.cartCount > 1 ? 's' : '' }}</span>
              <strong class="banner-total">{{ formatPrice(cartStore.totalPrice) }}</strong>
            </div>
            <router-link to="/cart" class="btn-cart">
              View Cart &amp; Checkout
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />

    <ToastNotification
      :visible="isToastVisible"
      :message="toastMessage"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AppHeader from '../components/layout/AppHeader.vue';
import AppFooter from '../components/layout/AppFooter.vue';
import MenuCard from '../components/common/MenuCard.vue';
import ToastNotification from '../components/common/ToastNotification.vue';
import { menuService } from '../services/menuService.js';
import { useCartStore } from '../stores/cart.js';
import { useToast } from '../composables/useToast.js';

const cartStore = useCartStore();
const { isToastVisible, toastMessage, showToast } = useToast();

const allProducts = ref([]);
const subcategories = ref([]);
const currentCategory = ref('all');
const currentSubcategory = ref('all');
const searchQuery = ref('');
const isLoading = ref(false);
let filterTimer = null;

const allCount = computed(() => allProducts.value.length);
const restaurantCount = computed(
  () => allProducts.value.filter(p => p.category === 'restaurant' || p.mainCategoryId === 1).length
);
const rawCount = computed(
  () => allProducts.value.filter(p => p.category === 'raw' || p.mainCategoryId === 2).length
);

const availableSubcategories = computed(() => {
  if (currentCategory.value === 'all') return subcategories.value;
  const targetMainId = currentCategory.value === 'restaurant' ? 1 : 2;
  return subcategories.value.filter(s => {
    if (s.mainCategoryId) return Number(s.mainCategoryId) === targetMainId;
    return currentCategory.value === 'restaurant' ? s.type === 'restaurant' : s.type === 'raw';
  });
});

const filteredProducts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  return allProducts.value.filter(product => {
    let categoryMatch = true;
    if (currentCategory.value === 'restaurant') {
      categoryMatch = product.category === 'restaurant' || product.mainCategoryId === 1;
    } else if (currentCategory.value === 'raw') {
      categoryMatch = product.category === 'raw' || product.mainCategoryId === 2;
    }

    let subcatMatch = true;
    if (currentSubcategory.value !== 'all') {
      subcatMatch = String(product.subcategoryId || product.categoryId) === String(currentSubcategory.value);
    }

    const searchMatch =
      !query ||
      (product.name + ' ' + (product.description || '')).toLowerCase().includes(query);

    return categoryMatch && subcatMatch && searchMatch;
  });
});

function triggerFilterLoading() {
  isLoading.value = true;
  if (filterTimer) clearTimeout(filterTimer);
  filterTimer = setTimeout(() => {
    isLoading.value = false;
  }, 180);
}

function setCategory(category) {
  currentCategory.value = category;
  currentSubcategory.value = 'all';
  triggerFilterLoading();
}

function setSubcategory(subId) {
  currentSubcategory.value = subId;
  triggerFilterLoading();
}

function resetFilters() {
  searchQuery.value = '';
  currentCategory.value = 'all';
  currentSubcategory.value = 'all';
  triggerFilterLoading();
}

function handleSelectProduct(id) {
  const found = allProducts.value.find(p => p.id === id);
  if (found) {
    showToast(`${found.name} selected`);
  }
}

function handleIncrease(product) {
  const currentQty = cartStore.getQuantity(product.id);
  cartStore.increaseQuantity(product);
  showToast(
    currentQty === 0
      ? `${product.name} added to cart`
      : `${product.name} quantity increased`
  );
}

function handleDecrease(product) {
  const currentQty = cartStore.getQuantity(product.id);
  cartStore.decreaseQuantity(product);
  if (currentQty <= 1) {
    showToast(`${product.name} removed from cart`);
  } else {
    showToast(`${product.name} quantity decreased`);
  }
}

function formatPrice(price) {
  if (typeof price === 'string' && price.startsWith('₩')) return price;
  const num = Number(price) || 0;
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0
  }).format(num);
}

onMounted(async () => {
  isLoading.value = true;
  try {
    const [pList, scList] = await Promise.all([
      menuService.getProducts(),
      menuService.getSubcategories()
    ]);
    allProducts.value = pList;
    subcategories.value = scList;
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.menu-page {
  min-height: 100vh;
  background: var(--paper);
  color: var(--ink);
}

.menu-main {
  padding: 58px 0 90px;
}

.page-heading-row {
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

.page-title {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 500;
  letter-spacing: -.045em;
  line-height: 1.08;
}

.page-copy {
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.6;
}

.page-heading-row .page-copy {
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
  flex-shrink: 0;
}

.search-box input {
  width: 100%;
  height: 100%;
  border: 0;
  background: transparent;
  outline: 0;
  color: var(--ink);
  font-size: 0.9rem;
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

.subcategories-filter-row {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 12px;
  margin-top: -12px;
  margin-bottom: 24px;
}

.subcat-chip-btn {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid var(--line);
  background: #ffffff;
  color: var(--ink);
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: all var(--ease);
}

.subcat-chip-btn:hover {
  border-color: var(--red);
  color: var(--red);
}

.subcat-chip-btn.active {
  background: var(--ink);
  color: #ffffff;
  border-color: var(--ink);
}

.products-count-bar {
  margin-bottom: 18px;
  color: var(--muted);
  font-size: 0.82rem;
}

.products-count-bar strong {
  color: var(--ink);
}

.product-grid, .skeleton-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;
}

.empty-state {
  display: grid;
  min-height: 320px;
  place-items: center;
  padding: 50px 20px;
  border: 1px dashed #d6cec7;
  border-radius: var(--r-md);
  background: var(--soft);
  text-align: center;
}

.empty-state-inner {
  max-width: 360px;
}

.empty-icon {
  display: grid;
  width: 54px;
  height: 54px;
  place-items: center;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: #fff;
  color: var(--red);
  box-shadow: 0 4px 14px rgba(0, 0, 0, .05);
}

.empty-state h3 {
  margin-bottom: 8px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.5rem;
  font-weight: 500;
}

.empty-state p {
  margin-bottom: 22px;
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.5;
}

.btn-primary {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  border-radius: var(--r-sm);
  background: var(--red);
  color: #fff;
  font-size: .86rem;
  font-weight: 780;
  letter-spacing: .02em;
  text-transform: uppercase;
  transition: background var(--ease), transform var(--ease);
}

.btn-primary:hover {
  background: #8f1827;
  transform: translateY(-1px);
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

.cart-floating-banner {
  position: sticky;
  bottom: 24px;
  z-index: 30;
  margin-top: 40px;
}

.floating-banner-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 16px 22px;
  border-radius: var(--r-md);
  background: var(--ink);
  color: #fff;
  box-shadow: 0 12px 36px rgba(25, 21, 18, 0.22);
}

.banner-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.banner-count {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
  font-size: 0.78rem;
  font-weight: 700;
}

.banner-total {
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
}

.btn-cart {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 18px;
  border-radius: var(--r-sm);
  background: var(--red);
  color: #fff;
  font-size: 0.84rem;
  font-weight: 780;
  transition: background var(--ease);
}

.btn-cart:hover {
  background: #8f1827;
}

@media (max-width: 1040px) {
  .product-grid, .skeleton-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .page-heading-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .page-heading-row .page-copy {
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
  .menu-main {
    padding: 38px 0 60px;
  }
  .page-heading-row {
    margin-bottom: 24px;
  }
  .category-tabs {
    width: 100%;
  }
  .category-tabs button {
    flex: 1;
    min-height: 40px;
    padding: 0 10px;
    font-size: 0.76rem;
  }
  .product-grid, .skeleton-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .floating-banner-inner {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 14px 16px;
  }
  .btn-cart {
    justify-content: center;
  }
}
</style>
