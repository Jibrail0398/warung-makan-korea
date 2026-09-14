<template>
  <div class="main-categories-view">
    <header class="page-header">
      <div>
        <p class="page-eyebrow">DAFTAR KATEGORI</p>
        <h1 class="page-title">Kelola Kategori</h1>
        <p class="page-description">
          Daftar seluruh kategori menu yang tersedia pada sistem.
        </p>
      </div>

      <button type="button" class="btn-primary" @click="openAddModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span>Tambah Kategori</span>
      </button>
    </header>

    <!-- Categories Table / List -->
    <div class="categories-table-container">
      <table class="categories-table">
        <thead>
          <tr>
            <th>Nama Kategori</th>
            <th class="actions-col">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in mainCategories" :key="cat.id">
            <td><strong>{{ cat.name }}</strong></td>
            <td class="actions-col">
              <button
                type="button"
                class="icon-action-btn"
                title="Edit Kategori"
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
                title="Hapus Kategori"
                @click="confirmDelete(cat)"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="mainCategories.length === 0">
            <td colspan="2" class="empty-row">Belum ada kategori.</td>
          </tr>
        </tbody>
      </table>
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
        <h3 class="dialog-title">Hapus Kategori</h3>
        <p class="dialog-desc">
          Peringatan Jika kategori ini dihapus semua data produk yang berkategori <strong>{{ categoryToDelete.name }}</strong> akan ikut terhapus
        </p>
        <div class="dialog-actions">
          <button type="button" class="btn-cancel" @click="categoryToDelete = null">Batal</button>
          <button type="button" class="btn-danger" @click="executeDelete">Hapus</button>
        </div>
      </div>
    </div>

    <!-- Edit Confirmation Modal -->
    <div v-if="categoryToUpdate" class="modal-backdrop" @click.self="categoryToUpdate = null">
      <div class="confirm-dialog">
        <h3 class="dialog-title">Konfirmasi Perubahan</h3>
        <p class="dialog-desc">
          Apakah Anda yakin ingin memperbarui kategori menjadi <strong>"{{ categoryToUpdate.name }}"</strong>?
        </p>
        <div class="dialog-actions">
          <button type="button" class="btn-cancel" @click="categoryToUpdate = null">Batal</button>
          <button type="button" class="btn-primary" @click="executeUpdate">Simpan</button>
        </div>
      </div>
    </div>

    <!-- Notification Modal -->
    <div v-if="notificationModal.isOpen" class="modal-backdrop" @click.self="closeNotification">
      <div class="confirm-dialog">
        <h3 class="dialog-title" :class="notificationModal.isSuccess ? 'text-success' : 'text-danger'">
          {{ notificationModal.isSuccess ? 'Berhasil' : 'Gagal' }}
        </h3>
        <p class="dialog-desc">
          {{ notificationModal.message }}
        </p>
        <div class="dialog-actions">
          <button type="button" class="btn-primary" @click="closeNotification">Tutup</button>
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
