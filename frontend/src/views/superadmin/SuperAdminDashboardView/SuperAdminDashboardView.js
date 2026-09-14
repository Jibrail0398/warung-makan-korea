import { ref, onMounted } from 'vue';
import './SuperAdminDashboardView.css';

export default {
  name: 'SuperAdminDashboardView',
  setup() {
    const adminsCount = ref(3);
    const auditLogsCount = ref(8);
    const recentLogs = ref([]);
    onMounted(() => {
      adminsCount.value = 3;
      auditLogsCount.value = 8;
      recentLogs.value = [
        { id: 'LOG-001', timestamp: '2025-01-01 09:00', actor: 'admin_01', action: 'LOGIN', resource: 'Admin Session' },
        { id: 'LOG-002', timestamp: '2025-01-01 09:15', actor: 'kasir_01', action: 'UPDATE_ORDER_STATUS', resource: 'Order #1001' },
        { id: 'LOG-003', timestamp: '2025-01-01 09:30', actor: 'admin_01', action: 'CREATE_PRODUCT', resource: 'Kimchi Fried Rice' },
        { id: 'LOG-004', timestamp: '2025-01-01 10:00', actor: 'super_admin', action: 'RESET_PASSWORD', resource: 'kasir_02' },
        { id: 'LOG-005', timestamp: '2025-01-01 10:30', actor: 'admin_01', action: 'VERIFY_PAYMENT', resource: 'Order #1002' }
      ];
    });
    return { adminsCount, auditLogsCount, recentLogs };
  }
};
