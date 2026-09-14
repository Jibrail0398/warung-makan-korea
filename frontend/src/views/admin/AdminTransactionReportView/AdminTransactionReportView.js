import { ref, computed, onMounted } from 'vue';
import StatusBadge from '../../../components/admin/StatusBadge.vue';
import './AdminTransactionReportView.css';

export default {
  name: 'AdminTransactionReportView',
  components: { StatusBadge },
  setup() {
    const periodType = ref('today');
    const todayStr = new Date().toISOString().split('T')[0];
    const monthStr = todayStr.substring(0, 7);
    const selectedDate = ref(todayStr);
    const selectedMonth = ref(monthStr);
    const reportData = ref({ orders: [], summary: {} });
    const printTimestamp = ref('');

    const loadReport = () => {
      reportData.value = { orders: [], summary: { totalOrders: 0, completedOrders: 0, cancelledOrders: 0, formattedRevenue: '₩0' } };
      const now = new Date();
      printTimestamp.value = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    };

    onMounted(() => { loadReport(); });

    const setPeriod = (type) => { periodType.value = type; loadReport(); };

    const periodTitle = computed(() => {
      if (periodType.value === 'today') return `Harian (${selectedDate.value})`;
      return `Bulanan (${selectedMonth.value})`;
    });

    const handlePrint = () => { window.print(); };

    return { periodType, selectedDate, selectedMonth, reportData, printTimestamp, loadReport, setPeriod, periodTitle, handlePrint };
  }
};
