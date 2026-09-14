import { ref, computed } from 'vue';
import './AuthInput.css';

export default {
  name: 'AuthInput',
  props: { label: { type: String, default: '' }, type: { type: String, default: 'text' }, placeholder: { type: String, default: '' }, modelValue: { type: [String, Number], default: '' }, error: { type: String, default: '' }, required: { type: Boolean, default: false }, autocomplete: { type: String, default: 'off' }, id: { type: String, default: '' }, disabled: { type: Boolean, default: false }, formatter: { type: Function, default: null }, maxlength: { type: Number, default: null } },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const showPassword = ref(false);
    const fallbackId = `input-${Math.random().toString(36).substring(2, 9)}`;
    const inputId = computed(() => props.id || fallbackId);
    const computedType = computed(() => { if (props.type === 'password') return showPassword.value ? 'text' : 'password'; return props.type; });
    const formatKoreanPhone = (value) => { const numbers = String(value).replace(/\D/g, ''); if (numbers.length <= 3) return numbers; if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`; return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`; };
    const formattedValue = computed(() => { if (props.type === 'tel') return props.formatter ? props.formatter(props.modelValue) : formatKoreanPhone(props.modelValue); return props.modelValue; });
    const handleInput = (event) => { let value = event.target.value; if (props.type === 'tel') { value = value.replace(/[^0-9]/g, ''); if (props.maxlength) value = value.slice(0, props.maxlength); } emit('update:modelValue', value); };
    const handleKeydown = (event) => { if (props.type !== 'tel') return; const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']; if (event.ctrlKey || event.metaKey) return; if (allowedKeys.includes(event.key)) return; if (!/^[0-9]$/.test(event.key)) event.preventDefault(); };
    return { showPassword, inputId, computedType, formattedValue, handleInput, handleKeydown };
  }
};
