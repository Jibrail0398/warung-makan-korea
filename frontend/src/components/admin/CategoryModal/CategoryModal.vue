<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="!isSaving && !isSubmitting && $emit('close')">
    <div class="modal-card" role="dialog" aria-modal="true" :aria-labelledby="isEdit ? 'editCatTitle' : 'addCatTitle'">
      <div class="modal-header">
        <div>
          <p class="modal-eyebrow">STRUKTUR SUBKATEGORI</p>
          <h2 id="addCatTitle" class="modal-title">{{ isEdit ? 'Edit Subkategori' : 'Tambah Subkategori Baru' }}</h2>
        </div>
        <button
          type="button"
          class="close-btn"
          aria-label="Tutup modal"
          :disabled="isSaving || isSubmitting"
          @click="$emit('close')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body" novalidate>
        <div v-if="errorMessage" class="error-alert">{{ errorMessage }}</div>

        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label required">Kategori Besar (Induk / Parent)</label>
            <select
              v-model="formData.mainCategoryId"
              class="form-select"
              :class="{ 'input-error': formErrors.mainCategoryId }"
              :disabled="isSaving || isSubmitting"
              @change="handleMainCatChange"
              required
            >
              <option :value="1">Restaurant Menu</option>
              <option :value="2">Raw Material</option>
              <option v-for="mc in customMainCategories" :key="mc.id" :value="mc.id">{{ mc.name }}</option>
            </select>
            <small v-if="formErrors.mainCategoryId" class="field-error">{{ formErrors.mainCategoryId }}</small>
            <small class="form-hint">Pilih apakah subkategori ini masuk ke dalam Menu Restoran atau Bahan Mentah.</small>
          </div>

          <div class="form-group full-width">
            <label class="form-label required">Nama Subkategori</label>
            <input
              type="text"
              v-model="formData.name"
              class="form-input"
              :class="{ 'input-error': formErrors.name }"
              placeholder="Contoh: Makanan Utama, Bumbu Racikan, Minuman"
              :disabled="isSaving || isSubmitting"
              @input="formErrors.name = ''"
              required
            />
            <small v-if="formErrors.name" class="field-error">{{ formErrors.name }}</small>
          </div>

          <div class="form-group full-width">
            <label class="form-label">Deskripsi Subkategori</label>
            <textarea
              v-model="formData.description"
              class="form-textarea"
              rows="3"
              placeholder="Jelaskan jenis makanan atau bahan yang termasuk dalam subkategori ini..."
              :disabled="isSaving || isSubmitting"
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn-cancel"
            :disabled="isSaving || isSubmitting"
            @click="$emit('close')"
          >
            Batal
          </button>
          <button
            type="submit"
            class="btn-submit"
            :disabled="isSaving || isSubmitting"
          >
            <LoadingSpinner
              v-if="isSaving || isSubmitting"
              size="sm"
              color="white"
              :text="isEdit ? 'Menyimpan...' : 'Menambahkan Subkategori...'"
              inline
            />
            <span v-else>{{ isEdit ? 'Simpan Perubahan' : 'Tambah Subkategori' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner.vue';
import CategoryModalScript from './CategoryModal.js';

export default {
  components: {
    LoadingSpinner
  },
  ...CategoryModalScript
};
</script>
