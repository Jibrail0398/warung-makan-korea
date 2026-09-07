import { products as initialProducts } from '../data/products.js';

const STORAGE_KEYS = {
  PRODUCTS: 'warung_admin_products_v1',
  CATEGORIES: 'warung_admin_categories_v1',
  ORDERS: 'warung_admin_orders_v1',
  AUDIT_LOGS: 'warung_superadmin_audit_v1',
  ADMINS: 'warung_superadmin_admins_v1'
};

const initialCategories = [
  {
    id: 1,
    name: 'Makanan Utama',
    slug: 'makanan-utama',
    type: 'restaurant',
    description: 'Hidangan utama siap saji khas Indonesia'
  },
  {
    id: 2,
    name: 'Camilan & Tambahan',
    slug: 'camilan-tambahan',
    type: 'restaurant',
    description: 'Kerupuk, gorengan, dan pelengkap makanan'
  },
  {
    id: 3,
    name: 'Bahan Mentah & Daging',
    slug: 'bahan-mentah-daging',
    type: 'raw',
    description: 'Daging potong segar dan bahan mentah impor'
  },
  {
    id: 4,
    name: 'Bumbu & Sambal',
    slug: 'bumbu-sambal',
    type: 'raw',
    description: 'Sambal racikan asli dan rempah-rempah nusantara'
  },
  {
    id: 5,
    name: 'Beras & Sembako',
    slug: 'beras-sembako',
    type: 'raw',
    description: 'Beras pandan wangi dan kebutuhan pokok harian'
  }
];

const initialAdmins = [
  {
    id: 'ADM-001',
    name: 'Kelvin Winata',
    email: 'admin@warungnusantara.kr',
    username: 'admin_kelvin',
    role: 'Admin',
    phone: '+82 10 1234 5678',
    status: 'Active',
    lastLogin: '2026-08-27 18:30',
    createdAt: '2026-01-15'
  },
  {
    id: 'ADM-002',
    name: 'Dina Permata',
    email: 'kasir1@warungnusantara.kr',
    username: 'kasir_dina',
    role: 'Kasir',
    phone: '+82 10 9876 5432',
    status: 'Active',
    lastLogin: '2026-08-27 12:15',
    createdAt: '2026-03-01'
  },
  {
    id: 'ADM-003',
    name: 'Rian Hidayat',
    email: 'kasir2@warungnusantara.kr',
    username: 'kasir_rian',
    role: 'Kasir',
    phone: '+82 10 5555 4444',
    status: 'Inactive',
    lastLogin: '2026-08-20 09:00',
    createdAt: '2026-05-10'
  }
];

const initialAuditLogs = [
  {
    id: 'LOG-1008',
    timestamp: '2026-08-27 18:15:20',
    actor: 'Kelvin Winata (Admin)',
    action: 'UPDATE_ORDER_STATUS',
    resource: 'Order #WN-10231 -> Completed',
    ip: '211.234.118.42',
    status: 'Success',
    details: { orderId: 'WN-10231', previousStatus: 'Processing', newStatus: 'Completed' }
  },
  {
    id: 'LOG-1007',
    timestamp: '2026-08-27 17:40:12',
    actor: 'Dina Permata (Kasir)',
    action: 'VERIFY_PAYMENT',
    resource: 'Payment Proof #WN-10230',
    ip: '211.234.118.45',
    status: 'Success',
    details: { orderId: 'WN-10230', amount: 15000, bank: 'Woori Bank' }
  },
  {
    id: 'LOG-1006',
    timestamp: '2026-08-27 15:20:00',
    actor: 'Kelvin Winata (Admin)',
    action: 'UPDATE_PRODUCT',
    resource: 'Product #2 (Rendang)',
    ip: '211.234.118.42',
    status: 'Success',
    details: { productId: 2, field: 'price', oldValue: '₩14,000', newValue: '₩15,000' }
  },
  {
    id: 'LOG-1005',
    timestamp: '2026-08-27 14:02:11',
    actor: 'Super Admin',
    action: 'CREATE_ADMIN',
    resource: 'Account kasir_rian',
    ip: '175.223.10.88',
    status: 'Success',
    details: { username: 'kasir_rian', role: 'Kasir' }
  },
  {
    id: 'LOG-1004',
    timestamp: '2026-08-26 21:10:44',
    actor: 'Dina Permata (Kasir)',
    action: 'LOGIN',
    resource: 'Cashier Portal',
    ip: '211.234.118.45',
    status: 'Success',
    details: { session: 'session_891726' }
  },
  {
    id: 'LOG-1003',
    timestamp: '2026-08-26 19:35:10',
    actor: 'Kelvin Winata (Admin)',
    action: 'CREATE_PRODUCT',
    resource: 'Product #8 (Kerupuk Udang)',
    ip: '211.234.118.42',
    status: 'Success',
    details: { name: 'Kerupuk Udang', category: 'raw', price: 4500 }
  },
  {
    id: 'LOG-1002',
    timestamp: '2026-08-26 11:20:00',
    actor: 'Super Admin',
    action: 'SYSTEM_BACKUP',
    resource: 'Database snapshot v20260826',
    ip: '175.223.10.88',
    status: 'Success',
    details: { size: '4.2 MB', duration: '320ms' }
  },
  {
    id: 'LOG-1001',
    timestamp: '2026-08-25 09:00:15',
    actor: 'Kelvin Winata (Admin)',
    action: 'RESET_PASSWORD',
    resource: 'Admin Account (Kelvin Winata)',
    ip: '211.234.118.42',
    status: 'Success',
    details: { type: 'self_reset' }
  }
];

const initialAdminOrders = [
  {
    id: 'WN-10231',
    orderNumber: '#WN-10231',
    date: '2026-08-27',
    time: '18:15',
    customer: {
      name: 'Budi Santoso',
      phone: '+82 10 2233 4455',
      type: 'Member'
    },
    orderType: 'Dine In',
    tableNumber: 'Table 3',
    note: 'Pedas sedang, tolong sambal di mangkok terpisah.',
    status: 'Completed',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Verified',
    paymentProof: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=900',
    items: [
      { id: 1, name: 'Nasi Goreng', price: 12000, quantity: 2, subtotal: 24000, category: 'restaurant' }
    ],
    subtotal: 24000,
    tax: 0,
    total: 24000
  },
  {
    id: 'WN-10230',
    orderNumber: '#WN-10230',
    date: '2026-08-27',
    time: '17:35',
    customer: {
      name: 'Andi Pratama',
      phone: '+82 10 9988 7766',
      type: 'Guest'
    },
    orderType: 'Takeaway',
    note: 'Bungkus rapi, pisahkan kuah rendang.',
    status: 'Payment Verification',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Waiting Verification',
    paymentProof: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=900',
    items: [
      { id: 2, name: 'Rendang', price: 15000, quantity: 1, subtotal: 15000, category: 'restaurant' }
    ],
    subtotal: 15000,
    tax: 0,
    total: 15000
  },
  {
    id: 'WN-10229',
    orderNumber: '#WN-10229',
    date: '2026-08-27',
    time: '16:50',
    customer: {
      name: 'Rina Kusuma',
      phone: '+82 10 3344 5566',
      type: 'Member'
    },
    orderType: 'Dine In',
    tableNumber: 'Table 7',
    note: 'Tanpa bawang goreng.',
    status: 'Processing',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Verified',
    paymentProof: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=900',
    items: [
      { id: 4, name: 'Sate Ayam', price: 14000, quantity: 2, subtotal: 28000, category: 'restaurant' }
    ],
    subtotal: 28000,
    tax: 0,
    total: 28000
  },
  {
    id: 'WN-10228',
    orderNumber: '#WN-10228',
    date: '2026-08-27',
    time: '15:10',
    customer: {
      name: 'Dina Wijaya',
      phone: '+82 10 1122 3344',
      type: 'Member'
    },
    orderType: 'Takeaway',
    note: '',
    status: 'Completed',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Verified',
    paymentProof: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=900',
    items: [
      { id: 3, name: 'Ayam Geprek', price: 13000, quantity: 1, subtotal: 13000, category: 'restaurant' }
    ],
    subtotal: 13000,
    tax: 0,
    total: 13000
  },
  {
    id: 'WN-10227',
    orderNumber: '#WN-10227',
    date: '2026-08-27',
    time: '13:20',
    customer: {
      name: 'Minho Park',
      phone: '+82 10 7788 9900',
      type: 'Guest'
    },
    orderType: 'Delivery',
    address: 'Mapo-gu, Seoul, 120-1',
    note: 'Harap hubungi sebelum sampai.',
    status: 'Ready',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Verified',
    paymentProof: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=900',
    items: [
      { id: 1, name: 'Nasi Goreng', price: 12000, quantity: 1, subtotal: 12000, category: 'restaurant' },
      { id: 5, name: 'Sambal Nusantara', price: 8000, quantity: 2, subtotal: 16000, category: 'raw' }
    ],
    subtotal: 28000,
    tax: 0,
    total: 28000
  },
  {
    id: 'WN-10226',
    orderNumber: '#WN-10226',
    date: '2026-08-26',
    time: '19:40',
    customer: {
      name: 'Agus Salim',
      phone: '+82 10 6677 8899',
      type: 'Member'
    },
    orderType: 'Dine In',
    tableNumber: 'Table 2',
    note: '',
    status: 'Completed',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Verified',
    paymentProof: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=900',
    items: [
      { id: 2, name: 'Rendang', price: 15000, quantity: 2, subtotal: 30000, category: 'restaurant' },
      { id: 7, name: 'Kecap Manis', price: 6500, quantity: 1, subtotal: 6500, category: 'raw' }
    ],
    subtotal: 36500,
    tax: 0,
    total: 36500
  },
  {
    id: 'WN-10225',
    orderNumber: '#WN-10225',
    date: '2026-08-26',
    time: '18:00',
    customer: {
      name: 'Siti Rahma',
      phone: '+82 10 4455 6677',
      type: 'Guest'
    },
    orderType: 'Takeaway',
    note: '',
    status: 'Cancelled',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Unpaid',
    paymentProof: null,
    items: [
      { id: 6, name: 'Beras Pandan', price: 9500, quantity: 1, subtotal: 9500, category: 'raw' }
    ],
    subtotal: 9500,
    tax: 0,
    total: 9500
  }
];

class AdminService {
  constructor() {
    this.initData();
  }

  initData() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      const formatted = initialProducts.map(p => ({
        ...p,
        stock: p.id === 6 ? 4 : p.id === 7 ? 6 : p.id === 8 ? 3 : 25,
        unit: p.category === 'raw' ? (p.id === 6 ? '1 kg' : p.id === 7 ? '600 ml' : '250 gr') : '1 porsi',
        status: 'Available',
        categoryId: p.category === 'restaurant' ? 1 : 3
      }));
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(formatted));
    }

    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
    }

    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialAdminOrders));
    }

    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(initialAuditLogs));
    }

    if (!localStorage.getItem(STORAGE_KEYS.ADMINS)) {
      localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(initialAdmins));
    }
  }

  // --- PRODUCTS CRUD ---
  async getProducts() {
    await new Promise(r => setTimeout(r, 60));
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => String(p.id) === String(id)) || null;
  }

  async createProduct(productData) {
    await new Promise(r => setTimeout(r, 120));
    const products = await this.getProducts();
    const newId = products.length ? Math.max(...products.map(p => Number(p.id) || 0)) + 1 : 1;
    
    const numericPrice = Number(productData.numericPrice || productData.price || 0);
    const newProduct = {
      id: newId,
      name: productData.name,
      price: `₩${numericPrice.toLocaleString('ko-KR')}`,
      numericPrice,
      description: productData.description || '',
      category: productData.category || 'restaurant',
      categoryId: productData.categoryId || 1,
      unit: productData.unit || (productData.category === 'raw' ? '1 bungkus' : '1 porsi'),
      stock: Number(productData.stock || 0),
      status: productData.status || 'Available',
      image: productData.image || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600'
    };

    products.unshift(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.logActivity('Admin', 'CREATE_PRODUCT', `Product #${newId} (${newProduct.name})`, newProduct);
    return newProduct;
  }

  async updateProduct(id, productData) {
    await new Promise(r => setTimeout(r, 120));
    const products = await this.getProducts();
    const idx = products.findIndex(p => String(p.id) === String(id));
    if (idx === -1) throw new Error('Produk tidak ditemukan');

    const numericPrice = productData.numericPrice !== undefined 
      ? Number(productData.numericPrice) 
      : products[idx].numericPrice;

    products[idx] = {
      ...products[idx],
      ...productData,
      numericPrice,
      price: `₩${numericPrice.toLocaleString('ko-KR')}`
    };

    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.logActivity('Admin', 'UPDATE_PRODUCT', `Product #${id} (${products[idx].name})`, productData);
    return products[idx];
  }

  async deleteProduct(id) {
    await new Promise(r => setTimeout(r, 100));
    let products = await this.getProducts();
    const target = products.find(p => String(p.id) === String(id));
    products = products.filter(p => String(p.id) !== String(id));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.logActivity('Admin', 'DELETE_PRODUCT', `Product #${id} (${target?.name || ''})`);
    return true;
  }

  async toggleProductStatus(id) {
    const products = await this.getProducts();
    const target = products.find(p => String(p.id) === String(id));
    if (!target) return;
    const newStatus = target.status === 'Available' ? 'Sold Out' : 'Available';
    return this.updateProduct(id, { status: newStatus });
  }

  // --- CATEGORIES CRUD ---
  async getCategories() {
    await new Promise(r => setTimeout(r, 50));
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
  }

  async createCategory(catData) {
    await new Promise(r => setTimeout(r, 100));
    const categories = await this.getCategories();
    const newId = categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    const newCat = {
      id: newId,
      name: catData.name,
      slug: catData.name.toLowerCase().replace(/\s+/g, '-'),
      type: catData.type || 'restaurant',
      description: catData.description || ''
    };
    categories.push(newCat);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    this.logActivity('Admin', 'CREATE_CATEGORY', `Category #${newId} (${newCat.name})`, newCat);
    return newCat;
  }

  async updateCategory(id, catData) {
    await new Promise(r => setTimeout(r, 100));
    const categories = await this.getCategories();
    const idx = categories.findIndex(c => String(c.id) === String(id));
    if (idx === -1) throw new Error('Kategori tidak ditemukan');

    categories[idx] = {
      ...categories[idx],
      ...catData,
      slug: (catData.name || categories[idx].name).toLowerCase().replace(/\s+/g, '-')
    };
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    this.logActivity('Admin', 'UPDATE_CATEGORY', `Category #${id} (${categories[idx].name})`, catData);
    return categories[idx];
  }

  async deleteCategory(id) {
    await new Promise(r => setTimeout(r, 100));
    let categories = await this.getCategories();
    const target = categories.find(c => String(c.id) === String(id));
    categories = categories.filter(c => String(c.id) !== String(id));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    this.logActivity('Admin', 'DELETE_CATEGORY', `Category #${id} (${target?.name || ''})`);
    return true;
  }

  // --- ORDERS MONITORING & DETAIL ---
  async getOrders() {
    await new Promise(r => setTimeout(r, 60));
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  }

  async getOrderById(id) {
    const orders = await this.getOrders();
    const cleanId = String(id || '').replace('#', '').trim().toLowerCase();
    return orders.find(o => 
      o.id.toLowerCase() === cleanId || 
      o.orderNumber.replace('#', '').toLowerCase() === cleanId
    ) || null;
  }

  async updateOrderStatus(id, newStatus) {
    await new Promise(r => setTimeout(r, 100));
    const orders = await this.getOrders();
    const cleanId = String(id || '').replace('#', '').trim().toLowerCase();
    const idx = orders.findIndex(o => 
      o.id.toLowerCase() === cleanId || 
      o.orderNumber.replace('#', '').toLowerCase() === cleanId
    );

    if (idx === -1) throw new Error('Pesanan tidak ditemukan');
    const oldStatus = orders[idx].status;
    orders[idx].status = newStatus;

    if (newStatus === 'Completed') {
      orders[idx].paymentStatus = 'Verified';
    } else if (newStatus === 'Cancelled') {
      orders[idx].paymentStatus = 'Cancelled';
    }

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.logActivity('Cashier / Admin', 'UPDATE_ORDER_STATUS', `Order #${orders[idx].id} (${oldStatus} -> ${newStatus})`);
    return orders[idx];
  }

  async verifyPaymentProof(id, isApproved) {
    await new Promise(r => setTimeout(r, 120));
    const orders = await this.getOrders();
    const cleanId = String(id || '').replace('#', '').trim().toLowerCase();
    const idx = orders.findIndex(o => 
      o.id.toLowerCase() === cleanId || 
      o.orderNumber.replace('#', '').toLowerCase() === cleanId
    );
    if (idx === -1) throw new Error('Pesanan tidak ditemukan');

    if (isApproved) {
      orders[idx].paymentStatus = 'Verified';
      orders[idx].status = 'Processing';
      this.logActivity('Cashier', 'VERIFY_PAYMENT_APPROVED', `Order #${orders[idx].id}`);
    } else {
      orders[idx].paymentStatus = 'Rejected';
      orders[idx].status = 'Payment Verification';
      this.logActivity('Cashier', 'VERIFY_PAYMENT_REJECTED', `Order #${orders[idx].id}`);
    }

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return orders[idx];
  }

  async simulateIncomingOrder() {
    const products = await this.getProducts();
    const randomProduct1 = products[0] || { id: 1, name: 'Nasi Goreng', numericPrice: 12000, category: 'restaurant' };
    const randomProduct2 = products[1] || { id: 2, name: 'Rendang', numericPrice: 15000, category: 'restaurant' };
    
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `WN-${randomNum}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = now.toISOString().split('T')[0];

    const names = ['Kwon Ji-yong', 'Hendri Susanto', 'Minji Kim', 'Mega Utami', 'Rudi Hartono', 'Park Jisoo'];
    const randomName = names[Math.floor(Math.random() * names.length)];

    const subtotal = randomProduct1.numericPrice + randomProduct2.numericPrice;

    const newOrder = {
      id: orderId,
      orderNumber: `#${orderId}`,
      date: dateStr,
      time: timeStr,
      customer: {
        name: randomName,
        phone: `+82 10 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'Guest'
      },
      orderType: Math.random() > 0.5 ? 'Dine In' : 'Takeaway',
      tableNumber: 'Table ' + Math.floor(1 + Math.random() * 10),
      note: 'Pesanan baru masuk secara real-time.',
      status: 'Payment Verification',
      paymentMethod: 'Bank Transfer',
      paymentStatus: 'Waiting Verification',
      paymentProof: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=900',
      items: [
        { id: randomProduct1.id, name: randomProduct1.name, price: randomProduct1.numericPrice, quantity: 1, subtotal: randomProduct1.numericPrice, category: randomProduct1.category },
        { id: randomProduct2.id, name: randomProduct2.name, price: randomProduct2.numericPrice, quantity: 1, subtotal: randomProduct2.numericPrice, category: randomProduct2.category }
      ],
      subtotal,
      tax: 0,
      total: subtotal
    };

    const orders = await this.getOrders();
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.logActivity('System', 'INCOMING_ORDER', `Order #${orderId} by ${randomName} (₩${subtotal.toLocaleString('ko-KR')})`);
    return newOrder;
  }

  async createOrderFromCustomer(orderPayload) {
    await new Promise(r => setTimeout(r, 80));
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = orderPayload.id || `WN-${randomNum}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = now.toISOString().split('T')[0];

    const customerName = orderPayload.customer?.name || orderPayload.customerName || 'Pelanggan Guest';
    const customerPhone = orderPayload.customer?.phone || orderPayload.customerPhone || '+82 10 0000 0000';
    const customerType = orderPayload.customer?.type || (orderPayload.isMember ? 'Member' : 'Guest');

    const newOrder = {
      id: orderId,
      orderNumber: `#${orderId}`,
      date: orderPayload.date || dateStr,
      time: orderPayload.time || timeStr,
      customer: {
        name: customerName,
        phone: customerPhone,
        type: customerType
      },
      orderType: orderPayload.orderType || 'Takeaway',
      tableNumber: orderPayload.tableNumber || '',
      address: orderPayload.address || '',
      note: orderPayload.note || '',
      status: 'Payment Verification',
      paymentMethod: orderPayload.paymentMethod || 'Bank Transfer',
      paymentStatus: 'Waiting Verification',
      paymentProof: orderPayload.paymentProof || null,
      items: orderPayload.items || [],
      subtotal: Number(orderPayload.subtotal || orderPayload.total || 0),
      tax: 0,
      total: Number(orderPayload.total || orderPayload.subtotal || 0)
    };

    const orders = await this.getOrders();
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.logActivity('Customer / Guest', 'CREATE_ORDER', `Order #${orderId} by ${customerName} (₩${newOrder.total.toLocaleString('ko-KR')})`, newOrder);
    return newOrder;
  }

  // --- REPORTS ---
  async getTransactionReport({ period = 'today', date = null, month = null } = {}) {
    const orders = await this.getOrders();
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.substring(0, 7);

    let filtered = orders;
    if (period === 'today') {
      const targetDate = date || today;
      filtered = orders.filter(o => o.date === targetDate);
    } else if (period === 'month') {
      const targetMonth = month || currentMonth;
      filtered = orders.filter(o => o.date.startsWith(targetMonth));
    }

    const totalOrders = filtered.length;
    const completedOrders = filtered.filter(o => o.status === 'Completed').length;
    const cancelledOrders = filtered.filter(o => o.status === 'Cancelled').length;
    const pendingOrders = filtered.filter(o => !['Completed', 'Cancelled'].includes(o.status)).length;
    const totalRevenue = filtered
      .filter(o => o.status === 'Completed')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    return {
      period,
      orders: filtered,
      summary: {
        totalOrders,
        completedOrders,
        cancelledOrders,
        pendingOrders,
        totalRevenue,
        formattedRevenue: `₩${totalRevenue.toLocaleString('ko-KR')}`
      }
    };
  }

  async getFinancialReport({ period = 'today', month = null } = {}) {
    const orders = await this.getOrders();
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.substring(0, 7);

    let filtered = orders;
    if (period === 'today') {
      filtered = orders.filter(o => o.date === today);
    } else if (period === 'month') {
      const targetMonth = month || currentMonth;
      filtered = orders.filter(o => o.date.startsWith(targetMonth));
    }

    const completed = filtered.filter(o => o.status === 'Completed');
    const totalRevenue = completed.reduce((sum, o) => sum + (o.total || 0), 0);
    const avgOrderValue = completed.length ? Math.round(totalRevenue / completed.length) : 0;

    // Categorized breakdown
    let restaurantRevenue = 0;
    let rawRevenue = 0;
    const productSales = {};

    completed.forEach(order => {
      order.items?.forEach(item => {
        const itemTotal = item.subtotal || (item.price * item.quantity);
        if (item.category === 'raw') {
          rawRevenue += itemTotal;
        } else {
          restaurantRevenue += itemTotal;
        }

        if (!productSales[item.name]) {
          productSales[item.name] = { name: item.name, qty: 0, revenue: 0, category: item.category };
        }
        productSales[item.name].qty += item.quantity;
        productSales[item.name].revenue += itemTotal;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      period,
      totalRevenue,
      formattedRevenue: `₩${totalRevenue.toLocaleString('ko-KR')}`,
      avgOrderValue,
      formattedAvgOrderValue: `₩${avgOrderValue.toLocaleString('ko-KR')}`,
      completedCount: completed.length,
      breakdown: {
        restaurantRevenue,
        formattedRestaurantRevenue: `₩${restaurantRevenue.toLocaleString('ko-KR')}`,
        rawRevenue,
        formattedRawRevenue: `₩${rawRevenue.toLocaleString('ko-KR')}`
      },
      topProducts
    };
  }

  // --- AUDIT LOGS (SUPER ADMIN) ---
  async getAuditLogs() {
    await new Promise(r => setTimeout(r, 60));
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS) || '[]');
  }

  logActivity(actor, action, resource, details = null) {
    try {
      const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS) || '[]');
      const now = new Date();
      const timestamp = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const newLog = {
        id: `LOG-${1000 + logs.length + 1}`,
        timestamp,
        actor,
        action,
        resource,
        ip: '211.234.118.' + Math.floor(10 + Math.random() * 80),
        status: 'Success',
        details
      };
      logs.unshift(newLog);
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
    } catch (e) {
      console.warn('Logging activity failed:', e);
    }
  }

  // --- MANAGEMENT ADMINS (SUPER ADMIN) ---
  async getAdmins() {
    await new Promise(r => setTimeout(r, 60));
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || '[]');
  }

  async createAdmin(adminData) {
    await new Promise(r => setTimeout(r, 120));
    const admins = await this.getAdmins();
    const newId = `ADM-00${admins.length + 1}`;
    const now = new Date().toISOString().split('T')[0];
    const newAdmin = {
      id: newId,
      name: adminData.name,
      email: adminData.email,
      username: adminData.username,
      role: adminData.role || 'Kasir',
      phone: adminData.phone || '+82 10 0000 0000',
      status: adminData.status || 'Active',
      lastLogin: '-',
      createdAt: now
    };
    admins.push(newAdmin);
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
    this.logActivity('Super Admin', 'CREATE_ADMIN', `Account ${newAdmin.username} (${newAdmin.role})`, newAdmin);
    return newAdmin;
  }

  async updateAdmin(id, adminData) {
    await new Promise(r => setTimeout(r, 120));
    const admins = await this.getAdmins();
    const idx = admins.findIndex(a => a.id === id);
    if (idx === -1) throw new Error('Akun Admin tidak ditemukan');
    admins[idx] = { ...admins[idx], ...adminData };
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
    this.logActivity('Super Admin', 'UPDATE_ADMIN', `Account ${admins[idx].username} updated`, adminData);
    return admins[idx];
  }

  async deleteAdmin(id) {
    await new Promise(r => setTimeout(r, 100));
    let admins = await this.getAdmins();
    const target = admins.find(a => a.id === id);
    admins = admins.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
    this.logActivity('Super Admin', 'DELETE_ADMIN', `Account ${target?.username || id}`);
    return true;
  }

  async resetAdminPassword(id) {
    await new Promise(r => setTimeout(r, 100));
    this.logActivity('Super Admin', 'RESET_ADMIN_PASSWORD', `Password reset for Admin #${id}`);
    return { success: true, temporaryPassword: `WN-${Math.floor(100000 + Math.random() * 900000)}` };
  }
}

export const adminService = new AdminService();
