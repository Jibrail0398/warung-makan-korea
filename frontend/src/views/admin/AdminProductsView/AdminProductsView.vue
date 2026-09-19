<template>
  <div class="products-view">
    <!-- Page Header -->
    <header class="page-header">
      <div>
        <h1 class="page-title">Kelola Produk</h1>
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
      <div class="filter-controls">
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

        <div class="filter-dropdowns">
          <select v-model="selectedSubcatFilter" class="filter-select subcat-filter">
            <option value="all">Semua Kategori</option>
            <option v-for="sc in availableSubcategories" :key="sc.id" :value="sc.id">
              {{ sc.name }}
            </option>
          </select>

          <select v-model="statusFilter" class="filter-select status-filter">
            <option value="all">Semua Status</option>
            <option value="Available">Aktif</option>
            <option value="Sold Out">Tidak Aktif</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Desktop Product Table -->
    <div class="table-container">
      <table class="product-table">
        <thead>
          <tr>
            <th scope="col" class="col-thumb">Foto</th>
            <th scope="col">Nama Produk</th>
            <th scope="col">Deskripsi</th>
            <th scope="col">Kategori</th>
            <th scope="col">Harga</th>
            <th scope="col">Status</th>
            <th scope="col" class="col-actions">Aksi</th>
          </tr>
        </thead>
        <tbody v-if="isPageLoading">
          <tr>
            <td colspan="7" class="empty-state-row">
              <LoadingSpinner size="md" color="primary" text="Memuat data produk..." center />
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="products.length > 0">
          <tr v-for="product in products" :key="product.id">
            <td class="col-thumb">
              <div class="product-img-box">
                <img :src="product.image" :alt="product.name" @error="handleImgError($event)" />
              </div>
            </td>
            <td>
              <strong>{{ product.name }}</strong>
            </td>
            <td>
              <small class="product-desc-snippet">{{ product.description }}</small>
            </td>
            <td>
              <span class="type-pill" :class="`type-${product.categorySlug}`">
                {{ product.category }}
              </span>
            </td>
            <td>
              <span class="product-price">{{ product.price }}</span>
            </td>
            <td>
              <span
                class="status-toggle-btn"
                :class="product.status === 'Available' ? 'status-avail' : 'status-sold'"
              >
                <span class="status-dot"></span>
                <span>{{ product.status === 'Available' ? 'Aktif' : 'Tidak Aktif' }}</span>
              </span>
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
            <td colspan="7" class="empty-state-row">
              <div class="empty-box">
                <p>Tidak ada produk yang sesuai dengan kriteria pencarian.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <nav v-if="pagination.lastPage > 1" class="pagination-nav" aria-label="Navigasi halaman produk">
      <button
        type="button"
        class="page-btn"
        :disabled="pagination.currentPage === 1 || isPageLoading"
        @click="changePage(pagination.currentPage - 1)"
      >
        ← Prev
      </button>

      <span v-if="getPageNumbers[0] > 1" class="page-ellipsis">…</span>
      <button
        v-for="p in getPageNumbers"
        :key="p"
        type="button"
        class="page-btn"
        :class="{ active: p === pagination.currentPage }"
        :disabled="isPageLoading"
        @click="changePage(p)"
      >
        {{ p }}
      </button>
      <span v-if="getPageNumbers[getPageNumbers.length - 1] < pagination.lastPage" class="page-ellipsis">…</span>

      <button
        type="button"
        class="page-btn"
        :disabled="pagination.currentPage === pagination.lastPage || isPageLoading"
        @click="changePage(pagination.currentPage + 1)"
      >
        Next →
      </button>
    </nav>
    <p class="pagination-info" v-if="pagination.total > 0">
      Menampilkan halaman {{ pagination.currentPage }} dari {{ pagination.lastPage }} ({{ pagination.total }} produk)
    </p>

    <!-- Mobile Product Cards List -->
    <div class="mobile-product-cards">
      <div v-if="isPageLoading" class="mobile-loading">
        <LoadingSpinner size="md" color="primary" text="Memuat data produk..." center />
      </div>
      <template v-else-if="products.length > 0">
        <article
          v-for="product in products"
          :key="`m-${product.id}`"
          class="mobile-card"
        >
          <div class="m-card-top">
            <div class="m-thumb">
              <img :src="product.image" :alt="product.name" @error="handleImgError($event)" />
            </div>
            <div class="m-details">
              <div class="m-tags-row">
                <span class="type-pill" :class="`type-${product.categorySlug}`">
                  {{ product.category }}
                </span>
                <span
                  class="status-toggle-btn"
                  :class="product.status === 'Available' ? 'status-avail' : 'status-sold'"
                >
                  <span class="status-dot"></span>
                  {{ product.status === 'Available' ? 'Aktif' : 'Tidak Aktif' }}
                </span>
              </div>
              <h3 class="m-name">{{ product.name }}</h3>
              <small class="product-desc-snippet">{{ product.description }}</small>
              <span class="product-price">{{ product.price }}</span>
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
      </template>
      <div v-else class="empty-box">
        <p>Tidak ada produk yang sesuai dengan kriteria pencarian.</p>
      </div>
    </div>

    <!-- Pagination (Mobile) -->
    <nav v-if="pagination.lastPage > 1" class="pagination-nav pagination-nav-mobile" aria-label="Navigasi halaman produk">
      <button
        type="button"
        class="page-btn"
        :disabled="pagination.currentPage === 1 || isPageLoading"
        @click="changePage(pagination.currentPage - 1)"
      >
        ← Prev
      </button>
      <span class="page-compact">Hal. {{ pagination.currentPage }} / {{ pagination.lastPage }}</span>
      <button
        type="button"
        class="page-btn"
        :disabled="pagination.currentPage === pagination.lastPage || isPageLoading"
        @click="changePage(pagination.currentPage + 1)"
      >
        Next →
      </button>
    </nav>

    <!-- Product Modal (Add / Edit) -->
    <ProductModal
      :isOpen="isModalOpen"
      :isEdit="isEditMode"
      :isSaving="isSaving"
      :initialData="selectedProduct"
      :categories="categories"
      @close="isModalOpen = false"
      @save="handleSaveProduct"
    />

    <!-- Delete Confirmation Modal -->
    <Transition name="modal-fade">
      <div v-if="productToDelete" class="modal-backdrop" @click.self="!isDeleting && (productToDelete = null)">
        <div class="confirm-dialog confirm-card">
          <h3 class="dialog-title">Konfirmasi Hapus Produk</h3>
          <p class="dialog-desc">
            Apakah anda yakin akan menghapus data ini <strong>"{{ productToDelete.name }}"</strong>?
          </p>
          <div class="dialog-actions">
            <button type="button" class="btn-cancel" :disabled="isDeleting" @click="productToDelete = null">Tidak</button>
            <button type="button" class="btn-danger" :disabled="isDeleting" @click="executeDelete">
              <LoadingSpinner v-if="isDeleting" size="sm" color="white" text="Menghapus..." inline />
              <span v-else>Ya</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Status Notification Modal -->
    <Transition name="modal-fade">
      <div v-if="notificationModal.isOpen" class="modal-backdrop" @click.self="closeNotification">
        <div class="confirm-dialog confirm-card">
          <h3 class="dialog-title" :class="notificationModal.isSuccess ? 'text-success' : 'text-danger'">
            {{ notificationModal.isSuccess ? 'Berhasil' : 'Gagal' }}
          </h3>
          <p class="dialog-desc">{{ notificationModal.message }}</p>
          <div class="dialog-actions">
            <button type="button" class="btn-primary" @click="closeNotification">Tutup</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner.vue';
import AdminProductsScript from './AdminProducts.js';

export default {
  ...AdminProductsScript,
  components: {
    LoadingSpinner,
    ...AdminProductsScript.components
  }
};
</script>
