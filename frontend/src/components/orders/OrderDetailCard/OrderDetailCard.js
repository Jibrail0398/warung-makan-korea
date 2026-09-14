import './OrderDetailCard.css';

export default {
  name: 'OrderDetailCard',
  props: { order: { type: Object, default: () => ({}) } },
  setup() {
    function formatDate(date) { if (!date) return ''; if (typeof date === 'string' && date.includes(' ')) return date; try { return new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(date)); } catch { return date; } }
    return { formatDate };
  }
};
