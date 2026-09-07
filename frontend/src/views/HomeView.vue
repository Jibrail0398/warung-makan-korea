<template>
  <div class="home-page">
    <AppHeader variant="default" />

    <main>
      <HeroSection />
      <PromoSection />
      <MenuSection
        :products="filteredProducts"
        :currentCategory="currentCategory"
        v-model:searchQuery="searchQuery"
        :isLoading="isLoading"
        :currentPage="pagination.currentPage"
        :lastPage="pagination.lastPage"
        @selectCategory="setCategory"
        @changePage="loadProducts"
        @resetFilters="resetFilters"
        @showToast="showToast"
      />
      <AboutSection />
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
import HeroSection from '../components/home/HeroSection.vue';
import PromoSection from '../components/home/PromoSection.vue';
import MenuSection from '../components/home/MenuSection.vue';
import AboutSection from '../components/home/AboutSection.vue';
import ToastNotification from '../components/common/ToastNotification.vue';
import { productService } from '../services/productsService.js';
import { useToast } from '../composables/useToast.js';

const allProducts = ref([]);
const currentCategory = ref('all');
const searchQuery = ref('');
const isLoading = ref(false);
const pagination = ref({ currentPage: 1, lastPage: 1, total: 0, perPage: 0 });

const { isToastVisible, toastMessage, showToast } = useToast();

let loadingTimer = null;

const filteredProducts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  return allProducts.value.filter(product => {
    const categoryMatch = currentCategory.value === 'all' || product.category === currentCategory.value;
    const searchMatch =
      !query ||
      (product.name + ' ' + (product.description || '')).toLowerCase().includes(query);
    return categoryMatch && searchMatch;
  });
});

function triggerFilterLoading() {
  isLoading.value = true;
  if (loadingTimer) clearTimeout(loadingTimer);
  loadingTimer = setTimeout(() => {
    isLoading.value = false;
  }, 220);
}

function setCategory(category) {
  currentCategory.value = category;
  triggerFilterLoading();
}

function resetFilters() {
  searchQuery.value = '';
  currentCategory.value = 'all';
  triggerFilterLoading();
}

async function loadProducts(page = 1) {
  isLoading.value = true;

  try {
    const result = await productService.getProducts(page);
    allProducts.value = result.products;
    pagination.value = result.pagination;
  } catch (error) {
    allProducts.value = [];
    showToast(error.message || 'Gagal memuat produk');
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => loadProducts());
</script>
