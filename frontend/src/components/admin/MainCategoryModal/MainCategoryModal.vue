<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card" role="dialog" aria-modal="true" :aria-labelledby="isEdit ? 'editMainCatTitle' : 'addMainCatTitle'">
      <div class="modal-header">
        <div>
          <p class="modal-eyebrow">STRUKTUR KATEGORI PARENT</p>
          <h2 id="addMainCatTitle" class="modal-title">
            {{ isEdit ? 'Edit Kategori Besar' : 'Tambah Kategori Besar' }}
          </h2>
        </div>
        <button type="button" class="close-btn" aria-label="Tutup modal" @click="$emit('close')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body" novalidate>
        <div v-if="errorMessage" class="error-alert">
          {{ errorMessage }}
        </div>

        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label required">Nama Kategori Besar</label>
            <input
              type="text"
              v-model="formData.name"
              class="form-input"
              placeholder="Contoh: Restaurant Menu atau Raw Material"
              required
            />
          </div>

          <div class="form-group full-width">
            <label class="form-label required">Kode Identifikasi</label>
            <input
              type="text"
              v-model="formData.code"
              class="form-input"
              placeholder="Contoh: restaurant / raw"
              required
            />
            <small class="form-hint">Digunakan oleh sistem untuk membedakan alur dapur dan inventaris mentah.</small>
          </div>

          <div class="form-group full-width">
            <label class="form-label">Deskripsi Kategori Besar</label>
            <textarea
              v-model="formData.description"
              class="form-textarea"
              rows="3"
              placeholder="Jelaskan cakupan kelompok kategori besar ini..."
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click="$emit('close')">
            Batal
          </button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Kategori Besar') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import MainCategoryModalScript from './MainCategoryModal.js';

export default {
  ...MainCategoryModalScript
};
</script>
