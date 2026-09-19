import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

import { useCartStore } from '../../../stores/cart.js';
import { useAuthStore } from '../../../stores/auth.js';
import { useHeaderScroll } from '../../../composables/useHeaderScroll.js';

import MobileDrawer from '../MobileDrawer/MobileDrawer.vue';
import ConfirmModal from '../../common/ConfirmModal/ConfirmModal.vue';
import './AppHeader.css';

export default {
  name: 'AppHeader',
  components: {
    MobileDrawer,
    ConfirmModal
  },
  props: {
    variant: {
      type: String,
      default: 'default'
    },
    title: {
      type: String,
      default: 'Checkout'
    }
  },
  setup() {
    const route = useRoute();

    const cartStore = useCartStore();
    const authStore = useAuthStore();
    const isDrawerOpen = ref(false);
    const showLogoutConfirm = ref(false);

    const isLoggedIn = computed(() => {
      return (
        authStore.isAuthenticated ||
        !!localStorage.getItem('warung-token') ||
        !!localStorage.getItem('token')
      );
    });

    const userName = computed(() => {
      return (
        authStore.user?.name ||
        authStore.user?.username ||
        'Pelanggan'
      );
    });

    const userInitial = computed(() => {
      return userName.value
        ? userName.value.charAt(0).toUpperCase()
        : 'U';
    });

    const userRole = computed(() => {
      if (authStore.isSuperAdmin) return 'Super Admin';
      if (authStore.isAdmin) return 'Admin / Kasir';
      if (authStore.isKasir) return 'Kasir';
      return authStore.user?.role || 'Pelanggan';
    });

    const isAdminOrStaff = computed(() => {
      return (
        authStore.isAdmin ||
        authStore.isKasir ||
        authStore.isSuperAdmin
      );
    });

    const isSuperAdmin = computed(() => {
      return authStore.isSuperAdmin;
    });

    const adminDashboardPath = computed(() => {
      if (authStore.isSuperAdmin) return '/admin/audit-logs';
      return '/admin/dashboard';
    });

    const activeSection = computed(() => {
      if (route.path !== '/') return '';
      if (route.hash === '#menu') return 'menu';
      if (route.hash === '#about') return 'about';
      return 'home';
    });

    const { isHeaderVisible } = useHeaderScroll(isDrawerOpen);

    authStore.hydrate();

    function setDrawer(open) {
      isDrawerOpen.value = open;

      if (open) {
        document.body.classList.add('drawer-active');
      } else {
        document.body.classList.remove('drawer-active');
      }
    }

    function toggleDrawer() {
      setDrawer(!isDrawerOpen.value);
    }

    function closeDrawer() {
      setDrawer(false);
    }

    function handleLogout() {
      // Close profile details if open
      const details = document.querySelector('.user-dropdown, .profile-dropdown');
      if (details) {
        details.removeAttribute('open');
      }
      showLogoutConfirm.value = true;
    }

    function confirmLogout() {
      showLogoutConfirm.value = false;
      authStore.logout();
    }

    return {
      cartStore,
      authStore,
      isDrawerOpen,
      isLoggedIn,
      userName,
      userInitial,
      userRole,
      isAdminOrStaff,
      isSuperAdmin,
      adminDashboardPath,
      activeSection,
      isHeaderVisible,
      showLogoutConfirm,
      toggleDrawer,
      closeDrawer,
      handleLogout,
      confirmLogout
    };
  }
};
