import { computed, ref, onBeforeUnmount } from 'vue';
import './AuthSelect.css';

export default {
  name: 'AuthSelect',
  props: { label: { type: String, default: '' }, placeholder: { type: String, default: 'Select' }, modelValue: { type: [String, Number], default: '' }, options: { type: Array, default: () => [] }, error: { type: String, default: '' }, required: { type: Boolean, default: false }, id: { type: String, default: '' } },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isOpen = ref(false);
    const fallbackId = `select-${Math.random().toString(36).substring(2, 9)}`;
    const inputId = computed(() => props.id || fallbackId);
    const selectedLabel = computed(() => { const option = props.options.find(option => option.value === props.modelValue); return option?.label || props.placeholder; });
    function selectOption(value) { emit('update:modelValue', value); isOpen.value = false; }
    function handleClickOutside(event) { const select = event.target.closest(`#${inputId.value}`); if (!select && !event.target.closest('.custom-select')) isOpen.value = false; }
    document.addEventListener('click', handleClickOutside);
    onBeforeUnmount(() => { document.removeEventListener('click', handleClickOutside); });
    return { isOpen, inputId, selectedLabel, selectOption };
  }
};
