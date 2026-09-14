import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth.js';
import './AdminSidebar.css';

export default {
  name: 'AdminSidebar',
  props: { isOpen: { type: Boolean, default: false }, isCollapsed: { type: Boolean, default: false }, isSuperAdmin: { type: Boolean, default: false } },
  emits: ['close', 'toggle-collapse'],
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const pendingOrdersCount = ref(0);
    onMounted(() => { pendingOrdersCount.value = 0; });
    const isCurrentRoute = (path) => route.path === path;
    const handleLogout = () => { authStore.logout(); router.push('/login'); };
    return { pendingOrdersCount, isCurrentRoute, handleLogout };
  }
};
