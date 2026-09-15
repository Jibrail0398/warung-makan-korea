import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

import { useCartStore } from '../../../stores/cart.js';
import { useAuthStore } from '../../../stores/auth.js';
import { useHeaderScroll } from '../../../composables/useHeaderScroll.js';

import MobileDrawer from '../MobileDrawer/MobileDrawer.vue';
import './AppHeader.css';

export default {
  name: 'AppHeader',
  components: {
    MobileDrawer
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
      authStore.logout();
    }

    return {
      cartStore,
      authStore,
      isDrawerOpen,
      isLoggedIn,
      userName,
      userInitial,
      isAdminOrStaff,
      isSuperAdmin,
      activeSection,
      isHeaderVisible,
      toggleDrawer,
      closeDrawer,
      handleLogout
    };
  }
};
