<template>
  <div class="main-categories-view">
    <header class="page-header">
      <div>
        <p class="page-eyebrow">STRUKTUR UTAMA PRODUK</p>
        <h1 class="page-title">Kelola Kategori Besar</h1>
        <p class="page-description">
          Pengelompokan level tertinggi sistem: <strong>Restaurant Menu</strong> dan <strong>Raw Material</strong> sebagai induk (parent) dari seluruh subkategori dan produk.
        </p>
      </div>

      <button type="button" class="btn-primary" @click="openAddModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span>Tambah Kategori Besar</span>
      </button>
    </header>

    <!-- Main Categories Grid -->
    <div class="categories-grid">
      <article
        v-for="cat in mainCategoriesWithCounts"
        :key="cat.id"
        class="category-card"
      >
        <div class="card-top">
          <span class="type-pill" :class="cat.id === 1 || cat.code === 'restaurant' ? 'type-restaurant' : 'type-raw'">
            {{ cat.code === 'restaurant' || cat.id === 1 ? 'RESTAURANT PARENT' : 'RAW MATERIAL PARENT' }}
          </span>

          <div class="card-actions">
            <button
              type="button"
              class="icon-action-btn"
              title="Edit Kategori Besar"
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
              title="Hapus Kategori Besar"
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
        <p class="category-desc">{{ cat.description || 'Kategori induk utama untuk pengelompokan produk.' }}</p>

        <!-- Subcategories snippet under this main category -->
        <div class="subcategories-snippet">
          <span class="snippet-label">Subkategori Terdaftar:</span>
          <div class="subcategories-pills">
            <span
              v-for="sub in getSubcategoriesFor(cat.id)"
              :key="sub.id"
              class="subcat-chip"
            >
              {{ sub.name }}
            </span>
            <span v-if="getSubcategoriesFor(cat.id).length === 0" class="empty-chip">
              Belum ada subkategori
            </span>
          </div>
        </div>

        <div class="card-footer">
          <div class="footer-stats">
            <span class="stat-badge">
              <strong>{{ cat.subcategoryCount }}</strong> Subkategori
            </span>
            <span class="stat-badge">
              <strong>{{ cat.productCount }}</strong> Produk
            </span>
          </div>
          <router-link to="/admin/categories" class="manage-subcat-link">
            Kelola Subkategori →
          </router-link>
        </div>
      </article>
    </div>

    <!-- Main Category Modal (Add / Edit) -->
    <MainCategoryModal
      :isOpen="isModalOpen"
      :isEdit="isEditMode"
      :initialData="selectedCategory"
      @close="isModalOpen = false"
      @save="handleSaveMainCategory"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="categoryToDelete" class="modal-backdrop" @click.self="categoryToDelete = null">
      <div class="confirm-dialog">
        <h3 class="dialog-title">Hapus Kategori Besar</h3>
        <p class="dialog-desc">
          Apakah Anda yakin ingin menghapus Kategori Besar <strong>"{{ categoryToDelete.name }}"</strong>?
          <template v-if="categoryToDelete.subcategoryCount > 0 || categoryToDelete.productCount > 0">
            <br /><br />
            <span class="warning-text">
              Peringatan: Kategori besar ini menaungi {{ categoryToDelete.subcategoryCount }} subkategori dan {{ categoryToDelete.productCount }} produk.
            </span>
          </template>
        </p>
        <div class="dialog-actions">
          <button type="button" class="btn-cancel" @click="categoryToDelete = null">Batal</button>
          <button type="button" class="btn-danger" @click="executeDelete">Hapus Kategori Besar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminMainCategoriesScript from './AdminMainCategories.js';

export default {
  ...AdminMainCategoriesScript
};
</script>
