<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="modal-backdrop" @click.self="!isSaving && !isSubmitting && $emit('close')">
      <div class="modal-card" role="dialog" aria-modal="true" :aria-labelledby="isEdit ? 'editMainCatTitle' : 'addMainCatTitle'">
        <div class="modal-header">
          <div>
            <h2 id="addMainCatTitle" class="modal-title">
              {{ isEdit ? 'Edit Kategori' : 'Tambah Kategori' }}
            </h2>
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
          <div v-if="errorMessage" class="error-alert">
            {{ errorMessage }}
          </div>

          <div class="form-grid">
            <div class="form-group full-width">
              <label class="form-label required">Nama Kategori</label>
              <input
                type="text"
                v-model="formData.name"
                class="form-input"
                :class="{ 'input-error': formErrors.name }"
                placeholder="Contoh: makanan jawa"
                :disabled="isSaving || isSubmitting"
                @input="formErrors.name = ''"
                required
              />
              <small v-if="formErrors.name" class="field-error">{{ formErrors.name }}</small>
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
                :text="isEdit ? 'Menyimpan Perubahan...' : 'Menambahkan Kategori...'"
                inline
              />
              <span v-else>{{ isEdit ? 'Simpan Perubahan' : 'Tambah Kategori' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script>
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner.vue';
import MainCategoryModalScript from './MainCategoryModal.js';

export default {
  components: {
    LoadingSpinner
  },
  ...MainCategoryModalScript
};
</script>
