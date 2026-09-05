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

<script setup>
import { ref, computed, onMounted } from 'vue';
import { adminService } from '../../services/adminService.js';
import MainCategoryModal from '../../components/admin/MainCategoryModal.vue';

const mainCategories = ref([]);
const subcategories = ref([]);
const products = ref([]);

const isModalOpen = ref(false);
const isEditMode = ref(false);
const selectedCategory = ref(null);
const categoryToDelete = ref(null);

const loadData = async () => {
  try {
    const [mcList, scList, pList] = await Promise.all([
      adminService.getMainCategories(),
      adminService.getSubcategories(),
      adminService.getProducts()
    ]);
    mainCategories.value = mcList;
    subcategories.value = scList;
    products.value = pList;
  } catch (err) {
    console.error('Failed to load main categories:', err);
  }
};

onMounted(() => {
  loadData();
});

const getSubcategoriesFor = (mainCatId) => {
  return subcategories.value.filter(sc => Number(sc.mainCategoryId) === Number(mainCatId));
};

const mainCategoriesWithCounts = computed(() => {
  return mainCategories.value.map(mc => {
    const subcats = subcategories.value.filter(sc => Number(sc.mainCategoryId) === Number(mc.id));
    const prodCount = products.value.filter(p => {
      if (p.mainCategoryId) return Number(p.mainCategoryId) === Number(mc.id);
      return mc.id === 1 ? p.category === 'restaurant' : p.category === 'raw';
    }).length;

    return {
      ...mc,
      subcategoryCount: subcats.length,
      productCount: prodCount
    };
  });
});

const openAddModal = () => {
  isEditMode.value = false;
  selectedCategory.value = null;
  isModalOpen.value = true;
};

const openEditModal = (cat) => {
  isEditMode.value = true;
  selectedCategory.value = { ...cat };
  isModalOpen.value = true;
};

const handleSaveMainCategory = async (catData) => {
  if (isEditMode.value && selectedCategory.value) {
    await adminService.updateMainCategory(selectedCategory.value.id, catData);
  } else {
    await adminService.createMainCategory(catData);
  }
  isModalOpen.value = false;
  await loadData();
};

const confirmDelete = (cat) => {
  categoryToDelete.value = cat;
};

const executeDelete = async () => {
  if (!categoryToDelete.value) return;
  await adminService.deleteMainCategory(categoryToDelete.value.id);
  categoryToDelete.value = null;
  await loadData();
};
</script>

<style scoped>
.main-categories-view {
  width: 100%;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
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
  max-width: 760px;
  line-height: 1.5;
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

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
}

.category-card {
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid var(--line);
  box-shadow: 0 2px 10px rgba(36, 25, 18, 0.04);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.type-pill {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.type-pill.type-restaurant {
  background: var(--red-soft);
  color: var(--red);
}

.type-pill.type-raw {
  background: var(--warm);
  color: #52473f;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon-action-btn {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 6px;
  color: var(--muted);
  background: transparent;
  cursor: pointer;
  transition: all var(--ease);
}

.icon-action-btn:hover {
  background: var(--soft);
  color: var(--ink);
}

.icon-action-btn.delete:hover {
  background: #fef2f2;
  color: #dc2626;
}

.category-name {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 750;
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
}

.category-desc {
  margin: 8px 0 16px;
  color: var(--muted);
  font-size: 0.84rem;
  line-height: 1.5;
}

.subcategories-snippet {
  margin-bottom: 18px;
  padding: 12px 14px;
  border-radius: var(--r-sm);
  background: var(--soft);
  border: 1px solid var(--line);
}

.snippet-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 750;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
}

.subcategories-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.subcat-chip {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  background: #fff;
  border: 1px solid var(--line);
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--ink);
}

.empty-chip {
  font-size: 0.74rem;
  color: var(--muted);
  font-style: italic;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid var(--line);
  font-size: 0.78rem;
  margin-top: auto;
}

.footer-stats {
  display: flex;
  gap: 12px;
}

.stat-badge {
  color: var(--muted);
}

.stat-badge strong {
  color: var(--ink);
}

.manage-subcat-link {
  font-size: 0.78rem;
  font-weight: 750;
  color: var(--red);
  text-decoration: none;
}

.manage-subcat-link:hover {
  text-decoration: underline;
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
  max-width: 440px;
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

.warning-text {
  color: #dc2626;
  font-weight: 600;
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
</style>
