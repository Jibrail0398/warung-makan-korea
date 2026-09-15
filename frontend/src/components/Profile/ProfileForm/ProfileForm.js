import { computed, reactive, ref, watch } from 'vue';
import AuthField from '../../auth/AuthInput/AuthInput.vue';
import AuthSelect from '../../auth/AuthSelect/AuthSelect.vue';
import './ProfileForm.css';

export default {
  name: 'ProfileForm',
  components: { AuthField, AuthSelect },
  props: { type: { type: String, default: 'customer', validator: value => ['customer', 'employee'].includes(value) }, profile: { type: Object, default: () => ({ fullName: '', gender: '', email: '', address: '', employeeId: '', position: '', joinDate: '' }) } },
  emits: ['save'],
  setup(props, { emit }) {
    const genderOptions = [{ value: 'male', label: 'Laki-laki' }, { value: 'female', label: 'Perempuan' }, { value: 'secret', label: 'Rahasia' }];
    const form = reactive({ fullName: '', gender: '', email: '', address: '', employeeId: '', position: '', joinDate: '' });
    const errors = reactive({ fullName: '', gender: '', email: '', address: '' });
    const isSaving = ref(false);
    const successMessage = ref('');
    const loadProfile = () => { form.fullName = props.profile.fullName || ''; form.gender = props.profile.gender || ''; form.email = props.profile.email || ''; form.address = props.profile.address || ''; form.employeeId = props.profile.employeeId || ''; form.position = props.profile.position || ''; form.joinDate = props.profile.joinDate || ''; };
    loadProfile();
    watch(() => props.profile, () => { loadProfile(); }, { deep: true });
    const formattedJoinDate = computed(() => { if (!form.joinDate) return '-'; const date = new Date(form.joinDate); if (Number.isNaN(date.getTime())) return form.joinDate; return new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'long', year: 'numeric' }).format(date); });
    const validateForm = () => { errors.fullName = ''; errors.gender = ''; errors.email = ''; errors.address = ''; let isValid = true; if (!form.fullName.trim()) { errors.fullName = 'Full name is required.'; isValid = false; } if (!form.gender) { errors.gender = 'Gender is required.'; isValid = false; } if (!form.email.trim()) { errors.email = 'Email address is required.'; isValid = false; } if (!form.address.trim()) { errors.address = 'Address is required.'; isValid = false; } return isValid; };
    const handleSubmit = async () => { successMessage.value = ''; if (!validateForm()) return; isSaving.value = true; try { emit('save', { fullName: form.fullName, gender: form.gender, email: form.email, address: form.address }); successMessage.value = 'Your profile has been updated successfully.'; } finally { isSaving.value = false; } };
    const resetForm = () => { loadProfile(); errors.fullName = ''; errors.gender = ''; errors.email = ''; errors.address = ''; successMessage.value = ''; };
    return { genderOptions, form, errors, isSaving, successMessage, formattedJoinDate, handleSubmit, resetForm };
  }
};
