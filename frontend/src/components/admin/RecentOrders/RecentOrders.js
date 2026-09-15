import StatusBadge from '../StatusBadge/StatusBadge.vue';
import './RecentOrders.css';

export default {
  name: 'RecentOrders',
  components: { StatusBadge },
  setup() {
    const orders = [{ id: '#WN-10231', customer: 'Kelvin', item: 'Nasi Goreng', total: 24000, status: 'Completed' }, { id: '#WN-10230', customer: 'Andi', item: 'Rendang', total: 15000, status: 'Pending' }, { id: '#WN-10229', customer: 'Rina', item: 'Sate Ayam', total: 28000, status: 'Processing' }, { id: '#WN-10228', customer: 'Dina', item: 'Ayam Geprek', total: 13000, status: 'Completed' }];
    const formatCurrency = (value) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(value);
    return { orders, formatCurrency };
  }
};
