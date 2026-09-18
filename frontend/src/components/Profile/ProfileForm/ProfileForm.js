import { computed, reactive, ref, watch } from 'vue';
import AuthField from '../../auth/AuthInput/AuthInput.vue';
import AuthSelect from '../../auth/AuthSelect/AuthSelect.vue';
import './ProfileForm.css';

export default {
  name: 'ProfileForm',
  components: { AuthField, AuthSelect },
  props: {
    type: {
      type: String,
      default: 'customer',
      validator: value => ['customer', 'employee'].includes(value)
    },
    profile: {
      type: Object,
      default: () => ({
        fullName: '',
        phone: '',
        gender: '',
        email: '',
        address: '',
        employeeId: '',
        position: '',
        joinDate: ''
      })
    }
  },
  emits: ['save'],
  setup(props, { emit }) {
    const form = reactive({
      fullName: '',
      phone: '',
      gender: '',
      email: '',
      address: '',
      employeeId: '',
      position: '',
      joinDate: ''
    });

    const errors = reactive({
      fullName: '',
      phone: '',
      gender: '',
      email: '',
      address: ''
    });

    const isSaving = ref(false);
    const successMessage = ref('');

    const loadProfile = () => {
      form.fullName = props.profile.fullName || '';
      form.phone = props.profile.phone || '';
      form.gender = props.profile.gender || '';
      form.email = props.profile.email || '';
      form.address = props.profile.address || '';
      form.employeeId = props.profile.employeeId || '';
      form.position = props.profile.position || '';
      form.joinDate = props.profile.joinDate || '';
    };

    loadProfile();
    watch(() => props.profile, () => {
      loadProfile();
    }, { deep: true });

    const displayRole = computed(() => {
      const role = (form.position || '').toLowerCase();
      if (role === 'superadmin') return 'Super Admin';
      if (role === 'kasir') return 'Kasir / Staf';
      if (role === 'admin') return 'Admin';
      return form.position || 'Admin';
    });

    const formattedJoinDate = computed(() => {
      if (!form.joinDate) return '-';
      const date = new Date(form.joinDate);
      if (Number.isNaN(date.getTime())) return form.joinDate;
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).format(date);
    });

    const validateForm = () => {
      errors.fullName = '';
      errors.phone = '';
      errors.gender = '';
      errors.email = '';
      errors.address = '';
      let isValid = true;

      if (!form.fullName.trim()) {
        errors.fullName = props.type === 'employee' ? 'Nama lengkap wajib diisi.' : 'Full name is required.';
        isValid = false;
      }

      if (props.type === 'employee') {
        if (!form.phone.trim()) {
          errors.phone = 'No. Handphone wajib diisi.';
          isValid = false;
        } else if (!/^[0-9+\-\s()]{7,20}$/.test(form.phone.trim())) {
          errors.phone = 'Format nomor handphone tidak valid.';
          isValid = false;
        }
      } else {
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
          errors.email = 'Format email tidak valid.';
          isValid = false;
        }
      }

      return isValid;
    };

    const handleSubmit = async () => {
      successMessage.value = '';
      if (!validateForm()) return;
      isSaving.value = true;
      try {
        if (props.type === 'employee') {
          await emit('save', {
            fullName: form.fullName.trim(),
            phone: form.phone.trim()
          });
          successMessage.value = 'Profil pegawai berhasil diperbarui.';
        } else {
          await emit('save', {
            fullName: form.fullName.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),
            address: form.address.trim()
          });
          successMessage.value = 'Your profile has been updated successfully.';
        }
      } finally {
        isSaving.value = false;
      }
    };

    const resetForm = () => {
      loadProfile();
      errors.fullName = '';
      errors.phone = '';
      errors.gender = '';
      errors.email = '';
      errors.address = '';
      successMessage.value = '';
    };

    return {
      form,
      errors,
      isSaving,
      successMessage,
      displayRole,
      formattedJoinDate,
      handleSubmit,
      resetForm
    };
  }
};
