import { computed, reactive, ref, onBeforeUnmount } from 'vue';
import ProfileForm from '../../../components/Profile/ProfileForm/ProfileForm.vue';
import AppFooter from '../../../components/layout/AppFooter/AppFooter.vue';
import './EmployeeProfile.css';

export default {
  name: 'EmployeeProfile',
  components: { ProfileForm, AppFooter },
  setup() {
    const profile = reactive({ fullName: 'Employee Name', gender: 'male', email: 'employee@example.com', address: 'Seoul, South Korea', employeeId: 'EMP-001', position: 'Cashier', joinDate: '2026-08-01' });
    const profileInput = ref(null);
    const profilePicture = ref('');
    const userInitial = computed(() => { if (!profile.fullName) return 'E'; return profile.fullName.trim().charAt(0).toUpperCase(); });
    const triggerProfileUpload = () => { profileInput.value?.click(); };
    const handleProfileUpload = (event) => { const file = event.target.files?.[0]; if (!file) return; if (!file.type.startsWith('image/')) return; if (profilePicture.value) URL.revokeObjectURL(profilePicture.value); profilePicture.value = URL.createObjectURL(file); };
    const handleSave = (updatedProfile) => { Object.assign(profile, updatedProfile); };
    onBeforeUnmount(() => { if (profilePicture.value) URL.revokeObjectURL(profilePicture.value); });
    return { profile, profileInput, profilePicture, userInitial, triggerProfileUpload, handleProfileUpload, handleSave };
  }
};
