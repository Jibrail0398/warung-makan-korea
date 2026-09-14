<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card" role="dialog" aria-modal="true" :aria-labelledby="isEdit ? 'editProductTitle' : 'addProductTitle'">
      <div class="modal-header">
        <div>
          <p class="modal-eyebrow">KELOLA PRODUK</p>
          <h2 id="addProductTitle" class="modal-title">
            {{ isEdit ? 'Edit Produk' : 'Tambah Produk Baru' }}
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
          <!-- Image Preview & File Input -->
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
                  @change="handleFileChange"
                />
                <small class="form-hint">Format: JPG, PNG. Maks 2MB.</small>
              </div>
            </div>
          </div>

          <!-- Product Name -->
          <div class="form-group full-width">
            <label class="form-label required">Nama Produk</label>
            <input
              type="text"
              v-model="formData.name"
              class="form-input"
              placeholder="Contoh: Nasi Goreng Kimchi, Tteokbokki"
              required
            />
          </div>

          <!-- Category (Kategori) Selection -->
          <div class="form-group full-width">
            <label class="form-label required">Kategori</label>
            <select v-model="formData.categoryId" class="form-select" required>
              <option :value="null" disabled>Pilih kategori...</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <!-- Price -->
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
                required
              />
            </div>
          </div>

          <!-- Unit / Weight -->
          <div class="form-group">
            <label class="form-label">Satuan / Porsi / Berat</label>
            <input
              type="text"
              v-model="formData.weightOrUnit"
              class="form-input"
              placeholder="Contoh: 1 porsi, 500 gr, 1 botol"
            />
          </div>

          <!-- Active Status -->
          <div class="form-group">
            <label class="form-label required">Status Aktif</label>
            <select v-model="formData.isActive" class="form-select">
              <option :value="true">Aktif</option>
              <option :value="false">Nonaktif</option>
            </select>
          </div>

          <!-- Description -->
          <div class="form-group full-width">
            <label class="form-label">Deskripsi / Keterangan Produk</label>
            <textarea
              v-model="formData.description"
              class="form-textarea"
              rows="3"
              placeholder="Tuliskan keterangan rasa, bahan, atau cara penyajian..."
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click="$emit('close')">
            Batal
          </button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Produk') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  isEdit: Boolean,
  initialData: Object,
  categories: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'save']);

const isSubmitting = ref(false);
const errorMessage = ref('');
const fileInputRef = ref(null);
const selectedFile = ref(null);
const imagePreviewUrl = ref('');

const formData = reactive({
  name: '',
  categoryId: null,
  price: 0,
  weightOrUnit: '',
  isActive: true,
  description: ''
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    errorMessage.value = 'Ukuran gambar maksimal 2MB';
    event.target.value = '';
    return;
  }

  selectedFile.value = file;
  imagePreviewUrl.value = URL.createObjectURL(file);
};

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    formData.name = newVal.name || '';
    formData.categoryId = Number(newVal.categoryId || newVal.category_id) || null;
    formData.price = newVal.numericPrice !== undefined ? newVal.numericPrice : (Number(newVal.price) || 0);
    formData.weightOrUnit = newVal.weightOrUnit || newVal.weight_or_unit || '';
    formData.isActive = newVal.isActive !== undefined ? newVal.isActive : (newVal.is_active !== false);
    formData.description = newVal.description || '';
    imagePreviewUrl.value = newVal.image || '';
    selectedFile.value = null;
  } else {
    formData.name = '';
    formData.categoryId = null;
    formData.price = 0;
    formData.weightOrUnit = '';
    formData.isActive = true;
    formData.description = '';
    selectedFile.value = null;
    imagePreviewUrl.value = '';
    if (fileInputRef.value) fileInputRef.value.value = '';
  }
  errorMessage.value = '';
}, { immediate: true });

const handleSubmit = async () => {
  errorMessage.value = '';
  if (!formData.name.trim()) {
    errorMessage.value = 'Nama produk wajib diisi';
    return;
  }
  if (!formData.categoryId) {
    errorMessage.value = 'Kategori wajib dipilih';
    return;
  }
  if (!formData.price || formData.price < 0) {
    errorMessage.value = 'Harga produk harus valid';
    return;
  }

  isSubmitting.value = true;
  try {
    const fd = new FormData();
    fd.append('category_id', formData.categoryId);
    fd.append('name', formData.name);
    fd.append('description', formData.description || '');
    fd.append('price', formData.price);
    fd.append('weight_or_unit', formData.weightOrUnit || '');
    fd.append('is_active', formData.isActive ? '1' : '0');
    if (selectedFile.value) {
      fd.append('image', selectedFile.value);
    }
    emit('save', fd);
  } catch (err) {
    errorMessage.value = err.message || 'Gagal menyimpan produk';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(25, 21, 18, 0.55);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  z-index: 60;
  padding: 20px;
  overflow-y: auto;
}

.modal-card {
  width: 100%;
  max-width: 620px;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  overflow: hidden;
  animation: modalPop 220ms ease;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px 28px 18px;
  border-bottom: 1px solid var(--line);
}

.modal-eyebrow {
  margin: 0 0 4px;
  color: var(--red);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.modal-title {
  margin: 0;
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.close-btn {
  color: var(--muted);
  padding: 4px;
  cursor: pointer;
  border-radius: 6px;
  transition: all var(--ease);
}

.close-btn:hover {
  background: var(--soft);
  color: var(--ink);
}

.modal-body {
  padding: 24px 28px;
}

.error-alert {
  padding: 10px 14px;
  margin-bottom: 18px;
  border-radius: 6px;
  background: #fef2f2;
  border: 1px solid #fca5a5;
  color: #dc2626;
  font-size: 0.82rem;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 16px;
}

.full-width {
  grid-column: span 2;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--ink);
}

.form-label.required::after {
  content: " *";
  color: var(--red);
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: #fff;
  color: var(--ink);
  font-size: 0.86rem;
  outline: none;
  transition: border-color var(--ease);
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: var(--red);
}

.form-file-input {
  cursor: pointer;
}

.form-file-input::file-selector-button {
  padding: 6px 12px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--soft);
  color: var(--ink);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  margin-right: 10px;
  transition: all var(--ease);
}

.form-file-input::file-selector-button:hover {
  background: var(--line);
}

.input-prefix-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.prefix {
  position: absolute;
  left: 12px;
  color: var(--muted);
  font-size: 0.88rem;
  font-weight: 700;
}

.with-prefix {
  padding-left: 28px;
}

.image-uploader-row {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 14px;
  align-items: center;
}

.preview-box {
  width: 80px;
  height: 80px;
  border-radius: var(--r-sm);
  border: 1px solid var(--line);
  overflow: hidden;
  background: var(--soft);
  display: grid;
  place-items: center;
}

.preview-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.empty-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--muted);
  font-size: 0.65rem;
  gap: 4px;
}

.form-hint {
  font-size: 0.72rem;
  color: var(--muted);
  margin-top: 4px;
  display: block;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.btn-cancel {
  padding: 10px 18px;
  border-radius: var(--r-sm);
  border: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--ease);
}

.btn-cancel:hover {
  background: var(--soft);
  color: var(--ink);
}

.btn-submit {
  padding: 10px 22px;
  border-radius: var(--r-sm);
  background: var(--red);
  color: #fff;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--ease);
}

.btn-submit:hover:not(:disabled) {
  background: var(--red-dark);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes modalPop {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .full-width {
    grid-column: span 1;
  }
  .modal-body {
    padding: 18px 20px;
  }
}
</style>
