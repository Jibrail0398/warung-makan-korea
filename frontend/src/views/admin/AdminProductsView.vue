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
      :mainCategories="mainCategories"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { adminService } from '../../services/adminService.js';
import ProductModal from '../../components/admin/ProductModal.vue';

const products = ref([]);
const mainCategories = ref([]);
const categories = ref([]);

const selectedTab = ref('all');
const selectedSubcatFilter = ref('all');
const searchQuery = ref('');
const statusFilter = ref('all');

const isModalOpen = ref(false);
const isEditMode = ref(false);
const selectedProduct = ref(null);
const productToDelete = ref(null);

const loadData = async () => {
  try {
    const [pList, mcList, cList] = await Promise.all([
      adminService.getProducts(),
      adminService.getMainCategories(),
      adminService.getSubcategories()
    ]);
    products.value = pList;
    mainCategories.value = mcList;
    categories.value = cList;
  } catch (err) {
    console.error('Failed to load products data:', err);
  }
};

onMounted(() => {
  loadData();
});

const countByType = (type) => {
  return products.value.filter(p => {
    if (p.mainCategoryId) return type === 'restaurant' ? p.mainCategoryId === 1 : p.mainCategoryId === 2;
    return p.category === type;
  }).length;
};

const availableSubcategories = computed(() => {
  if (selectedTab.value === 'all') return categories.value;
  const targetMainId = selectedTab.value === 'restaurant' ? 1 : 2;
  return categories.value.filter(sc => {
    if (sc.mainCategoryId) return Number(sc.mainCategoryId) === targetMainId;
    return selectedTab.value === 'restaurant' ? sc.type === 'restaurant' : sc.type === 'raw';
  });
});

const getSubcatName = (subcatId) => {
  const found = categories.value.find(c => Number(c.id) === Number(subcatId));
  return found?.name || 'General';
};

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    // Kategori Besar Tab Filter
    let tabMatch = selectedTab.value === 'all';
    if (!tabMatch) {
      if (selectedTab.value === 'restaurant') {
        tabMatch = product.category === 'restaurant' || product.mainCategoryId === 1;
      } else if (selectedTab.value === 'raw') {
        tabMatch = product.category === 'raw' || product.mainCategoryId === 2;
      }
    }

    // Subkategori Dropdown Filter
    let subcatMatch = selectedSubcatFilter.value === 'all';
    if (!subcatMatch) {
      subcatMatch = String(product.subcategoryId || product.categoryId) === String(selectedSubcatFilter.value);
    }

    // Search query
    const q = searchQuery.value.trim().toLowerCase();
    const searchMatch = !q || (product.name + ' ' + (product.description || '')).toLowerCase().includes(q);

    // Status filter
    const statusMatch = statusFilter.value === 'all' || product.status === statusFilter.value;

    return tabMatch && subcatMatch && searchMatch && statusMatch;
  });
});

const openAddModal = () => {
  isEditMode.value = false;
  selectedProduct.value = null;
  isModalOpen.value = true;
};

const openEditModal = (product) => {
  isEditMode.value = true;
  selectedProduct.value = { ...product };
  isModalOpen.value = true;
};

const handleSaveProduct = async (productData) => {
  if (isEditMode.value && selectedProduct.value) {
    await adminService.updateProduct(selectedProduct.value.id, productData);
  } else {
    await adminService.createProduct(productData);
  }
  isModalOpen.value = false;
  await loadData();
};

const toggleStatus = async (product) => {
  await adminService.toggleProductStatus(product.id);
  await loadData();
};

const confirmDelete = (product) => {
  productToDelete.value = product;
};

const executeDelete = async () => {
  if (!productToDelete.value) return;
  await adminService.deleteProduct(productToDelete.value.id);
  productToDelete.value = null;
  await loadData();
};

const handleImgError = (event) => {
  event.target.src = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600';
};
</script>

<style scoped>
.products-view {
  width: 100%;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.page-eyebrow {
  margin: 0 0 6px;
  color: var(--red);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.page-title {
  margin: 0;
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(26px, 3.2vw, 34px);
  font-weight: 500;
  letter-spacing: -0.03em;
}

.page-description {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 0.86rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 18px;
  border-radius: var(--r-sm);
  background: var(--red);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 750;
  cursor: pointer;
  transition: all var(--ease);
}

.btn-primary:hover {
  background: var(--red-dark);
}

.filter-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.category-tabs {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px;
  border-radius: var(--r-sm);
  background: var(--soft);
  border: 1px solid var(--line);
}

.tab-btn {
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--muted);
  cursor: pointer;
  transition: all var(--ease);
}

.tab-btn.active {
  background: #fff;
  color: var(--ink);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box svg {
  position: absolute;
  left: 12px;
  color: var(--muted);
}

.search-input {
  width: 220px;
  height: 38px;
  padding: 0 12px 0 36px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: #fff;
  font-size: 0.82rem;
  outline: none;
}

.search-input:focus {
  border-color: var(--red);
}

.filter-select {
  height: 38px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: #fff;
  font-size: 0.82rem;
  color: var(--ink);
  outline: none;
}

.table-container {
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(36, 25, 18, 0.04);
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.product-table th {
  padding: 12px 18px;
  background: var(--soft);
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--line);
}

.product-table td {
  padding: 14px 18px;
  border-bottom: 1px solid var(--line);
  font-size: 0.84rem;
  vertical-align: middle;
}

.product-table tbody tr:last-child td {
  border-bottom: none;
}

.product-table tbody tr:hover {
  background: rgba(247, 243, 239, 0.4);
}

.col-thumb {
  width: 64px;
}

.product-img-box {
  width: 48px;
  height: 48px;
  border-radius: var(--r-sm);
  overflow: hidden;
  border: 1px solid var(--line);
  background: var(--soft);
}

.product-img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-cell-name {
  display: flex;
  flex-direction: column;
}

.product-cell-name strong {
  font-size: 0.88rem;
  color: var(--ink);
}

.product-desc-snippet {
  color: var(--muted);
  font-size: 0.74rem;
  max-width: 260px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.type-pill {
  display: inline-flex;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 750;
}

.type-pill.type-restaurant {
  background: var(--red-soft);
  color: var(--red);
}

.type-pill.type-raw {
  background: var(--warm);
  color: #52473f;
}

.subcat-badge {
  display: inline-flex;
  padding: 3px 8px;
  border-radius: 4px;
  background: #ffffff;
  border: 1px solid var(--line);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--ink);
}

.m-tags-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.subcat-filter {
  min-width: 170px;
}

.product-price {
  font-weight: 750;
  color: var(--ink);
}

.unit-text {
  color: var(--muted);
  font-size: 0.8rem;
}

.stock-badge {
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.76rem;
  font-weight: 700;
  background: var(--soft);
  color: var(--ink);
}

.stock-badge.low-stock {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fca5a5;
}

.status-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--ease);
}

.status-avail {
  background: #edf7ee;
  color: var(--success);
  border: 1px solid rgba(36, 107, 71, 0.2);
}

.status-avail .status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--success);
}

.status-sold {
  background: var(--soft);
  color: var(--muted);
  border: 1px solid var(--line);
}

.status-sold .status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--muted);
}

.col-actions {
  text-align: right;
  width: 140px;
}

.action-btns {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--ease);
}

.edit-btn {
  border: 1px solid var(--line);
  color: var(--ink);
  background: #fff;
}

.edit-btn:hover {
  border-color: var(--red);
  color: var(--red);
}

.delete-btn {
  border: 1px solid transparent;
  color: var(--color-danger, #dc2626);
  background: transparent;
}

.delete-btn:hover {
  background: #fef2f2;
  border-color: #fca5a5;
}

.empty-box {
  padding: 40px;
  text-align: center;
  color: var(--muted);
}

.mobile-product-cards {
  display: none;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(25, 21, 18, 0.55);
  backdrop-filter: blur(3px);
  display: grid;
  place-items: center;
  z-index: 70;
  padding: 20px;
}

.confirm-dialog {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
}

.dialog-title {
  margin: 0 0 10px;
  font-size: 1.15rem;
  font-family: Georgia, "Times New Roman", serif;
  color: var(--ink);
}

.dialog-desc {
  margin: 0 0 20px;
  font-size: 0.86rem;
  color: var(--muted);
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel {
  padding: 8px 16px;
  border-radius: var(--r-sm);
  border: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-danger {
  padding: 8px 16px;
  border-radius: var(--r-sm);
  background: var(--color-danger, #dc2626);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 900px) {
  .table-container {
    display: none;
  }

  .mobile-product-cards {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .mobile-card {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 16px;
  }

  .m-card-top {
    display: flex;
    gap: 14px;
  }

  .m-thumb {
    width: 68px;
    height: 68px;
    border-radius: var(--r-sm);
    overflow: hidden;
    flex-shrink: 0;
    border: 1px solid var(--line);
  }

  .m-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .m-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .m-name {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 750;
  }

  .m-card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    margin-top: 12px;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    font-size: 0.8rem;
  }

  .meta-item {
    display: flex;
    gap: 6px;
  }

  .text-avail {
    color: var(--success);
    font-weight: 700;
  }

  .text-sold {
    color: var(--muted);
    font-weight: 700;
  }

  .m-card-actions {
    display: flex;
    gap: 10px;
    margin-top: 12px;
  }

  .m-card-actions .action-btn {
    flex: 1;
    justify-content: center;
    height: 36px;
  }
}
</style>
