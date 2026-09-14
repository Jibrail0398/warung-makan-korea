<template>
  <section class="menu-section" id="menu" aria-labelledby="menuTitle">
    <div class="container">
      <div class="menu-heading-row">
        <div>
          <span class="eyebrow">Our selection</span>
          <h2 class="section-title" id="menuTitle">Order from our menu</h2>
        </div>
        
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

      </div>
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

      <nav v-if="lastPage > 1" class="pagination" aria-label="Product pagination">
        <button
          type="button"
          :disabled="currentPage === 1"
          @click="$emit('changePage', currentPage - 1)"
        >
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ lastPage }}</span>
        <button
          type="button"
          :disabled="currentPage === lastPage"
          @click="$emit('changePage', currentPage + 1)"
        >
          Next
        </button>
      </nav>

      <div class="view-all-row">
        
      </div>
    </div>
  </section>
</template>

<script>
import MenuCard from '../../common/MenuCard.vue';
import MenuSectionScript from './MenuSection.js';
import "./MenuSection.css";

export default {
  ...MenuSectionScript,
  components: {
    ...MenuSectionScript.components,
    MenuCard
  }
};
</script>
