/**
 * Order Service
 * Handles order creation, status tracking, order history, and details.
 */

const mockOrders = [
  {
    id: 'WN-001',
    orderId: 'WN-001',
    date: '2026-08-26',
    orderDate: '26 August 2026',
    orderTime: '12:30 PM',
    customerName: 'Kelvin Winata',
    customerPhone: '+82 10 1234 5678',
    orderType: 'Takeaway',
    note: 'Tidak terlalu pedas, sambal dipisah.',
    status: 'Completed',
    statusMessage: 'Pesanan Selesai',
    statusDescription: 'Pesanan Anda telah selesai dan telah diambil.',
    items: [
      {
        id: 1,
        name: 'Nasi Goreng',
        price: '₩12,000',
        numericPrice: 12000,
        quantity: 2,
        total: '₩24,000',
        image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id: 2,
        name: 'Rendang',
        price: '₩15,000',
        numericPrice: 15000,
        quantity: 1,
        total: '₩15,000',
        image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ],
    total: 39000,
    totalOrder: '₩39,000',
    totalAmount: '₩39,000',
    transactionId: 'TRX-001-WN',
    paymentMethod: 'Bank Transfer',
    paymentProof: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=900'
  },
  {
    id: 'WN-002',
    orderId: 'WN-002',
    date: '2026-08-25',
    orderDate: '25 August 2026',
    orderTime: '01:15 PM',
    customerName: 'Kelvin Winata',
    customerPhone: '+82 10 1234 5678',
    orderType: 'Dine In',
    note: 'Meja nomor 4.',
    status: 'In Progress',
    statusMessage: 'Sedang Disiapkan',
    statusDescription: 'Dapur kami sedang menyiapkan hidangan lezat Anda.',
    items: [
      {
        id: 3,
        name: 'Ayam Geprek',
        price: '₩13,000',
        numericPrice: 13000,
        quantity: 1,
        total: '₩13,000',
        image: 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id: 4,
        name: 'Sate Ayam',
        price: '₩14,000',
        numericPrice: 14000,
        quantity: 1,
        total: '₩14,000',
        image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ],
    total: 27000,
    totalOrder: '₩27,000',
    totalAmount: '₩27,000',
    transactionId: 'TRX-002-WN',
    paymentMethod: 'Bank Transfer',
    paymentProof: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=900'
  },
  {
    id: 'WN-003',
    orderId: 'WN-003',
    date: '2026-08-22',
    orderDate: '22 August 2026',
    orderTime: '06:45 PM',
    customerName: 'Kelvin Winata',
    customerPhone: '+82 10 1234 5678',
    orderType: 'Delivery',
    note: 'Tolong packing rapi untuk raw material.',
    status: 'Cancelled',
    statusMessage: 'Pesanan Dibatalkan',
    statusDescription: 'Pesanan ini telah dibatalkan oleh pengguna.',
    items: [
      {
        id: 5,
        name: 'Sambal Nusantara',
        price: '₩8,000',
        numericPrice: 8000,
        quantity: 2,
        total: '₩16,000',
        image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id: 6,
        name: 'Beras Pandan',
        price: '₩9,500',
        numericPrice: 9500,
        quantity: 1,
        total: '₩9,500',
        image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ],
    total: 25500,
    totalOrder: '₩25,500',
    totalAmount: '₩25,500',
    transactionId: 'TRX-003-WN',
    paymentMethod: 'Bank Transfer',
    paymentProof: null
  },
  {
    id: 'ORD-001',
    orderId: 'ORD-001',
    date: '2026-08-25',
    orderDate: '25 August 2026',
    orderTime: '12:30 PM',
    customerName: 'Kelvin Winata',
    customerPhone: '+82 10 1234 5678',
    orderType: 'Takeaway',
    note: 'Tidak terlalu pedas.',
    status: 'Payment Verification',
    statusMessage: 'Menunggu Verifikasi Pembayaran',
    statusDescription: 'Bukti transfer sedang diperiksa kasir.',
    items: [
      {
        id: 1,
        name: 'Nasi Goreng',
        price: '₩12,000',
        numericPrice: 12000,
        quantity: 2,
        total: '₩24,000',
        image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id: 3,
        name: 'Ayam Geprek',
        price: '₩13,000',
        numericPrice: 13000,
        quantity: 1,
        total: '₩13,000',
        image: 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id: 5,
        name: 'Sambal Nusantara',
        price: '₩8,000',
        numericPrice: 8000,
        quantity: 2,
        total: '₩16,000',
        image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ],
    total: 53000,
    totalOrder: '₩53,000',
    totalAmount: '₩47,000',
    transactionId: 'TRX-001',
    paymentMethod: 'Bank Transfer',
    paymentProof: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=900'
  }
];

import { adminService } from './adminService.js';

const getStatusDetails = (status) => {
  const s = (status || '').toLowerCase();
  if (s.includes('completed') || s.includes('selesai')) {
    return {
      status: 'Completed',
      statusMessage: 'Pesanan Selesai',
      statusDescription: 'Pesanan Anda telah selesai diproses dan telah diambil/diantar.'
    };
  }
  if (s.includes('ready') || s.includes('siap')) {
    return {
      status: 'Ready',
      statusMessage: 'Pesanan Siap',
      statusDescription: 'Pesanan Anda telah siap di meja/loket pengambilan.'
    };
  }
  if (s.includes('processing') || s.includes('diproses') || s.includes('in progress')) {
    return {
      status: 'Processing',
      statusMessage: 'Sedang Disiapkan di Dapur',
      statusDescription: 'Dapur kami sedang menyiapkan hidangan lezat pesanan Anda.'
    };
  }
  if (s.includes('cancel') || s.includes('batal')) {
    return {
      status: 'Cancelled',
      statusMessage: 'Pesanan Dibatalkan',
      statusDescription: 'Pesanan ini telah dibatalkan.'
    };
  }
  return {
    status: 'Payment Verification',
    statusMessage: 'Menunggu Verifikasi Pembayaran',
    statusDescription: 'Bukti transfer sedang diverifikasi oleh kasir restoran.'
  };
};

const formatOrderRecord = (o) => {
  const st = getStatusDetails(o.status);
  const items = (o.items || []).map(i => ({
    ...i,
    price: typeof i.price === 'number' ? `₩${i.price.toLocaleString('ko-KR')}` : (i.price || '₩12,000'),
    numericPrice: Number(i.numericPrice || i.price || 0),
    total: typeof i.subtotal === 'number' ? `₩${i.subtotal.toLocaleString('ko-KR')}` : (i.total || '₩12,000'),
    image: i.image || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=300'
  }));

  const totalNum = Number(o.total || o.subtotal || 0);

  return {
    ...o,
    orderId: o.orderNumber || o.id,
    orderDate: o.date || new Date().toISOString().split('T')[0],
    orderTime: o.time || '12:00',
    customerName: o.customer?.name || o.customerName || 'Customer',
    customerPhone: o.customer?.phone || o.customerPhone || '+82 10 1234 5678',
    status: st.status,
    statusMessage: st.statusMessage,
    statusDescription: st.statusDescription,
    items,
    total: totalNum,
    totalOrder: `₩${totalNum.toLocaleString('ko-KR')}`,
    totalAmount: `₩${totalNum.toLocaleString('ko-KR')}`,
    transactionId: `TRX-${o.id}`,
    paymentMethod: o.paymentMethod || 'Bank Transfer',
    paymentProof: o.paymentProof || null
  };
};

export const orderService = {
  async getOrderHistory() {
    try {
      const orders = await adminService.getOrders();
      if (orders && orders.length > 0) {
        return orders.map(formatOrderRecord);
      }
    } catch (e) {
      console.warn('Fallback orders history:', e);
    }
    return mockOrders.map(formatOrderRecord);
  },

  async getOrderById(id) {
    const cleanId = String(id || '').replace('#', '').trim().toLowerCase();
    try {
      const orders = await adminService.getOrders();
      const found = orders.find(
        o =>
          (o.id || '').toLowerCase() === cleanId ||
          (o.orderNumber || '').replace('#', '').toLowerCase() === cleanId
      );
      if (found) {
        return formatOrderRecord(found);
      }
    } catch (e) {
      console.warn('Fallback find order:', e);
    }

    const mockFound = mockOrders.find(
      order =>
        order.id.toLowerCase() === cleanId ||
        order.orderId.toLowerCase() === cleanId
    );
    if (mockFound) return formatOrderRecord(mockFound);

    // Fallback constructed order
    return formatOrderRecord({
      id: cleanId ? `WN-${cleanId}` : 'WN-10231',
      orderNumber: `#${cleanId ? `WN-${cleanId}` : 'WN-10231'}`,
      date: new Date().toISOString().split('T')[0],
      time: '12:30',
      status: 'Payment Verification',
      customer: { name: 'Kelvin Winata', phone: '+82 10 1234 5678' },
      orderType: 'Takeaway',
      note: 'Tidak terlalu pedas.',
      items: [
        { id: 1, name: 'Nasi Goreng', price: 12000, quantity: 2, subtotal: 24000, category: 'restaurant' }
      ],
      total: 24000
    });
  },

  async getActiveOrder() {
    const history = await this.getOrderHistory();
    return history[0] || this.getOrderById('WN-10230');
  },

  async createOrder(orderPayload) {
    const newOrder = await adminService.createOrderFromCustomer(orderPayload);
    return {
      success: true,
      orderId: newOrder.id,
      ...formatOrderRecord(newOrder)
    };
  }
};

