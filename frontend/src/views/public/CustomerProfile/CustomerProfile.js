import { computed, reactive, ref } from 'vue';
import ProfileForm from '../../../components/Profile/ProfileForm/ProfileForm.vue';
import AppFooter from '../../../components/layout/AppFooter/AppFooter.vue';
import './CustomerProfile.css';

export default {
  name: 'CustomerProfile',
  components: { ProfileForm, AppFooter },
  setup() {
    const profile = reactive({ fullName: 'Customer Name', phone: '+82 10 1234 5678', email: 'customer@example.com', address: 'Seoul, South Korea' });
    const profileInput = ref(null);
    const profilePicture = ref('');
    const userInitial = computed(() => { if (!profile.fullName) return 'C'; return profile.fullName.trim().charAt(0).toUpperCase(); });
    const triggerProfileUpload = () => { profileInput.value?.click(); };
    const handleProfileUpload = (event) => { const file = event.target.files?.[0]; if (!file) return; if (!file.type.startsWith('image/')) return; profilePicture.value = URL.createObjectURL(file); };
    const handleSave = (updatedProfile) => { Object.assign(profile, updatedProfile); };
    return { profile, profileInput, profilePicture, userInitial, triggerProfileUpload, handleProfileUpload, handleSave };
  }
};
