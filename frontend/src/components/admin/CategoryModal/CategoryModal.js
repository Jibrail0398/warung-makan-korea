import { reactive, watch, ref, computed } from 'vue';
import './CategoryModal.css';

export default {
  name: 'CategoryModal',
  props: {
    isOpen: Boolean,
    isEdit: Boolean,
    isSaving: { type: Boolean, default: false },
    initialData: Object,
    mainCategories: { type: Array, default: () => [] }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const isSubmitting = ref(false);
    const errorMessage = ref('');
    const formData = reactive({
      mainCategoryId: 1,
      name: '',
      type: 'restaurant',
      description: ''
    });

    const formErrors = reactive({
      name: '',
      mainCategoryId: ''
    });

    const clearFormErrors = () => {
      formErrors.name = '';
      formErrors.mainCategoryId = '';
    };

    const customMainCategories = computed(() =>
      props.mainCategories.filter(mc => mc.id !== 1 && mc.id !== 2)
    );

    const resetForm = () => {
      if (props.isOpen && props.isEdit && props.initialData) {
        formData.mainCategoryId = Number(props.initialData.mainCategoryId || (props.initialData.type === 'raw' ? 2 : 1));
        formData.name = props.initialData.name || '';
        formData.type = props.initialData.type || (formData.mainCategoryId === 2 ? 'raw' : 'restaurant');
        formData.description = props.initialData.description || '';
      } else {
        formData.mainCategoryId = 1;
        formData.name = '';
        formData.type = 'restaurant';
        formData.description = '';
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
          formData.mainCategoryId = 1;
          formData.name = '';
          formData.type = 'restaurant';
          formData.description = '';
          clearFormErrors();
          errorMessage.value = '';
        }
      },
      { immediate: true }
    );

    const handleMainCatChange = () => {
      formErrors.mainCategoryId = '';
      formData.type = formData.mainCategoryId === 2 ? 'raw' : 'restaurant';
    };

    const validateForm = () => {
      clearFormErrors();
      let isValid = true;
      if (!formData.name.trim()) {
        formErrors.name = 'Nama subkategori wajib diisi.';
        isValid = false;
      }
      if (!formData.mainCategoryId) {
        formErrors.mainCategoryId = 'Kategori utama wajib dipilih.';
        isValid = false;
      }
      return isValid;
    };

    const handleSubmit = () => {
      errorMessage.value = '';
      if (!validateForm()) {
        return;
      }
      isSubmitting.value = true;
      try {
        const mainCatId = Number(formData.mainCategoryId);
        emit('save', {
          ...formData,
          mainCategoryId: mainCatId,
          type: mainCatId === 2 ? 'raw' : 'restaurant'
        });
      } catch (err) {
        errorMessage.value = err.message || 'Gagal menyimpan subkategori';
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      isSubmitting,
      errorMessage,
      formData,
      formErrors,
      clearFormErrors,
      customMainCategories,
      handleMainCatChange,
      handleSubmit
    };
  }
};
