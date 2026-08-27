<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card" role="dialog" aria-modal="true" :aria-labelledby="isEdit ? 'editCatTitle' : 'addCatTitle'">
      <div class="modal-header">
        <div>
          <p class="modal-eyebrow">KELOLA KATEGORI</p>
          <h2 id="addCatTitle" class="modal-title">
            {{ isEdit ? 'Edit Kategori' : 'Tambah Kategori Baru' }}
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
            <label class="form-label required">Nama Kategori</label>
            <input
              type="text"
              v-model="formData.name"
              class="form-input"
              placeholder="Contoh: Aneka Sambal & Bumbu"
              required
            />
          </div>

          <div class="form-group full-width">
            <label class="form-label required">Kelompok Produk</label>
            <select v-model="formData.type" class="form-select">
              <option value="restaurant">Menu Restoran (Siap Makan)</option>
              <option value="raw">Raw Material (Bahan Baku / Mentah)</option>
            </select>
          </div>

          <div class="form-group full-width">
            <label class="form-label">Deskripsi Kategori</label>
            <textarea
              v-model="formData.description"
              class="form-textarea"
              rows="3"
              placeholder="Jelaskan jenis makanan atau bahan yang termasuk dalam kategori ini..."
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click="$emit('close')">
            Batal
          </button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Kategori') }}
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
  initialData: Object
});

const emit = defineEmits(['close', 'save']);

const isSubmitting = ref(false);
const errorMessage = ref('');

const formData = reactive({
  name: '',
  type: 'restaurant',
  description: ''
});

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    formData.name = newVal.name || '';
    formData.type = newVal.type || 'restaurant';
    formData.description = newVal.description || '';
  } else {
    formData.name = '';
    formData.type = 'restaurant';
    formData.description = '';
  }
  errorMessage.value = '';
}, { immediate: true });

const handleSubmit = () => {
  errorMessage.value = '';
  if (!formData.name.trim()) {
    errorMessage.value = 'Nama kategori wajib diisi';
    return;
  }

  isSubmitting.value = true;
  try {
    emit('save', { ...formData });
  } catch (err) {
    errorMessage.value = err.message || 'Gagal menyimpan kategori';
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
}

.modal-card {
  width: 100%;
  max-width: 500px;
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
  padding: 22px 24px 16px;
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
  font-size: 1.35rem;
  font-weight: 600;
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
  padding: 22px 24px;
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
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--line);
}

.btn-cancel {
  padding: 9px 16px;
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
  padding: 9px 20px;
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

@keyframes modalPop {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
</style>
