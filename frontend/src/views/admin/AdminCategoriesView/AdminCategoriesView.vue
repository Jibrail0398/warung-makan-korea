<template>
  <div class="categories-view">
    <header class="page-header">
      <div>
        <p class="page-eyebrow">STRUKTUR KATEGORI & MENU</p>
        <h1 class="page-title">Kelola Subkategori</h1>
        <p class="page-description">
          Setiap subkategori terhubung dengan satu <strong>Kategori Besar</strong> (<em>Restaurant Menu</em> atau <em>Raw Material</em>) untuk pengelompokan produk yang presisi.
        </p>
      </div>

      <div class="header-action-group">
        <router-link to="/admin/main-categories" class="btn-secondary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.8" />
          </svg>
          <span>Kategori Besar</span>
        </router-link>
        <button type="button" class="btn-primary" @click="openAddModal">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <span>Tambah Subkategori Baru</span>
        </button>
      </div>
    </header>

    <!-- Filter Bar: Parent Kategori Besar Tabs -->
    <div class="filter-bar">
      <div class="parent-filter-tabs" role="tablist">
        <button
          type="button"
          class="tab-btn"
          :class="{ active: selectedMainCatFilter === 'all' }"
          @click="selectedMainCatFilter = 'all'"
        >
          Semua Subkategori ({{ categories.length }})
        </button>
        <button
          type="button"
          class="tab-btn"
          :class="{ active: selectedMainCatFilter === 'restaurant' }"
          @click="selectedMainCatFilter = 'restaurant'"
        >
          Restaurant Menu ({{ countByMainCat(1) }})
        </button>
        <button
          type="button"
          class="tab-btn"
          :class="{ active: selectedMainCatFilter === 'raw' }"
          @click="selectedMainCatFilter = 'raw'"
        >
          Raw Material ({{ countByMainCat(2) }})
        </button>
      </div>

      <div class="search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cari subkategori..."
          class="search-input"
        />
      </div>
    </div>

    <!-- Categories Grid -->
    <div v-if="filteredCategoriesWithCount.length > 0" class="categories-grid">
      <article
        v-for="cat in filteredCategoriesWithCount"
        :key="cat.id"
        class="category-card"
      >
        <div class="card-top">
          <div class="parent-badge-group">
            <span class="parent-tag">Kategori Induk:</span>
            <span class="type-pill" :class="`type-${cat.type}`">
              {{ getMainCatName(cat.mainCategoryId || (cat.type === 'raw' ? 2 : 1)) }}
            </span>
          </div>

          <div class="card-actions">
            <button
              type="button"
              class="icon-action-btn"
              title="Edit Subkategori"
              @click="openEditModal(cat)"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              </svg>
            </button>
            <button
              type="button"
              class="icon-action-btn delete"
              title="Hapus Subkategori"
              @click="confirmDelete(cat)"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <h3 class="category-name">{{ cat.name }}</h3>
        <p class="category-desc">{{ cat.description || 'Tidak ada deskripsi spesifik.' }}</p>

        <div class="card-footer">
          <span class="product-count-badge">
            <strong>{{ cat.productCount }}</strong> Produk Terhubung
          </span>
          <span class="slug-text">/{{ cat.slug }}</span>
        </div>
      </article>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state-box">
      <p>Tidak ada subkategori yang sesuai dengan filter pencarian.</p>
    </div>

    <!-- Category Modal (Add / Edit) -->
    <CategoryModal
      :isOpen="isModalOpen"
      :isEdit="isEditMode"
      :initialData="selectedCategory"
      :mainCategories="mainCategories"
      @close="isModalOpen = false"
      @save="handleSaveCategory"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="categoryToDelete" class="modal-backdrop" @click.self="categoryToDelete = null">
      <div class="confirm-dialog">
        <h3 class="dialog-title">Hapus Subkategori</h3>
        <p class="dialog-desc">
          Apakah Anda yakin ingin menghapus subkategori <strong>"{{ categoryToDelete.name }}"</strong>?
          <template v-if="categoryToDelete.productCount > 0">
            <br /><br />
            <span class="warning-text">
              Peringatan: Subkategori ini memiliki {{ categoryToDelete.productCount }} produk yang masih terhubung.
            </span>
          </template>
        </p>
        <div class="dialog-actions">
          <button type="button" class="btn-cancel" @click="categoryToDelete = null">Batal</button>
          <button type="button" class="btn-danger" @click="executeDelete">Hapus Subkategori</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminCategoriesScript from './AdminCategories.js';

export default {
  ...AdminCategoriesScript
};
</script>
