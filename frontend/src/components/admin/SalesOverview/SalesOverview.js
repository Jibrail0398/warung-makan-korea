import { ref, computed } from 'vue';
import './SalesOverview.css';

export default {
  name: 'SalesOverview',
  setup() {
    const activeTab = ref('weekly');
    const weeklyData = [{ label: 'Sen', amount: 920000, isToday: false }, { label: 'Sel', amount: 1150000, isToday: false }, { label: 'Rab', amount: 840000, isToday: false }, { label: 'Kam', amount: 1240000, isToday: true }, { label: 'Jum', amount: 1480000, isToday: false }, { label: 'Sab', amount: 2100000, isToday: false }, { label: 'Min', amount: 1950000, isToday: false }];
    const hourlyData = [{ label: '11:00', amount: 180000, isCurrentHour: false }, { label: '12:00', amount: 340000, isCurrentHour: false }, { label: '13:00', amount: 290000, isCurrentHour: false }, { label: '14:00', amount: 120000, isCurrentHour: false }, { label: '15:00', amount: 95000, isCurrentHour: false }, { label: '16:00', amount: 150000, isCurrentHour: false }, { label: '17:00', amount: 220000, isCurrentHour: false }, { label: '18:00', amount: 380000, isCurrentHour: true }];
    const currentData = computed(() => activeTab.value === 'weekly' ? weeklyData : hourlyData);
    const maxAmount = computed(() => Math.max(...currentData.value.map(d => d.amount)) || 1);
    return { activeTab, currentData, maxAmount };
  }
};
