import { reactive, watch, ref } from 'vue';
import './MainCategoryModal.css';

export default {
  name: 'MainCategoryModal',
  props: {
    isOpen: Boolean,
    isEdit: Boolean,
    isSaving: { type: Boolean, default: false },
    initialData: Object
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const isSubmitting = ref(false);
    const errorMessage = ref('');

    const formData = reactive({
      name: ''
    });

    const formErrors = reactive({
      name: ''
    });

    const clearFormErrors = () => {
      formErrors.name = '';
    };

    const resetForm = () => {
      if (props.isOpen && props.isEdit && props.initialData) {
        formData.name = props.initialData.name || '';
      } else {
        formData.name = '';
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
        formErrors.name = 'Nama kategori wajib diisi.';
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
        emit('save', {
          name: formData.name.trim()
        });
      } catch (err) {
        errorMessage.value = err.message || 'Gagal menyimpan kategori';
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
      handleSubmit
    };
  }
};
