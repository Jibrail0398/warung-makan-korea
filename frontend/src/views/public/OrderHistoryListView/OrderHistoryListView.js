import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '../../../components/layout/AppHeader/AppHeader.vue';
import AppFooter from '../../../components/layout/AppFooter/AppFooter.vue';
import OrderCard from '../../../components/orders/OrderCard/OrderCard.vue';
import { orderService } from '../../../services/orderService.js';
import './OrderHistoryListView.css';

export default {
  name: 'OrderHistoryListView',
  components: { AppHeader, AppFooter, OrderCard },
  setup() {
    const router = useRouter();
    const searchQuery = ref('');
    const activeFilter = ref('all');
    const isLoading = ref(false);
    const orders = ref([]);
    const filters = [{ label: 'All', value: 'all' }, { label: 'Completed', value: 'completed' }, { label: 'In Progress', value: 'in-progress' }, { label: 'Cancelled', value: 'cancelled' }];
    const filteredOrders = computed(() => {
      const query = searchQuery.value.trim().toLowerCase();
      return orders.value.filter((order) => {
        const status = (order.status || '').toLowerCase();
        let matchesFilter = true;
        if (activeFilter.value === 'completed') matchesFilter = status === 'completed';
        else if (activeFilter.value === 'in-progress') matchesFilter = ['pending', 'preparing', 'ready'].includes(status);
        else if (activeFilter.value === 'cancelled') matchesFilter = status === 'cancelled';
        const matchesId = (order.id || '').toLowerCase().includes(query);
        const matchesItem = (order.items || []).some((item) => (item.name || '').toLowerCase().includes(query));
        return matchesFilter && (!query || matchesId || matchesItem);
      });
    });
    function setFilter(val) { activeFilter.value = val; }
    function resetFilters() { searchQuery.value = ''; activeFilter.value = 'all'; }
    function handleViewOrder(order) { const orderId = order.id || order.orderId; router.push(`/order-history/${orderId}`); }
    onMounted(async () => { isLoading.value = true; try { orders.value = await orderService.getOrderHistory(); } finally { isLoading.value = false; } });
    return { searchQuery, activeFilter, isLoading, orders, filters, filteredOrders, setFilter, resetFilters, handleViewOrder };
  }
};
