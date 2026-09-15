import { h, ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../../stores/auth.js';
import StatCard from '../../../components/admin/StatCard/StatCard.vue';
import SalesOverview from '../../../components/admin/SalesOverview/SalesOverview.vue';
import RecentOrders from '../../../components/admin/RecentOrders/RecentOrders.vue';
import { orderService } from '../../../services/orderService.js';
import { reportService } from '../../../services/reportService.js';
import './AdminDashboardView.css';

const OrderIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none' }, [
      h('rect', { x: '4', y: '5', width: '16', height: '15', rx: '2', stroke: 'currentColor', 'stroke-width': '1.8' }),
      h('path', { d: 'M8 5V3M16 5V3M8 10h8M8 14h5', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round' })
    ]);
  }
};

const RevenueIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none' }, [
      h('path', { d: 'M12 3V21', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round' }),
      h('path', { d: 'M16 7.5C16 5.8 14.3 5 12 5C9.7 5 8 5.9 8 7.5C8 9.1 9.4 9.8 12 10.5C14.6 11.2 16 11.9 16 13.7C16 15.6 14.3 17 12 17C9.7 17 8 16.2 8 14.5', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round' })
    ]);
  }
};

const PendingIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none' }, [
      h('circle', { cx: '12', cy: '12', r: '8', stroke: 'currentColor', 'stroke-width': '1.8' }),
      h('path', { d: 'M12 7v5l3 2', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
    ]);
  }
};

const CompletedIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none' }, [
      h('circle', { cx: '12', cy: '12', r: '8', stroke: 'currentColor', 'stroke-width': '1.8' }),
      h('path', { d: 'M8.5 12l2.5 2.5 5-5', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
    ]);
  }
};

const getLocalDateString = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatCurrency = (value) => new Intl.NumberFormat('ko-KR', {
  style: 'currency', currency: 'KRW', maximumFractionDigits: 0
}).format(Number(value) || 0);

export default {
  name: 'AdminDashboardView',
  components: {
    StatCard,
    SalesOverview,
    RecentOrders
  },
  setup() {
    const authStore = useAuthStore();
    const adminName = computed(() => authStore.user?.name || 'Admin');

    const stats = ref({
      todayOrders: '0',
      todayRevenue: '₩0',
      pendingOrders: '0',
      completedOrders: '0'
    });

    const weeklyData = ref([]);
    const hourlyData = ref([]);
    const reportSummary = ref({});

    const loadDashboard = async () => {
      try {
        const today = getLocalDateString();

        // Statistik hari ini diambil dari data pesanan (GET /orders).
        const list = await orderService.getAllOrdersComplete({ date: today });

        const paidOrders = list.filter((order) => order.payment_status === 'paid');
        const completedOrders = list.filter((order) => order.status === 'completed');
        const pendingOrders = list.filter((order) => ['pending', 'preparing', 'ready'].includes(order.status));
        const revenue = paidOrders.reduce((sum, order) => sum + (Number(order.total_price) || 0), 0);

        stats.value = {
          todayOrders: String(list.length),
          todayRevenue: formatCurrency(revenue),
          pendingOrders: String(pendingOrders.length),
          completedOrders: String(completedOrders.length)
        };

        // Data chart dari laporan penjualan.
        const [daily, weekly] = await Promise.all([
          reportService.getSalesReport('daily'),
          reportService.getSalesReport('weekly')
        ]);

        reportSummary.value = daily?.summary || {};

        hourlyData.value = (daily?.breakdown || []).map((item) => ({
          label: item.label,
          amount: Number(item.revenue) || 0
        }));

        weeklyData.value = (weekly?.breakdown || []).map((item) => ({
          label: item.label,
          amount: Number(item.revenue) || 0,
          isToday: item.date === today
        }));
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    onMounted(() => {
      loadDashboard();
    });

    return {
      adminName,
      stats,
      weeklyData,
      hourlyData,
      reportSummary,
      formatCurrency,
      OrderIcon,
      RevenueIcon,
      PendingIcon,
      CompletedIcon
    };
  }
};
