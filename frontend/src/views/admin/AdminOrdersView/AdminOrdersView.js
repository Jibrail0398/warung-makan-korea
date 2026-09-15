import { ref, computed, onMounted, watch } from 'vue';
import { audioService } from '../../../services/audioService.js';
import { orderService } from '../../../services/orderService.js';
import StatusBadge from '../../../components/admin/StatusBadge/StatusBadge.vue';
import './AdminOrdersView.css';

export default {
  name: 'AdminOrdersView',
  components: { StatusBadge },
  setup() {
    const orders = ref([]);
    const searchQuery = ref('');

    // Filter dari server (bukan client-side)
    const paymentStatusFilter = ref('all');
    const orderStatusFilter = ref('all');

    // Default: pesanan hari ini
    const getToday = () => {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };
    const filterDate = ref(getToday());

    const loadOrders = async () => {
      try {
        const data = await orderService.getAllOrders({
          paymentStatus: paymentStatusFilter.value,
          orderStatus: orderStatusFilter.value,
          date: filterDate.value
        });
        orders.value = data.data || data;
      } catch (e) { console.error('Load orders error:', e); }
    };

    onMounted(() => { loadOrders(); });

    // Filter dikirim ke server; setiap perubahan reload ke data terbaru dari backend
    watch([paymentStatusFilter, orderStatusFilter, filterDate], () => {
      loadOrders();
    });

    const filteredOrders = computed(() => {
      // Hanya pencarian teks yang dilakukan client-side pada data halaman ini
      const q = searchQuery.value.trim().toLowerCase();
      if (!q) return orders.value;
      return orders.value.filter(order => {
        return (order.id + ' ' + (order.customer_name || '') + ' ' + (order.customer_phone || '')).toLowerCase().includes(q);
      });
    });

    const handleSimulateIncoming = async () => {
      audioService.playOrderChime();
      await loadOrders();
    };

    return { orders, paymentStatusFilter, orderStatusFilter, filterDate, searchQuery, filteredOrders, handleSimulateIncoming };
  }
};
