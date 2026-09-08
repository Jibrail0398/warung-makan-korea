<template>
  <div class="order-detail-page-wrap">
    <AppHeader variant="default" />
    <main class="order-detail-page">
      <div class="container">
        <router-link :to="'/'" class="back-link">
          <span aria-hidden="true">←</span> Belanja Kembali
        </router-link>
        <section v-if="isLoading" class="state-panel">Memuat detail pesanan...</section>
        <section v-else-if="loadError" class="state-panel state-error" role="alert">{{ loadError }}</section>
        <template v-else>
          <header class="page-heading">
            <div><p class="eyebrow">Detail pesanan</p><h1>Pesanan #{{ order.id }}</h1><p class="created-at">{{ formatDateTime(order.created_at) }}</p></div>
            <span class="status-badge" :class="`status-${paymentStatus}`">{{ paymentStatusLabel }}</span>
          </header>
          <section class="summary-strip" aria-label="Ringkasan pesanan">
            <div><span>Pelanggan</span><strong>{{ order.customer_name || 'Tidak dicantumkan' }}</strong></div>
            <div><span>Nomor telepon</span><strong>{{ order.customer_phone || 'Tidak dicantumkan' }}</strong></div>
            <div><span>Nomor meja</span><strong>{{ order.table_number || 'Takeaway' }}</strong></div>
          </section>
          <section class="content-grid">
            <article class="order-panel items-panel">
              <div class="panel-heading"><div><p class="panel-kicker">Isi pesanan</p><h2>{{ items.length }} produk</h2></div><span class="item-count">{{ totalQuantity }} item</span></div>
              <div v-if="items.length" class="items-list">
                <div v-for="item in items" :key="item.id" class="item-row"><div><h3>{{ item.product?.name || 'Produk' }}</h3><p>{{ formatPrice(item.price) }} × {{ item.quantity }}</p></div><strong>{{ formatPrice(item.sub_total || item.price * item.quantity) }}</strong></div>
              </div>
              <p v-else class="muted-copy">Belum ada item pada pesanan ini.</p>
              <div class="total-row"><span>Total harga</span><strong>{{ formatPrice(order.total_price) }}</strong></div>
            </article>
            <aside class="order-panel status-panel">
              <p class="panel-kicker">Status pembayaran</p>
              <div class="status-mark" :class="`status-${paymentStatus}`" aria-hidden="true">{{ paymentStatus === 'paid' ? '✓' : paymentStatus === 'unpaid' ? '!' : '…' }}</div>
              <h2>{{ paymentStatusLabel }}</h2><p>{{ paymentStatusDescription }}</p>
            </aside>
          </section>
          <section class="receipt-panel">
            <div><p class="panel-kicker">Struk digital</p><h2>Ringkasan pesanan siap diunduh</h2><p class="muted-copy">Struk ringkas satu halaman berisi waktu, item, status pembayaran, dan total.</p></div>
            <button type="button" class="download-button" @click="handleDownloadReceipt"><span aria-hidden="true">↓</span> Download struk</button>
          </section>
        </template>
      </div>
    </main>
    <AppFooter />
    <ToastNotification :visible="isToastVisible" :message="toastMessage" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { jsPDF } from 'jspdf';
import AppHeader from '../components/layout/AppHeader.vue';
import AppFooter from '../components/layout/AppFooter.vue';
import ToastNotification from '../components/common/ToastNotification.vue';
import { orderService } from '../services/orderService.js';
import { useToast } from '../composables/useToast.js';

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
  isLoading.value = true;
  loadError.value = '';
  try { order.value = await orderService.getOrderById(orderId.value); } catch (error) { loadError.value = error.message || 'Detail pesanan tidak dapat dimuat.'; } finally { isLoading.value = false; }
}
function formatPrice(value) { return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(Number(value) || 0); }
function formatDateTime(value) { if (!value) return 'Waktu pesanan tidak tersedia'; return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); }
function handleDownloadReceipt() {
  const document = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = document.internal.pageSize.getWidth();
  const left = 18;
  const right = pageWidth - left;
  const itemFontSize = items.value.length > 34 ? 7 : 9;
  const rowHeight = items.value.length > 34 ? 5 : 7;
  const maxRows = Math.floor((270 - 112) / rowHeight);
  const visibleItems = items.value.slice(0, maxRows);

  document.setTextColor(36, 25, 18);
  document.setFont('helvetica', 'bold');
  document.setFontSize(18);
  document.text('Warung Makan Korea', left, 22);
  document.setFont('helvetica', 'normal');
  document.setFontSize(9);
  document.setTextColor(109, 98, 91);
  document.text('Struk pesanan digital', left, 29);

  document.setDrawColor(221, 211, 202);
  document.line(left, 36, right, 36);
  document.setTextColor(36, 25, 18);
  document.setFontSize(9);
  document.text(`Pesanan: ${order.value.id}`, left, 47);
  document.text(`Waktu: ${formatDateTime(order.value.created_at)}`, left, 54);
  document.text(`Pelanggan: ${order.value.customer_name || '-'}`, left, 61);
  document.text(`Status pembayaran: ${paymentStatusLabel.value}`, left, 68);

  document.setFont('helvetica', 'bold');
  document.setFontSize(10);
  document.text('Item pesanan', left, 84);
  document.text('Jumlah', right, 84, { align: 'right' });
  document.line(left, 88, right, 88);
  document.setFont('helvetica', 'normal');
  document.setFontSize(itemFontSize);

  visibleItems.forEach((item, index) => {
    const y = 96 + index * rowHeight;
    const name = `${item.product?.name || 'Produk'} x ${item.quantity}`;
    const price = formatPrice(item.sub_total || item.price * item.quantity);
    document.text(name.slice(0, 70), left, y);
    document.text(price, right, y, { align: 'right' });
  });

  if (visibleItems.length < items.value.length) {
    document.setTextColor(109, 98, 91);
    document.text(`+ ${items.value.length - visibleItems.length} item lainnya`, left, 96 + visibleItems.length * rowHeight);
  }

  const totalY = Math.min(96 + (visibleItems.length + 1) * rowHeight + 8, 258);
  document.setTextColor(36, 25, 18);
  document.setDrawColor(36, 25, 18);
  document.line(left, totalY - 6, right, totalY - 6);
  document.setFont('helvetica', 'bold');
  document.setFontSize(13);
  document.text(`Total ${formatPrice(order.value.total_price)}`, right, totalY, { align: 'right' });
  document.save(`struk-${order.value.id}.pdf`);
  showToast('Struk berhasil diunduh');
}
onMounted(loadOrder);
watch(orderId, loadOrder);
</script>

<style scoped>
.order-detail-page-wrap{min-height:100vh;background:var(--paper);color:var(--ink)}.order-detail-page{padding:42px 0 84px}.back-link{display:inline-flex;gap:8px;align-items:center;color:var(--muted);font-size:.85rem;font-weight:700}.back-link:hover{color:var(--red)}.page-heading{display:flex;justify-content:space-between;align-items:end;gap:20px;margin:38px 0 26px}.eyebrow,.panel-kicker{margin:0 0 9px;color:var(--red);font-size:.7rem;font-weight:800;letter-spacing:.13em;text-transform:uppercase}h1,h2,h3,p{margin-top:0}h1{font-family:Georgia,'Times New Roman',serif;font-size:clamp(2rem,4vw,3rem);font-weight:500;letter-spacing:-.04em}.created-at,.muted-copy{color:var(--muted);font-size:.88rem}.status-badge{padding:8px 12px;border-radius:4px;font-size:.72rem;font-weight:800}.status-unpaid{color:#986617;background:#fcf4df}.status-awaiting_verification{color:#8a4e20;background:#f9e9dc}.status-paid{color:#287a45;background:#e8f5eb}.summary-strip,.order-panel,.receipt-panel{border:1px solid var(--line);background:#fff}.summary-strip{display:grid;grid-template-columns:repeat(3,1fr);margin-bottom:20px}.summary-strip div{padding:16px 20px;border-right:1px solid var(--line)}.summary-strip div:last-child{border-right:0}.summary-strip span{display:block;margin-bottom:5px;color:var(--muted);font-size:.75rem}.summary-strip strong{font-size:.9rem}.content-grid{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(240px,.7fr);gap:20px}.order-panel,.receipt-panel{padding:24px;border-radius:var(--r-md)}.panel-heading,.item-row,.total-row,.receipt-panel{display:flex;justify-content:space-between;gap:18px}.panel-heading{align-items:start;padding-bottom:16px;border-bottom:1px solid var(--line)}.panel-heading h2,.status-panel h2,.receipt-panel h2{margin-bottom:0;font-family:Georgia,'Times New Roman',serif;font-size:1.35rem;font-weight:500}.item-count{color:var(--muted);font-size:.8rem}.items-list{padding:4px 0}.item-row{align-items:center;padding:16px 0;border-bottom:1px solid var(--line)}.item-row h3{margin-bottom:4px;font-size:.92rem}.item-row p{margin-bottom:0;color:var(--muted);font-size:.8rem}.item-row strong,.total-row strong{white-space:nowrap}.total-row{align-items:center;padding-top:18px;font-size:.9rem}.total-row strong{color:var(--red);font-size:1.15rem}.status-panel{background:#fbf7f3}.status-mark{display:grid;width:42px;height:42px;place-items:center;margin:28px 0 16px;border-radius:50%;font-size:1.1rem;font-weight:800}.status-panel h2{margin-bottom:9px}.status-panel p:last-child{margin-bottom:0;color:var(--muted);font-size:.86rem;line-height:1.55}.receipt-panel{align-items:center;margin-top:20px}.receipt-panel h2{margin-bottom:7px;font-size:1.2rem}.receipt-panel .muted-copy{margin-bottom:0}.download-button{flex-shrink:0;padding:12px 16px;border:0;border-radius:4px;background:var(--ink);color:#fff;font-weight:750;cursor:pointer}.download-button:hover{background:var(--red)}.state-panel{padding:48px 24px;border:1px solid var(--line);background:#fff;text-align:center}.state-error{color:#a33a3a}@media(max-width:700px){.page-heading,.receipt-panel{align-items:stretch;flex-direction:column}.summary-strip,.content-grid{grid-template-columns:1fr}.summary-strip div{border-right:0;border-bottom:1px solid var(--line)}.summary-strip div:last-child{border-bottom:0}.download-button{width:100%}}
</style>
