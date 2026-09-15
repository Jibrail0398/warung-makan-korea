import Pusher from 'pusher-js';

class OrderStatusRealtimeService {
  constructor() {
    this.pusher = null;
    this.channel = null;
    this.orderId = null;
    this.onStatusUpdate = null;
  }

  subscribe(orderId, onStatusUpdate) {
    this.onStatusUpdate = onStatusUpdate;
    this.orderId = orderId;

    const appKey = import.meta.env.VITE_PUSHER_APP_KEY;
    const cluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;

    if (!appKey || !cluster) {
      console.warn('[OrderStatusRealtime] Pusher belum dikonfigurasi.');
      return;
    }

    if (!this.pusher) {
      this.pusher = new Pusher(appKey, { cluster });
    }

    this.unsubscribeChannel();

    this.channel = this.pusher.subscribe(`order-status.${orderId}`);
    this.channel.bind('pusher:subscription_succeeded', () => {
      console.log(`[OrderStatusRealtime] subscribed: order-status.${orderId}`);
    });
    this.channel.bind('pusher:subscription_error', (error) => {
      console.error('[OrderStatusRealtime] subscription error', error);
    });
    this.channel.bind('order-status-updated', (data) => {
      console.log('[OrderStatusRealtime] event received', data);
      // Pastikan event ini memang untuk pesanan yang tepat
      if (data?.id === this.orderId) {
        this.onStatusUpdate?.(data);
      }
    });
  }

  unsubscribeChannel() {
    if (this.channel) {
      this.channel.unbind('order-status-updated');
      this.pusher?.unsubscribe(`order-status.${this.orderId}`);
      this.channel = null;
    }
  }

  stop() {
    this.unsubscribeChannel();
    this.pusher?.disconnect();
    this.pusher = null;
    this.orderId = null;
    this.onStatusUpdate = null;
  }
}

export const orderStatusRealtimeService = new OrderStatusRealtimeService();
