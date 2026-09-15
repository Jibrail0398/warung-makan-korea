import Pusher from 'pusher-js';

class NewOrderListService {
  constructor() {
    this.pusher = null;
    this.channel = null;
    this.onNewOrder = null;
  }

  start(onNewOrder) {
    this.onNewOrder = onNewOrder;

    const appKey = import.meta.env.VITE_PUSHER_APP_KEY;
    const cluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;

    if (!appKey || !cluster) {
      console.warn('[NewOrderList] Pusher belum dikonfigurasi.');
      return;
    }

    if (!this.pusher) {
      this.pusher = new Pusher(appKey, { cluster });
    }

    this.stop();

    this.channel = this.pusher.subscribe('new-order');
    this.channel.bind('pusher:subscription_succeeded', () => {
      console.log('[NewOrderList] subscribed: new-order');
    });
    this.channel.bind('new-order-event', (order) => {
      console.log('[NewOrderList] pesanan baru masuk', order?.id);
      this.onNewOrder?.(order);
    });
  }

  stop() {
    if (this.channel) {
      this.channel.unbind('new-order-event');
      this.pusher?.unsubscribe('new-order');
      this.channel = null;
    }
  }
}

export const newOrderListService = new NewOrderListService();
