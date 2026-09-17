import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { audioService } from '../../../services/audioService.js';
import { orderService } from '../../../services/orderService.js';
import { newOrderListService } from '../../../services/newOrderListService.js';
import StatusBadge from '../../../components/admin/StatusBadge/StatusBadge.vue';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner.vue';
import './AdminOrdersView.css';

export default {
  name: 'AdminOrdersView',
  components: { StatusBadge, LoadingSpinner },
  setup() {
    const orders = ref([]);
    const searchQuery = ref('');
    const isPageLoading = ref(false);

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
      isPageLoading.value = true;
      try {
        const data = await orderService.getAllOrders({
          paymentStatus: paymentStatusFilter.value,
          orderStatus: orderStatusFilter.value,
          date: filterDate.value
        });
        orders.value = data.data || data;
      } catch (e) {
        console.error('Load orders error:', e);
      } finally {
        isPageLoading.value = false;
      }
    };

    onMounted(() => {
      loadOrders();

      // Realtime: pesanan baru langsung masuk ke daftar tanpa refresh
      newOrderListService.start((order) => {
        // Hanya reload jika pesanan baru sesuai filter tanggal yang sedang aktif
        const orderDate = (order?.created_at || '').slice(0, 10);
        const localDate = orderDate ? new Date(order.created_at).toLocaleDateString('sv-SE') : '';
        if (!localDate || localDate === filterDate.value) {
          loadOrders();
        }
      });
    });

    onUnmounted(() => {
      newOrderListService.stop();
    });

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

    const paymentStatusLabel = (status) => ({
      unpaid: 'Unpaid',
      awaiting_verification: 'Menunggu konfirmasi',
      paid: 'Paid'
    }[status] || status);

    const openProof = (url) => {
      window.open(url, '_blank');
    };

    const handleSimulateIncoming = async () => {
      audioService.playOrderChime();
      await loadOrders();
    };

    return {
      orders,
      isPageLoading,
      paymentStatusFilter,
      orderStatusFilter,
      filterDate,
      searchQuery,
      filteredOrders,
      paymentStatusLabel,
      openProof,
      handleSimulateIncoming
    };
  }
};
