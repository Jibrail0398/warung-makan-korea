import { ref, computed, onMounted } from 'vue';
import { audioService } from '../../../services/audioService.js';
import { orderService } from '../../../services/orderService.js';
import StatusBadge from '../../../components/admin/StatusBadge.vue';
import './AdminOrdersView.css';

export default {
  name: 'AdminOrdersView',
  components: { StatusBadge },
  setup() {
    const orders = ref([]);
    const selectedTab = ref('all');
    const searchQuery = ref('');

    const loadOrders = async () => {
      try {
        const data = await orderService.getAllOrders();
        orders.value = data.data || data;
      } catch (e) { console.error('Load orders error:', e); }
    };

    onMounted(() => { loadOrders(); });

    const countByPaymentStatus = (paymentStatus) => orders.value.filter(order => order.payment_status === paymentStatus).length;

    const filteredOrders = computed(() => {
      return orders.value.filter(order => {
        const tabMatch = selectedTab.value === 'all' || order.payment_status === selectedTab.value;
        const q = searchQuery.value.trim().toLowerCase();
        const searchMatch = !q || (order.id + ' ' + (order.customer_name || '') + ' ' + (order.customer_phone || '')).toLowerCase().includes(q);
        return tabMatch && searchMatch;
      });
    });

    const handleSimulateIncoming = async () => {
      audioService.playOrderChime();
      await loadOrders();
    };

    return { orders, selectedTab, searchQuery, countByPaymentStatus, filteredOrders, handleSimulateIncoming };
  }
};
