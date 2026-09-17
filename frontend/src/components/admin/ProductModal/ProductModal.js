import { reactive, watch, ref } from 'vue';
import './ProductModal.css';

export default {
  name: 'ProductModal',
  props: {
    isOpen: Boolean,
    isEdit: Boolean,
    isSaving: { type: Boolean, default: false },
    initialData: Object,
    categories: { type: Array, default: () => [] }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
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
        if (selectedFile.value) fd.append('image', selectedFile.value);
        emit('save', fd);
      } catch (err) {
        errorMessage.value = err.message || 'Gagal menyimpan produk';
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      isSubmitting,
      errorMessage,
      fileInputRef,
      imagePreviewUrl,
      formData,
      handleFileChange,
      handleSubmit
    };
  }
};
