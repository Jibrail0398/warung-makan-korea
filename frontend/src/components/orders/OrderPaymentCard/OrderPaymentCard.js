import './OrderPaymentCard.css';

export default {
  name: 'OrderPaymentCard',
  props: { order: { type: Object, default: () => ({}) }, items: { type: Array, default: () => [] } },
  setup() {
    function calculateItemTotal(item) { const price = typeof item.price === 'number' ? item.price : parseInt(String(item.price || '').replace(/[^\d]/g, ''), 10) || 0; return price * Number(item.quantity || 1); }
    function formatPrice(price) { if (typeof price === 'string' && price.startsWith('₩')) return price; const num = typeof price === 'number' ? price : parseInt(String(price || '').replace(/[^\d]/g, ''), 10) || 0; return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(num); }
    return { calculateItemTotal, formatPrice };
  }
};
