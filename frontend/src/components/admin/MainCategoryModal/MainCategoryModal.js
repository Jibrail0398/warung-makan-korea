import { reactive, watch, ref } from 'vue';
import './MainCategoryModal.css';

export default {
  name: 'MainCategoryModal',
  props: {
    isOpen: Boolean,
    isEdit: Boolean,
    initialData: Object
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const isSubmitting = ref(false);
    const errorMessage = ref('');

    const formData = reactive({
      name: '',
      code: 'restaurant',
      description: ''
    });

    watch(() => props.initialData, (newVal) => {
      if (newVal) {
        formData.name = newVal.name || '';
        formData.code = newVal.code || newVal.slug || 'restaurant';
        formData.description = newVal.description || '';
      } else {
        formData.name = '';
        formData.code = 'restaurant';
        formData.description = '';
      }
      errorMessage.value = '';
    }, { immediate: true });

    const handleSubmit = () => {
      errorMessage.value = '';
      if (!formData.name.trim()) {
        errorMessage.value = 'Nama kategori besar wajib diisi';
        return;
      }

      isSubmitting.value = true;
      try {
        emit('save', {
          name: formData.name.trim(),
          code: (formData.code || formData.name).toLowerCase().replace(/\s+/g, '-'),
          slug: (formData.name).toLowerCase().replace(/\s+/g, '-'),
          description: formData.description.trim()
        });
      } catch (err) {
        errorMessage.value = err.message || 'Gagal menyimpan kategori besar';
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      isSubmitting,
      errorMessage,
      formData,
      handleSubmit
    };
  }
};
