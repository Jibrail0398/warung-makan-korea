import { h } from 'vue';
import StatCard from '../../../components/admin/StatCard.vue';
import SalesOverview from '../../../components/admin/SalesOverview.vue';
import RecentOrders from '../../../components/admin/RecentOrders.vue';
import LowStockAlert from '../../../components/admin/LowStockAlert.vue';
import './AdminDashboard.css';

const OrderIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none'
      },
      [
        h('rect', {
          x: '4',
          y: '5',
          width: '16',
          height: '15',
          rx: '2',
          stroke: 'currentColor',
          'stroke-width': '1.8'
        }),
        h('path', {
          d: 'M8 5V3',
          stroke: 'currentColor',
          'stroke-width': '1.8',
          'stroke-linecap': 'round'
        }),
        h('path', {
          d: 'M16 5V3',
          stroke: 'currentColor',
          'stroke-width': '1.8',
          'stroke-linecap': 'round'
        }),
        h('path', {
          d: 'M8 10H16',
          stroke: 'currentColor',
          'stroke-width': '1.8',
          'stroke-linecap': 'round'
        }),
        h('path', {
          d: 'M8 14H13',
          stroke: 'currentColor',
          'stroke-width': '1.8',
          'stroke-linecap': 'round'
        })
      ]
    )
  }
}

const RevenueIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none'
      },
      [
        h('path', {
          d: 'M12 3V21',
          stroke: 'currentColor',
          'stroke-width': '1.8',
          'stroke-linecap': 'round'
        }),
        h('path', {
          d: 'M16 7.5C16 5.8 14.3 5 12 5C9.7 5 8 5.9 8 7.5C8 9.1 9.4 9.8 12 10.5C14.6 11.2 16 11.9 16 13.7C16 15.6 14.3 17 12 17C9.7 17 8 16.2 8 14.5',
          stroke: 'currentColor',
          'stroke-width': '1.8',
          'stroke-linecap': 'round'
        })
      ]
    )
  }
}

const PendingIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none'
      },
      [
        h('circle', {
          cx: '12',
          cy: '12',
          r: '8',
          stroke: 'currentColor',
          'stroke-width': '1.8'
        }),
        h('path', {
          d: 'M12 7V12L15 14',
          stroke: 'currentColor',
          'stroke-width': '1.8',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round'
        })
      ]
    )
  }
}

const CompletedIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none'
      },
      [
        h('circle', {
          cx: '12',
          cy: '12',
          r: '8',
          stroke: 'currentColor',
          'stroke-width': '1.8'
        }),
        h('path', {
          d: 'M8.5 12L11 14.5L16 9.5',
          stroke: 'currentColor',
          'stroke-width': '1.8',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round'
        })
      ]
    )
  }
}

export default {
  name: 'AdminDashboard',
  components: {
    StatCard,
    SalesOverview,
    RecentOrders,
    LowStockAlert
  },
  setup() {
    return {
      OrderIcon,
      RevenueIcon,
      PendingIcon,
      CompletedIcon
    };
  }
};
