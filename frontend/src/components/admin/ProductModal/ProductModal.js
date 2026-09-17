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

    const formErrors = reactive({
      name: '',
      categoryId: '',
      price: ''
    });

    const clearFormErrors = () => {
      formErrors.name = '';
      formErrors.categoryId = '';
      formErrors.price = '';
    };

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

    const resetForm = () => {
      if (props.isOpen && props.isEdit && props.initialData) {
        formData.name = props.initialData.name || '';
        formData.categoryId = Number(props.initialData.categoryId || props.initialData.category_id) || null;
        formData.price = props.initialData.numericPrice !== undefined ? props.initialData.numericPrice : (Number(props.initialData.price) || 0);
        formData.weightOrUnit = props.initialData.weightOrUnit || props.initialData.weight_or_unit || '';
        formData.isActive = props.initialData.isActive !== undefined ? props.initialData.isActive : (props.initialData.is_active !== false);
        formData.description = props.initialData.description || '';
        imagePreviewUrl.value = props.initialData.image || '';
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
      clearFormErrors();
      errorMessage.value = '';
    };

    watch(
      [() => props.isOpen, () => props.isEdit, () => props.initialData],
      ([isOpen]) => {
        if (isOpen) {
          resetForm();
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
          clearFormErrors();
          errorMessage.value = '';
        }
      },
      { immediate: true }
    );

    const validateForm = () => {
      clearFormErrors();
      let isValid = true;
      if (!formData.name.trim()) {
        formErrors.name = 'Nama produk wajib diisi.';
        isValid = false;
      }
      if (!formData.categoryId) {
        formErrors.categoryId = 'Kategori wajib dipilih.';
        isValid = false;
      }
      if (formData.price === null || formData.price === undefined || formData.price === '' || formData.price < 0) {
        formErrors.price = 'Harga produk harus diisi dan valid (>= 0).';
        isValid = false;
      }
      return isValid;
    };

    const handleSubmit = async () => {
      errorMessage.value = '';
      if (!validateForm()) {
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
      formErrors,
      clearFormErrors,
      handleFileChange,
      handleSubmit
    };
  }
};
