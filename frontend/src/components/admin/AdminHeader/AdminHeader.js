import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth.js';
import { audioService } from '../../../services/audioService.js';
import { newOrderNotificationService } from '../../../services/newOrderNotificationService.js';
import './AdminHeader.css';

export default {
  name: 'AdminHeader',
  props: {
    isSuperAdmin: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle-sidebar', 'new-order-received'],
  setup(props, { emit }) {
    const router = useRouter();
    const authStore = useAuthStore();

    const isSoundOn = ref(true);

    onMounted(async () => {
      isSoundOn.value = audioService.isSoundEnabled();
      await authStore.hydrate();

      const role = authStore.user?.role?.toLowerCase();
      if (role === 'admin') {
        console.log('[AdminHeader] starting new-order listener');
        newOrderNotificationService.start((order) => {
          console.log('[AdminHeader] new-order event received, playing audio', order);
          audioService.playOrderChime();
          emit('new-order-received', order);
        });
      }
    });

    onBeforeUnmount(() => {
      newOrderNotificationService.stop();
    });

    const toggleSound = () => {
      isSoundOn.value = audioService.toggleSound();
    };

    const roleLabel = computed(() => {
      if (props.isSuperAdmin) return 'Super Admin (Developer)';
      return authStore.user?.role || 'Admin / Kasir';
    });

    const roleTone = computed(() => {
      if (props.isSuperAdmin) return 'super';
      return 'admin';
    });

    const userName = computed(() => {
      return authStore.user?.name || 'Admin';
    });

    const userEmail = computed(() => {
      return authStore.user?.email || '-';
    });

    const userRole = computed(() => {
      if (props.isSuperAdmin) return 'Super Admin';
      return authStore.user?.role || 'Admin';
    });

    const userInitial = computed(() => {
      return (userName.value || 'A').charAt(0).toUpperCase();
    });

    const handleLogout = () => {
      authStore.logout();
      router.push('/admin/login');
    };

    return {
      isSoundOn,
      toggleSound,
      roleLabel,
      roleTone,
      userName,
      userEmail,
      userRole,
      userInitial,
      handleLogout
    };
  }
};
