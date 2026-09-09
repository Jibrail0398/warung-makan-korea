import Pusher from 'pusher-js';

const QUEUE_STORAGE_KEY = 'warung-new-order-queue';
const ALERT_DURATION = 2200;

class NewOrderNotificationService {
  constructor() {
    this.pusher = null;
    this.channel = null;
    this.onOrder = null;
    this.processing = false;
    this.nextAlertTimer = null;
  }

  start(onOrder) {
    this.onOrder = onOrder;
    console.log('[NewOrderNotification] start', {
      hasCallback: typeof onOrder === 'function',
      existingPusher: Boolean(this.pusher)
    });

    if (!this.pusher) {
      const appKey = import.meta.env.VITE_PUSHER_APP_KEY;
      const cluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;
      console.log('[NewOrderNotification] Pusher config', {
        hasAppKey: Boolean(appKey),
        cluster
      });

      if (!appKey || !cluster) {
        console.warn('Pusher belum dikonfigurasi untuk notifikasi pesanan baru.');
        return;
      }

      this.pusher = new Pusher(appKey, { cluster });
      this.pusher.connection.bind('state_change', (states) => {
        console.log('[NewOrderNotification] Pusher state change', states);
      });
      this.pusher.connection.bind('error', (error) => {
        console.error('[NewOrderNotification] Pusher connection error', error);
      });
      this.channel = this.pusher.subscribe('new-order');
      console.log('[NewOrderNotification] subscribed to channel new-order');
      this.channel.bind('pusher:subscription_succeeded', () => {
        console.log('[NewOrderNotification] subscription succeeded: new-order');
      });
      this.channel.bind('pusher:subscription_error', (error) => {
        console.error('[NewOrderNotification] subscription error: new-order', error);
      });
      this.channel.bind('new-order-event', (order) => {
        console.log('[NewOrderNotification] event received: new-order-event', order);
        this.enqueue(order);
      });
    }

    this.processQueue();
  }

  stop() {
    if (this.channel) {
      this.channel.unbind('new-order-event');
      this.pusher?.unsubscribe('new-order');
    }

    this.pusher?.disconnect();
    this.pusher = null;
    this.channel = null;
    this.onOrder = null;

    if (this.nextAlertTimer) {
      clearTimeout(this.nextAlertTimer);
      this.nextAlertTimer = null;
    }

    this.processing = false;
  }

  enqueue(order) {
    const queue = this.readQueue();
    queue.push(order);
    this.writeQueue(queue);
    console.log('[NewOrderNotification] order enqueued', {
      orderId: order?.id,
      queueLength: queue.length
    });
    this.processQueue();
  }

  processQueue() {
    if (this.processing) return;

    const queue = this.readQueue();
    if (!queue.length) return;

    const [nextOrder, ...remainingOrders] = queue;
    this.writeQueue(remainingOrders);
    this.processing = true;
    console.log('[NewOrderNotification] processing FIFO order', {
      orderId: nextOrder?.id,
      remainingQueueLength: remainingOrders.length
    });
    this.onOrder?.(nextOrder);

    this.nextAlertTimer = setTimeout(() => {
      this.processing = false;
      this.nextAlertTimer = null;
      this.processQueue();
    }, ALERT_DURATION);
  }

  readQueue() {
    try {
      const storedQueue = localStorage.getItem(QUEUE_STORAGE_KEY);
      const queue = storedQueue ? JSON.parse(storedQueue) : [];
      return Array.isArray(queue) ? queue : [];
    } catch (error) {
      console.warn('Queue notifikasi pesanan tidak dapat dibaca:', error);
      return [];
    }
  }

  writeQueue(queue) {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  }
}

export const newOrderNotificationService = new NewOrderNotificationService();