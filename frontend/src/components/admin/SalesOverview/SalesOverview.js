import { ref, computed } from 'vue';
import './SalesOverview.css';

export default {
  name: 'SalesOverview',
  props: {
    weeklyData: { type: Array, default: () => [] },
    hourlyData: { type: Array, default: () => [] },
    summary: { type: Object, default: () => ({}) },
    formatCurrency: { type: Function, default: null }
  },
  setup(props) {
    const activeTab = ref('weekly');

    const currentData = computed(() => (activeTab.value === 'weekly' ? props.weeklyData : props.hourlyData));

    const maxAmount = computed(() => Math.max(...currentData.value.map((d) => Number(d.amount) || 0), 0) || 1);

    const format = (value) => {
      if (props.formatCurrency) return props.formatCurrency(value);
      return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(Number(value) || 0);
    };

    return { activeTab, currentData, maxAmount, format };
  }
};
