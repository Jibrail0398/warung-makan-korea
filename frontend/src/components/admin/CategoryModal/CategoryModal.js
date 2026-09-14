import { reactive, watch, ref, computed } from 'vue';
import './CategoryModal.css';

export default {
  name: 'CategoryModal',
  props: { isOpen: Boolean, isEdit: Boolean, initialData: Object, mainCategories: { type: Array, default: () => [] } },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const isSubmitting = ref(false);
    const errorMessage = ref('');
    const formData = reactive({ mainCategoryId: 1, name: '', type: 'restaurant', description: '' });
    const customMainCategories = computed(() => props.mainCategories.filter(mc => mc.id !== 1 && mc.id !== 2));
    watch(() => props.initialData, (newVal) => { if (newVal) { formData.mainCategoryId = Number(newVal.mainCategoryId || (newVal.type === 'raw' ? 2 : 1)); formData.name = newVal.name || ''; formData.type = newVal.type || (formData.mainCategoryId === 2 ? 'raw' : 'restaurant'); formData.description = newVal.description || ''; } else { formData.mainCategoryId = 1; formData.name = ''; formData.type = 'restaurant'; formData.description = ''; } errorMessage.value = ''; }, { immediate: true });
    const handleMainCatChange = () => { formData.type = formData.mainCategoryId === 2 ? 'raw' : 'restaurant'; };
    const handleSubmit = () => { errorMessage.value = ''; if (!formData.name.trim()) { errorMessage.value = 'Nama subkategori wajib diisi'; return; } isSubmitting.value = true; try { const mainCatId = Number(formData.mainCategoryId); emit('save', { ...formData, mainCategoryId: mainCatId, type: mainCatId === 2 ? 'raw' : 'restaurant' }); } catch (err) { errorMessage.value = err.message || 'Gagal menyimpan subkategori'; } finally { isSubmitting.value = false; } };
    return { isSubmitting, errorMessage, formData, customMainCategories, handleMainCatChange, handleSubmit };
  }
};
