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
      name: ''
    });

    watch(() => props.initialData, (newVal) => {
      if (newVal) {
        formData.name = newVal.name || '';
      } else {
        formData.name = '';
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
      handleSubmit
    };
  }
};
