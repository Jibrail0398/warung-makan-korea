import { computed, reactive, ref, onMounted } from 'vue';
import AppHeader from '../../../components/layout/AppHeader/AppHeader.vue';
import ProfileForm from '../../../components/Profile/ProfileForm/ProfileForm.vue';
import AppFooter from '../../../components/layout/AppFooter/AppFooter.vue';
import { useAuthStore } from '../../../stores/auth.js';
import './CustomerProfile.css';

export default {
  name: 'CustomerProfile',
  components: { AppHeader, ProfileForm, AppFooter },
  setup() {
    const authStore = useAuthStore();
    const profile = reactive({
      fullName: 'Customer Name',
      phone: '+82 10 1234 5678',
      email: 'customer@example.com',
      address: 'Seoul, South Korea'
    });

    onMounted(async () => {
      await authStore.hydrate();
      if (authStore.user) {
        profile.fullName = authStore.user.name || authStore.user.username || 'Customer';
        profile.phone = authStore.user.phone_number || '';
        profile.email = authStore.user.email || '';
      }
    });

    const profileInput = ref(null);
    const profilePicture = ref('');
    const userInitial = computed(() => {
      if (!profile.fullName) return 'C';
      return profile.fullName.trim().charAt(0).toUpperCase();
    });

    const triggerProfileUpload = () => { profileInput.value?.click(); };
    const handleProfileUpload = (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) return;
      if (file.size > 10 * 1024 * 1024) {
        alert('Ukuran gambar profil maksimal 10MB');
        event.target.value = '';
        return;
      }
      profilePicture.value = URL.createObjectURL(file);
    };

    const handleSave = (updatedProfile) => {
      Object.assign(profile, updatedProfile);
    };

    return {
      profile,
      profileInput,
      profilePicture,
      userInitial,
      triggerProfileUpload,
      handleProfileUpload,
      handleSave
    };
  }
};
