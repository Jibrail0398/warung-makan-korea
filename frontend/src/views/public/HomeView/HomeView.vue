<template>
  <div class="home-page">
    <AppHeader variant="default" />
    <main>
      <HeroSection />
      <PromoSection />
      <MenuSection :products="filteredProducts" :currentCategory="currentCategory" :availableSubcategories="availableSubcategories" :currentSubcategory="currentSubcategory" v-model:searchQuery="searchQuery" :isLoading="isLoading" :currentPage="pagination.currentPage" :lastPage="pagination.lastPage" @selectCategory="setCategory" @update:currentSubcategory="setSubcategory" @changePage="loadProducts" @resetFilters="resetFilters" @showToast="showToast" />
      <AboutSection />
    </main>
    <AppFooter />
    <ToastNotification :visible="isToastVisible" :message="toastMessage" />
  </div>
</template>

<script>
import HomeViewScript from './HomeView.js';
export default { ...HomeViewScript };
</script>
