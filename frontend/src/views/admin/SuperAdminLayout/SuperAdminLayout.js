import { ref } from 'vue';
import AdminHeader from '../../../components/admin/AdminHeader/AdminHeader.vue';
import AdminSidebar from '../../../components/admin/AdminSidebar.vue';
import AdminFooter from '../../../components/admin/AdminFooter.vue';
import './SuperAdminLayout.css';

export default {
  name: 'SuperAdminLayout',
  components: { AdminHeader, AdminSidebar, AdminFooter },
  setup() {
    const isSidebarOpen = ref(false);
    const isSidebarCollapsed = ref(false);

    const handleToggleSidebar = () => {
      if (typeof window !== 'undefined' && window.innerWidth <= 1040) {
        isSidebarOpen.value = !isSidebarOpen.value;
      } else {
        isSidebarCollapsed.value = !isSidebarCollapsed.value;
      }
    };

    return { isSidebarOpen, isSidebarCollapsed, handleToggleSidebar };
  }
};
