import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth.js';
import ConfirmModal from '../../common/ConfirmModal/ConfirmModal.vue';
import './AdminSidebar.css';

export default {
  name: 'AdminSidebar',
  components: {
    ConfirmModal
  },
  props: {
    isOpen: { type: Boolean, default: false },
    isCollapsed: { type: Boolean, default: false },
    isSuperAdmin: { type: Boolean, default: false }
  },
  emits: ['close', 'toggle-collapse'],
  setup(props, { emit }) {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const pendingOrdersCount = ref(0);
    const showLogoutConfirm = ref(false);

    onMounted(() => {
      pendingOrdersCount.value = 0;
    });

    const isCurrentRoute = (path) => route.path === path;

    const handleLogout = () => {
      showLogoutConfirm.value = true;
    };

    const confirmLogout = () => {
      showLogoutConfirm.value = false;
      emit('close');
      authStore.logout();
      router.push('/admin/login');
    };

    return {
      pendingOrdersCount,
      isCurrentRoute,
      showLogoutConfirm,
      handleLogout,
      confirmLogout
    };
  }
};
