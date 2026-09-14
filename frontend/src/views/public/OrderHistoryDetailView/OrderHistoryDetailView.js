import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { jsPDF } from 'jspdf';
import AppHeader from '../../../components/layout/AppHeader.vue';
import AppFooter from '../../../components/layout/AppFooter.vue';
import ToastNotification from '../../../components/common/ToastNotification.vue';
import { orderService } from '../../../services/orderService.js';
import { useToast } from '../../../composables/useToast.js';
import './OrderHistoryDetailView.css';

export default {
  name: 'OrderHistoryDetailView',
  components: { AppHeader, AppFooter, ToastNotification },
  setup() {
    const route = useRoute();
    const { isToastVisible, toastMessage, showToast } = useToast();
    const order = ref({});
    const isLoading = ref(true);
    const loadError = ref('');
    const orderId = computed(() => route.params.id);
    const isAuthenticated = computed(() => Boolean(localStorage.getItem('warung-auth-key')));
    const items = computed(() => order.value.items || []);
    const paymentStatus = computed(() => ['unpaid', 'awaiting_verification', 'paid'].includes(order.value.payment_status) ? order.value.payment_status : 'unpaid');
    const paymentStatusLabel = computed(() => ({ unpaid: 'Unpaid', awaiting_verification: 'Awaiting verification', paid: 'Paid' }[paymentStatus.value]));
    const paymentStatusDescription = computed(() => ({ unpaid: 'Pembayaran belum diterima. Silakan lakukan transfer sesuai instruksi checkout.', awaiting_verification: 'Bukti transfer sudah diterima dan sedang diperiksa oleh kasir.', paid: 'Pembayaran pesanan ini sudah dikonfirmasi oleh kasir.' }[paymentStatus.value]));
    const totalQuantity = computed(() => items.value.reduce((sum, item) => sum + Number(item.quantity || 0), 0));

    async function loadOrder() {
      isLoading.value = true; loadError.value = '';
      try { order.value = await orderService.getOrderById(orderId.value); } catch (error) { loadError.value = error.message || 'Detail pesanan tidak dapat dimuat.'; } finally { isLoading.value = false; }
    }
    function formatPrice(value) { return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(Number(value) || 0); }
    function formatDateTime(value) { if (!value) return 'Waktu pesanan tidak tersedia'; return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); }
    function handleDownloadReceipt() {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const pw = doc.internal.pageSize.getWidth(); const l = 18; const r = pw - l;
      const isf = items.value.length > 34 ? 7 : 9; const rh = items.value.length > 34 ? 5 : 7;
      const mr = Math.floor((270 - 112) / rh); const vi = items.value.slice(0, mr);
      doc.setTextColor(36,25,18); doc.setFont('helvetica','bold'); doc.setFontSize(18); doc.text('Warung Makan Korea', l, 22);
      doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(109,98,91); doc.text('Struk pesanan digital', l, 29);
      doc.setDrawColor(221,211,202); doc.line(l, 36, r, 36);
      doc.setTextColor(36,25,18); doc.setFontSize(9); doc.text(`Pesanan: ${order.value.id}`, l, 47);
      doc.text(`Waktu: ${formatDateTime(order.value.created_at)}`, l, 54); doc.text(`Pelanggan: ${order.value.customer_name || '-'}`, l, 61);
      doc.text(`Status pembayaran: ${paymentStatusLabel.value}`, l, 68);
      doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.text('Item pesanan', l, 84); doc.text('Jumlah', r, 84, { align: 'right' }); doc.line(l, 88, r, 88);
      doc.setFont('helvetica','normal'); doc.setFontSize(isf);
      vi.forEach((item, i) => { const y = 96 + i * rh; const nm = `${item.product?.name || 'Produk'} x ${item.quantity}`; const pr = formatPrice(item.sub_total || item.price * item.quantity); doc.text(nm.slice(0,70), l, y); doc.text(pr, r, y, { align: 'right' }); });
      if (vi.length < items.value.length) { doc.setTextColor(109,98,91); doc.text(`+ ${items.value.length - vi.length} item lainnya`, l, 96 + vi.length * rh); }
      const ty = Math.min(96 + (vi.length + 1) * rh + 8, 258); doc.setTextColor(36,25,18); doc.setDrawColor(36,25,18); doc.line(l, ty - 6, r, ty - 6);
      doc.setFont('helvetica','bold'); doc.setFontSize(13); doc.text(`Total ${formatPrice(order.value.total_price)}`, r, ty, { align: 'right' });
      doc.save(`struk-${order.value.id}.pdf`); showToast('Struk berhasil diunduh');
    }
    onMounted(loadOrder); watch(orderId, loadOrder);
    return { order, isLoading, loadError, items, paymentStatus, paymentStatusLabel, paymentStatusDescription, totalQuantity, isToastVisible, toastMessage, formatPrice, formatDateTime, handleDownloadReceipt };
  }
};
