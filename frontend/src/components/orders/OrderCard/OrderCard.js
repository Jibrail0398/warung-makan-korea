import { computed } from 'vue';
import './OrderCard.css';

export default {
  name: 'OrderCard',
  props: { order: { type: Object, required: true } },
  emits: ['view'],
  setup(props) {
    const visibleItems = computed(() => (props.order.items || []).slice(0, 3));
    const remainingItems = computed(() => Math.max((props.order.items || []).length - 3, 0));
    const totalItems = computed(() => (props.order.items || []).reduce((total, item) => total + Number(item.quantity || 0), 0));
    const statusClass = computed(() => `status-${(props.order.status || '').toLowerCase().replace(/\s+/g, '-')}`);
    function formatPrice(price) { if (typeof price === 'string' && price.startsWith('₩')) return price; const num = Number(price) || 0; return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(num); }
    function formatDate(date) { if (!date) return ''; if (typeof date === 'string' && date.includes(' ')) return date; try { return new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date)); } catch { return date; } }
    return { visibleItems, remainingItems, totalItems, statusClass, formatPrice, formatDate };
  }
};
