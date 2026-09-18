import { computed, reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import ProfileForm from '../../../components/Profile/ProfileForm/ProfileForm.vue';
import AuthField from '../../../components/auth/AuthInput/AuthInput.vue';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner.vue';
import { useAuthStore } from '../../../stores/auth.js';
import { authService } from '../../../services/authService.js';
import { usersService } from '../../../services/usersService.js';
import './EmployeeProfile.css';

export default {
  name: 'EmployeeProfile',
  components: { ProfileForm, AuthField, LoadingSpinner },
  setup() {
    const authStore = useAuthStore();
    const activeTab = ref('info');

    const profile = reactive({
      fullName: 'Admin',
      phone: '',
      employeeId: 'EMP-001',
      position: 'admin',
      joinDate: '2026-08-01'
    });

    const roleLabel = (role) => {
      const normalized = (role || '').toLowerCase();
      if (normalized === 'superadmin') return 'Super Admin';
      if (normalized === 'kasir') return 'Kasir / Staf';
      if (normalized === 'admin') return 'Admin Restoran';
      return role || 'Pegawai';
    };

    onMounted(async () => {
      await authStore.hydrate();
      if (authStore.user) {
        profile.fullName = authStore.user.name || authStore.user.username || 'Admin';
        profile.phone = authStore.user.phone_number || '';
        profile.position = authStore.user.role || 'admin';
        profile.employeeId = `EMP-00${authStore.user.id || 1}`;
        profile.joinDate = authStore.user.created_at || '2026-08-01';
      }
    });

    const profileInput = ref(null);
    const profilePicture = ref('');
    const userInitial = computed(() => {
      if (!profile.fullName) return 'A';
      return profile.fullName.trim().charAt(0).toUpperCase();
    });

    const triggerProfileUpload = () => {
      profileInput.value?.click();
    };

    const handleProfileUpload = (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) return;
      if (profilePicture.value) URL.revokeObjectURL(profilePicture.value);
      profilePicture.value = URL.createObjectURL(file);
    };

    const handleSave = async (updatedProfile) => {
      try {
        if (authStore.user?.id) {
          await usersService.updateUser(authStore.user.id, {
            name: updatedProfile.fullName,
            phone_number: updatedProfile.phone,
            role: authStore.user.role
          });
        }
        const storedAuth = await authService.getStoredAuth();
        if (storedAuth && storedAuth.user) {
          storedAuth.user.name = updatedProfile.fullName;
          storedAuth.user.phone_number = updatedProfile.phone;
          const encoded = await authService.encode(storedAuth);
          localStorage.setItem('warung-auth-data', encoded);
          await authStore.hydrate();
        }
      } catch (err) {
        console.error('Failed to sync profile update with backend:', err);
      }
      Object.assign(profile, updatedProfile);
    };

    // ==========================================
    // CHANGE PASSWORD LOGIC
    // ==========================================
    const passwordForm = reactive({
      password: '',
      password_confirmation: ''
    });

    const passwordErrors = reactive({
      password: '',
      password_confirmation: ''
    });

    const isChangingPassword = ref(false);
    const passwordSuccessMessage = ref('');
    const passwordErrorMessage = ref('');

    const resetPasswordForm = () => {
      passwordForm.password = '';
      passwordForm.password_confirmation = '';
      passwordErrors.password = '';
      passwordErrors.password_confirmation = '';
      passwordSuccessMessage.value = '';
      passwordErrorMessage.value = '';
    };

    const validatePasswordForm = () => {
      passwordErrors.password = '';
      passwordErrors.password_confirmation = '';
      passwordSuccessMessage.value = '';
      passwordErrorMessage.value = '';
      let isValid = true;

      if (!passwordForm.password) {
        passwordErrors.password = 'Password baru wajib diisi.';
        isValid = false;
      } else if (passwordForm.password.length < 6) {
        passwordErrors.password = 'Password baru minimal 6 karakter.';
        isValid = false;
      }

      if (!passwordForm.password_confirmation) {
        passwordErrors.password_confirmation = 'Konfirmasi password wajib diisi.';
        isValid = false;
      } else if (passwordForm.password !== passwordForm.password_confirmation) {
        passwordErrors.password_confirmation = 'Konfirmasi password tidak cocok.';
        isValid = false;
      }

      return isValid;
    };

    const handleChangePassword = async () => {
      if (!validatePasswordForm()) return;
      if (!authStore.user?.id) {
        passwordErrorMessage.value = 'Sesi pengguna tidak ditemukan. Silakan login ulang.';
        return;
      }

      isChangingPassword.value = true;
      try {
        await usersService.changePassword(authStore.user.id, {
          password: passwordForm.password,
          password_confirmation: passwordForm.password_confirmation
        });
        passwordSuccessMessage.value = 'Password akun berhasil diperbarui.';
        passwordForm.password = '';
        passwordForm.password_confirmation = '';
      } catch (error) {
        passwordErrorMessage.value = error.message || 'Gagal mengubah password. Silakan coba lagi.';
      } finally {
        isChangingPassword.value = false;
      }
    };

    onBeforeUnmount(() => {
      if (profilePicture.value) URL.revokeObjectURL(profilePicture.value);
    });

    return {
      activeTab,
      profile,
      roleLabel,
      profileInput,
      profilePicture,
      userInitial,
      triggerProfileUpload,
      handleProfileUpload,
      handleSave,
      passwordForm,
      passwordErrors,
      isChangingPassword,
      passwordSuccessMessage,
      passwordErrorMessage,
      resetPasswordForm,
      handleChangePassword
    };
  }
};
