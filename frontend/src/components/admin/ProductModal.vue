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
          <!-- Image Preview & Input -->
          <div class="form-group full-width">
            <label class="form-label">Foto Produk (URL Gambar)</label>
            <div class="image-uploader-row">
              <div class="preview-box">
                <img v-if="formData.image" :src="formData.image" alt="Preview produk" @error="handleImageError" />
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
                  type="url"
                  v-model="formData.image"
                  class="form-input"
                  placeholder="https://images.pexels.com/... atau link foto"
                />
                <small class="form-hint">Masukkan URL gambar beresolusi baik (JPG, PNG, WEBP).</small>
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
              placeholder="Contoh: Rendang Daging Sapi, Nasi Goreng, Sambal"
              required
            />
          </div>

          <!-- Main Category (Kategori Besar) Selection -->
          <div class="form-group">
            <label class="form-label required">Kategori Besar (Parent)</label>
            <select v-model="formData.mainCategoryId" class="form-select" @change="handleMainCatChange">
              <option :value="1">Restaurant Menu (Siap Santap)</option>
              <option :value="2">Raw Material (Bahan Baku / Mentah)</option>
              <option v-for="mc in customMainCategories" :key="mc.id" :value="mc.id">
                {{ mc.name }}
              </option>
            </select>
          </div>

          <!-- Subcategory Selection -->
          <div class="form-group">
            <label class="form-label required">Subkategori</label>
            <select v-model="formData.subcategoryId" class="form-select">
              <option v-for="sc in filteredSubcategories" :key="sc.id" :value="sc.id">
                {{ sc.name }}
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
                v-model.number="formData.numericPrice"
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
            <label class="form-label required">Satuan / Porsi / Berat</label>
            <input
              type="text"
              v-model="formData.unit"
              class="form-input"
              placeholder="Contoh: 1 porsi, 500 gr, 1 botol"
              required
            />
          </div>

          <!-- Stock -->
          <div class="form-group">
            <label class="form-label required">Stok Tersedia</label>
            <input
              type="number"
              v-model.number="formData.stock"
              class="form-input"
              placeholder="50"
              min="0"
              required
            />
          </div>

          <!-- Status -->
          <div class="form-group">
            <label class="form-label required">Status Ketersediaan</label>
            <select v-model="formData.status" class="form-select">
              <option value="Available">Tersedia (Available)</option>
              <option value="Sold Out">Habis (Sold Out)</option>
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
import { reactive, watch, ref, computed } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  isEdit: Boolean,
  initialData: Object,
  mainCategories: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'save']);

const isSubmitting = ref(false);
const errorMessage = ref('');

const formData = reactive({
  name: '',
  mainCategoryId: 1,
  subcategoryId: 1,
  category: 'restaurant',
  numericPrice: 12000,
  unit: '1 porsi',
  stock: 25,
  status: 'Available',
  description: '',
  image: ''
});

const customMainCategories = computed(() => {
  return props.mainCategories.filter(mc => mc.id !== 1 && mc.id !== 2);
});

const filteredSubcategories = computed(() => {
  if (!props.categories.length) return [];
  const targetMainId = Number(formData.mainCategoryId);
  const matched = props.categories.filter(sc => {
    if (sc.mainCategoryId) return Number(sc.mainCategoryId) === targetMainId;
    return targetMainId === 1 ? sc.type === 'restaurant' : sc.type === 'raw';
  });

  return matched.length > 0 ? matched : props.categories;
});

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    formData.name = newVal.name || '';
    formData.mainCategoryId = Number(newVal.mainCategoryId || (newVal.category === 'raw' ? 2 : 1));
    formData.subcategoryId = Number(newVal.subcategoryId || newVal.categoryId || (formData.mainCategoryId === 2 ? 4 : 1));
    formData.category = formData.mainCategoryId === 2 ? 'raw' : 'restaurant';
    formData.numericPrice = newVal.numericPrice !== undefined ? newVal.numericPrice : 10000;
    formData.unit = newVal.unit || (formData.mainCategoryId === 2 ? '1 bungkus' : '1 porsi');
    formData.stock = newVal.stock !== undefined ? newVal.stock : 20;
    formData.status = newVal.status || 'Available';
    formData.description = newVal.description || '';
    formData.image = newVal.image || '';
  } else {
    // Reset
    formData.name = '';
    formData.mainCategoryId = 1;
    formData.subcategoryId = 1;
    formData.category = 'restaurant';
    formData.numericPrice = 12000;
    formData.unit = '1 porsi';
    formData.stock = 25;
    formData.status = 'Available';
    formData.description = '';
    formData.image = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  errorMessage.value = '';
}, { immediate: true });

const handleMainCatChange = () => {
  const isRaw = Number(formData.mainCategoryId) === 2;
  formData.category = isRaw ? 'raw' : 'restaurant';
  formData.unit = isRaw ? '1 bungkus' : '1 porsi';

  // Select first available subcategory
  const availableSub = props.categories.find(sc => {
    if (sc.mainCategoryId) return Number(sc.mainCategoryId) === Number(formData.mainCategoryId);
    return isRaw ? sc.type === 'raw' : sc.type === 'restaurant';
  });

  if (availableSub) {
    formData.subcategoryId = availableSub.id;
  }
};

const handleImageError = () => {
  formData.image = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600';
};

const handleSubmit = async () => {
  errorMessage.value = '';
  if (!formData.name.trim()) {
    errorMessage.value = 'Nama produk wajib diisi';
    return;
  }
  if (!formData.numericPrice || formData.numericPrice < 0) {
    errorMessage.value = 'Harga produk harus valid';
    return;
  }

  isSubmitting.value = true;
  try {
    const isRaw = Number(formData.mainCategoryId) === 2;
    emit('save', {
      ...formData,
      category: isRaw ? 'raw' : 'restaurant',
      categoryId: formData.subcategoryId // backward compatibility
    });
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
