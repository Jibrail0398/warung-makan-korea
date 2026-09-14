import { ref, computed, onMounted } from 'vue';
import './AdminFinancialReportView.css';

export default {
  name: 'AdminFinancialReportView',
  setup() {
    const periodType = ref('month');
    const todayStr = new Date().toISOString().split('T')[0];
    const monthStr = todayStr.substring(0, 7);

    const selectedMonth = ref(monthStr);
    const finData = ref({});
    const printTimestamp = ref('');

    const loadReport = () => {
      finData.value = {
        totalRevenue: 0,
        formattedRevenue: '₩0',
        completedCount: 0,
        formattedAvgOrderValue: '₩0',
        breakdown: {
          restaurantRevenue: 0,
          formattedRestaurantRevenue: '₩0',
          rawRevenue: 0,
          formattedRawRevenue: '₩0'
        },
        topProducts: []
      };
      const now = new Date();
      printTimestamp.value = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    };

    onMounted(() => {
      loadReport();
    });

    const setPeriod = (type) => {
      periodType.value = type;
      loadReport();
    };

    const restaurantPercent = computed(() => {
      const tot = finData.value.totalRevenue || 0;
      if (!tot) return 50;
      const rest = finData.value.breakdown?.restaurantRevenue || 0;
      return Math.round((rest / tot) * 100);
    });

    const rawPercent = computed(() => {
      return 100 - restaurantPercent.value;
    });

    const handlePrint = () => {
      window.print();
    };

    return {
      periodType,
      selectedMonth,
      finData,
      printTimestamp,
      loadReport,
      setPeriod,
      restaurantPercent,
      rawPercent,
      handlePrint
    };
  }
};
