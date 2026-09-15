import { ref, onMounted } from 'vue';
import StatusBadge from '../../../components/admin/StatusBadge/StatusBadge.vue';
import { orderService } from '../../../services/orderService.js';
import './AdminTransactionReportView.css';

const getLocalDateString = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatCurrency = (value) => new Intl.NumberFormat('ko-KR', {
  style: 'currency', currency: 'KRW', maximumFractionDigits: 0
}).format(Number(value) || 0);

const mapOrder = (order) => {
  const created = new Date(order.created_at);
  return {
    id: order.id,
    date: created.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: created.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    orderNumber: order.id,
    customer: {
      name: order.customer_name || '-',
      phone: order.customer_phone || '-'
    },
    items: (order.items || []).map((item) => ({
      quantity: item.quantity,
      name: item.product?.name || 'Produk'
    })),
    paymentMethod: order.bank_account_name || 'Tunai / Lainnya',
    total: Number(order.total_price) || 0,
    status: order.status
  };
};

const monthRange = (monthValue) => {
  const [year, month] = monthValue.split('-').map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  return {
    start: `${monthValue}-01`,
    end: `${monthValue}-${String(lastDay).padStart(2, '0')}`
  };
};

export default {
  name: 'AdminTransactionReportView',
  components: { StatusBadge },
  setup() {
    const periodType = ref('today');
    const todayStr = getLocalDateString();
    const selectedDate = ref(todayStr);
    const selectedMonth = ref(todayStr.substring(0, 7));
    const statusFilter = ref('all');
    const statusOptions = [
      { value: 'all', label: 'Semua Status' },
      { value: 'pending', label: 'Pending' },
      { value: 'preparing', label: 'Preparing' },
      { value: 'ready', label: 'Ready' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' }
    ];

    const reportData = ref({ orders: [], summary: {} });
    const isLoading = ref(false);
    const errorMessage = ref('');

    const buildFilters = () => {
      const filters = { orderStatus: statusFilter.value };

      if (periodType.value === 'today') {
        filters.date = selectedDate.value;
      } else {
        const { start, end } = monthRange(selectedMonth.value);
        filters.startDate = start;
        filters.endDate = end;
      }

      return filters;
    };

    const loadReport = async () => {
      isLoading.value = true;
      errorMessage.value = '';
      reportData.value = { orders: [], summary: {} };

      try {
        const orders = await orderService.getAllOrdersComplete(buildFilters());

        const paidOrders = orders.filter((order) => order.payment_status === 'paid');
        const completedOrders = orders.filter((order) => order.status === 'completed');
        const cancelledOrders = orders.filter((order) => order.status === 'cancelled');
        const revenue = paidOrders.reduce((sum, order) => sum + (Number(order.total_price) || 0), 0);

        reportData.value = {
          orders: orders.map(mapOrder),
          summary: {
            totalOrders: orders.length,
            completedOrders: completedOrders.length,
            cancelledOrders: cancelledOrders.length,
            revenue,
            formattedRevenue: formatCurrency(revenue)
          }
        };
      } catch (error) {
        errorMessage.value = error.message || 'Gagal memuat laporan transaksi.';
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      loadReport();
    });

    const setPeriod = (type) => {
      periodType.value = type;
      loadReport();
    };

    const buildExportFileName = () => {
      const period = periodType.value === 'today' ? selectedDate.value : selectedMonth.value;
      return `laporan-transaksi-${period}.csv`;
    };

    const downloadCsv = () => {
      const orders = reportData.value.orders || [];
      if (!orders.length) return;

      const headers = ['Tanggal', 'Jam', 'No. Pesanan', 'Customer', 'No. Telepon', 'Item Dipesan', 'Metode Bayar', 'Total (KRW)', 'Status'];
      const escapeCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

      const lines = [headers.map(escapeCell).join(',')];

      orders.forEach((order) => {
        const items = (order.items || []).map((item) => `${item.quantity}x ${item.name}`).join('; ');
        lines.push([
          order.date,
          order.time,
          order.orderNumber || order.id,
          order.customer?.name || '',
          order.customer?.phone || '',
          items,
          order.paymentMethod || '',
          order.total || 0,
          order.status || ''
        ].map(escapeCell).join(','));
      });

      // BOM agar karakter non-ASCII tampil benar saat dibuka di Excel.
      const csvContent = `\uFEFF${lines.join('\r\n')}`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = buildExportFileName();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    return {
      periodType,
      selectedDate,
      selectedMonth,
      statusFilter,
      statusOptions,
      reportData,
      isLoading,
      errorMessage,
      loadReport,
      setPeriod,
      downloadCsv
    };
  }
};
