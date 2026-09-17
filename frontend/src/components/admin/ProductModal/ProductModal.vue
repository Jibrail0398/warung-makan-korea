<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="!isSaving && !isSubmitting && $emit('close')">
    <div class="modal-card" role="dialog" aria-modal="true" :aria-labelledby="isEdit ? 'editProductTitle' : 'addProductTitle'">
      <div class="modal-header">
        <div>
          <p class="modal-eyebrow">KELOLA PRODUK</p>
          <h2 id="addProductTitle" class="modal-title">{{ isEdit ? 'Edit Produk' : 'Tambah Produk Baru' }}</h2>
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
            <label class="form-label">Foto Produk</label>
            <div class="image-uploader-row">
              <div class="preview-box">
                <img v-if="imagePreviewUrl" :src="imagePreviewUrl" alt="Preview produk" />
                <div v-else class="empty-preview">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8" />
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                    <polyline points="21 15 16 10 5 21" stroke="currentColor" stroke-width="1.8" />
                  </svg>
                  <span>No Image</span>
                </div>
              </div>
              <div class="image-input-col">
                <input
                  type="file"
                  ref="fileInputRef"
                  accept="image/jpeg,image/png"
                  class="form-input form-file-input"
                  :disabled="isSaving || isSubmitting"
                  @change="handleFileChange"
                />
                <small class="form-hint">Format: JPG, PNG. Maks 2MB.</small>
              </div>
            </div>
          </div>

          <div class="form-group full-width">
            <label class="form-label required">Nama Produk</label>
            <input
              type="text"
              v-model="formData.name"
              class="form-input"
              placeholder="Contoh: Nasi Goreng Kimchi, Tteokbokki"
              :disabled="isSaving || isSubmitting"
              required
            />
          </div>

          <div class="form-group full-width">
            <label class="form-label required">Kategori</label>
            <select
              v-model="formData.categoryId"
              class="form-select"
              :disabled="isSaving || isSubmitting"
              required
            >
              <option :value="null" disabled>Pilih kategori...</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label required">Harga (KRW / ₩)</label>
            <div class="input-prefix-wrapper">
              <span class="prefix">₩</span>
              <input
                type="number"
                v-model.number="formData.price"
                class="form-input with-prefix"
                placeholder="15000"
                min="0"
                step="500"
                :disabled="isSaving || isSubmitting"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Satuan / Porsi / Berat</label>
            <input
              type="text"
              v-model="formData.weightOrUnit"
              class="form-input"
              placeholder="Contoh: 1 porsi, 500 gr, 1 botol"
              :disabled="isSaving || isSubmitting"
            />
          </div>

          <div class="form-group full-width">
            <label class="form-label required">Status Aktif</label>
            <select
              v-model="formData.isActive"
              class="form-select"
              :disabled="isSaving || isSubmitting"
            >
              <option :value="true">Aktif</option>
              <option :value="false">Nonaktif</option>
            </select>
          </div>

          <div class="form-group full-width">
            <label class="form-label">Deskripsi / Keterangan Produk</label>
            <textarea
              v-model="formData.description"
              class="form-textarea"
              rows="3"
              placeholder="Tuliskan keterangan rasa, bahan, atau cara penyajian..."
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
              :text="isEdit ? 'Menyimpan Perubahan...' : 'Menambahkan Produk...'"
              inline
            />
            <span v-else>{{ isEdit ? 'Simpan Perubahan' : 'Tambah Produk' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner.vue';
import ProductModalScript from './ProductModal.js';

export default {
  components: {
    LoadingSpinner
  },
  ...ProductModalScript
};
</script>
