import { onMounted, ref } from 'vue';
import AdminHeader from '../../../components/admin/AdminHeader/AdminHeader.vue';
import AdminSidebar from '../../../components/admin/AdminSidebar.vue';
import AdminFooter from '../../../components/admin/AdminFooter.vue';
import ToastNotification from '../../../components/common/ToastNotification.vue';
import { useAuthStore } from '../../../stores/auth.js';
import { useToast } from '../../../composables/useToast.js';
import './AdminLayout.css';

export default {
  name: 'AdminLayout',
  components: { AdminHeader, AdminSidebar, AdminFooter, ToastNotification },
  setup() {
    const isSidebarOpen = ref(false);
    const isSidebarCollapsed = ref(false);
    const latestOrder = ref(null);
    const authStore = useAuthStore();
    const isSuperAdmin = ref(false);
    const { isToastVisible, toastMessage, toastType, showToast } = useToast();

    onMounted(async () => {
      await authStore.hydrate();
      const role = authStore.user?.role?.toLowerCase();
      isSuperAdmin.value = role === 'superadmin';
    });

    const handleToggleSidebar = () => {
      if (typeof window !== 'undefined' && window.innerWidth <= 1040) {
        isSidebarOpen.value = !isSidebarOpen.value;
      } else {
        isSidebarCollapsed.value = !isSidebarCollapsed.value;
      }
    };

    const handleNewOrderNotification = (order) => {
      showToast('Ada pesanan masuk');
      latestOrder.value = order;
      setTimeout(() => {
        if (latestOrder.value?.id === order.id) latestOrder.value = null;
      }, 15000);
    };

    return { isSidebarOpen, isSidebarCollapsed, latestOrder, isSuperAdmin, isToastVisible, toastMessage, toastType, handleToggleSidebar, handleNewOrderNotification };
  }
};
