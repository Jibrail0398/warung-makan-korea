<template>
  <div class="products-view">
    <!-- Page Header -->
    <header class="page-header">
      <div>
        <p class="page-eyebrow">KATALOG & INVENTARIS</p>
        <h1 class="page-title">Kelola Produk</h1>
        <p class="page-description">
          Daftar seluruh menu siap saji restoran dan bahan baku (raw material) yang tersedia.
        </p>
      </div>

      <button type="button" class="btn-primary" @click="openAddModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span>Tambah Produk Baru</span>
      </button>
    </header>

    <!-- Filter & Search Bar -->
    <section class="filter-section">
      <!-- Tabs: All / Restaurant / Raw Material -->
      <div class="category-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          class="tab-btn"
          :class="{ active: selectedTab === 'all' }"
          @click="selectedTab = 'all'"
        >
          Semua ({{ products.length }})
        </button>
        <button
          type="button"
          role="tab"
          class="tab-btn"
          :class="{ active: selectedTab === 'restaurant' }"
          @click="selectedTab = 'restaurant'"
        >
          Restaurant Menu ({{ countByType('restaurant') }})
        </button>
        <button
          type="button"
          role="tab"
          class="tab-btn"
          :class="{ active: selectedTab === 'raw' }"
          @click="selectedTab = 'raw'"
        >
          Raw Material ({{ countByType('raw') }})
        </button>
      </div>

      <!-- Search & Status Controls -->
      <div class="filter-controls">
        <select v-model="selectedSubcatFilter" class="filter-select subcat-filter">
          <option value="all">Semua Subkategori</option>
          <option v-for="sc in availableSubcategories" :key="sc.id" :value="sc.id">
            {{ sc.name }}
          </option>
        </select>

        <div class="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Cari nama produk..."
            class="search-input"
          />
        </div>

        <select v-model="statusFilter" class="filter-select">
          <option value="all">Semua Status</option>
          <option value="Available">Tersedia</option>
          <option value="Sold Out">Habis (Sold Out)</option>
        </select>
      </div>
    </section>

    <!-- Desktop Product Table -->
    <div class="table-container">
      <table class="product-table">
        <thead>
          <tr>
            <th scope="col" class="col-thumb">Foto</th>
            <th scope="col">Nama Produk</th>
            <th scope="col">Kategori Besar</th>
            <th scope="col">Subkategori</th>
            <th scope="col">Harga</th>
            <th scope="col">Satuan</th>
            <th scope="col">Stok</th>
            <th scope="col">Status</th>
            <th scope="col" class="col-actions">Aksi</th>
          </tr>
        </thead>
        <tbody v-if="filteredProducts.length > 0">
          <tr v-for="product in filteredProducts" :key="product.id">
            <td class="col-thumb">
              <div class="product-img-box">
                <img :src="product.image" :alt="product.name" @error="handleImgError($event)" />
              </div>
            </td>
            <td>
              <div class="product-cell-name">
                <strong>{{ product.name }}</strong>
                <small class="product-desc-snippet">{{ product.description }}</small>
              </div>
            </td>
            <td>
              <span class="type-pill" :class="`type-${product.category}`">
                {{ product.category === 'restaurant' || product.mainCategoryId === 1 ? 'Restaurant Menu' : 'Raw Material' }}
              </span>
            </td>
            <td>
              <span class="subcat-badge">
                {{ getSubcatName(product.subcategoryId || product.categoryId) }}
              </span>
            </td>
            <td>
              <span class="product-price">{{ product.price || `₩${(product.numericPrice || 0).toLocaleString('ko-KR')}` }}</span>
            </td>
            <td>
              <span class="unit-text">{{ product.unit || (product.category === 'raw' ? '1 bungkus' : '1 porsi') }}</span>
            </td>
            <td>
              <span class="stock-badge" :class="{ 'low-stock': (product.stock || 0) <= 5 }">
                {{ product.stock }} pcs
              </span>
            </td>
            <td>
              <button
                type="button"
                class="status-toggle-btn"
                :class="product.status === 'Available' ? 'status-avail' : 'status-sold'"
                @click="toggleStatus(product)"
                title="Klik untuk ubah status ketersediaan"
              >
                <span class="status-dot"></span>
                <span>{{ product.status === 'Available' ? 'Tersedia' : 'Habis' }}</span>
              </button>
            </td>
            <td class="col-actions">
              <div class="action-btns">
                <button
                  type="button"
                  class="action-btn edit-btn"
                  title="Edit Produk"
                  @click="openEditModal(product)"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  class="action-btn delete-btn"
                  title="Hapus Produk"
                  @click="confirmDelete(product)"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                  </svg>
                  <span>Hapus</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="9" class="empty-state-row">
              <div class="empty-box">
                <p>Tidak ada produk yang sesuai dengan kriteria pencarian.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Product Cards List -->
    <div class="mobile-product-cards">
      <article
        v-for="product in filteredProducts"
        :key="`m-${product.id}`"
        class="mobile-card"
      >
        <div class="m-card-top">
          <div class="m-thumb">
            <img :src="product.image" :alt="product.name" @error="handleImgError($event)" />
          </div>
          <div class="m-details">
            <div class="m-tags-row">
              <span class="type-pill" :class="`type-${product.category}`">
                {{ product.category === 'restaurant' ? 'Restoran' : 'Raw Material' }}
              </span>
              <span class="subcat-badge">
                {{ getSubcatName(product.subcategoryId || product.categoryId) }}
              </span>
            </div>
            <h3 class="m-name">{{ product.name }}</h3>
            <span class="product-price">{{ product.price || `₩${(product.numericPrice || 0).toLocaleString('ko-KR')}` }}</span>
          </div>
        </div>

        <div class="m-card-meta">
          <div class="meta-item">
            <span>Stok:</span>
            <strong :class="{ 'low-stock': (product.stock || 0) <= 5 }">{{ product.stock }} pcs</strong>
          </div>
          <div class="meta-item">
            <span>Status:</span>
            <span :class="product.status === 'Available' ? 'text-avail' : 'text-sold'">
              {{ product.status === 'Available' ? 'Tersedia' : 'Habis' }}
            </span>
          </div>
        </div>

        <div class="m-card-actions">
          <button type="button" class="action-btn edit-btn" @click="openEditModal(product)">
            Edit
          </button>
          <button type="button" class="action-btn delete-btn" @click="confirmDelete(product)">
            Hapus
          </button>
        </div>
      </article>
    </div>

    <!-- Product Modal (Add / Edit) -->
    <ProductModal
      :isOpen="isModalOpen"
      :isEdit="isEditMode"
      :initialData="selectedProduct"
      :categories="categories"
      @close="isModalOpen = false"
      @save="handleSaveProduct"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="productToDelete" class="modal-backdrop" @click.self="productToDelete = null">
      <div class="confirm-dialog">
        <h3 class="dialog-title">Konfirmasi Hapus Produk</h3>
        <p class="dialog-desc">
          Apakah Anda yakin ingin menghapus produk <strong>"{{ productToDelete.name }}"</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div class="dialog-actions">
          <button type="button" class="btn-cancel" @click="productToDelete = null">Batal</button>
          <button type="button" class="btn-danger" @click="executeDelete">Ya, Hapus Produk</button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <ToastNotification
      :visible="isToastVisible"
      :message="toastMessage"
      :type="toastType"
    />
  </div>
</template>

<script>
import AdminProductsScript from './AdminProducts.js';
import ToastNotification from '../../../components/common/ToastNotification.vue';
import { useToast } from '../../../composables/useToast.js';

export default {
  ...AdminProductsScript,
  components: {
    ...AdminProductsScript.components,
    ToastNotification
  },
  setup() {
    const parentReturn = AdminProductsScript.setup();
    const { isToastVisible, toastMessage, toastType } = useToast();
    return {
      ...parentReturn,
      isToastVisible,
      toastMessage,
      toastType
    };
  }
};
</script>

