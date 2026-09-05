<template>
  <div class="pos-view">
    <!-- Main POS Workspace (Left: Catalog, Right: Order Cart & Payment) -->
    <div class="pos-layout">
      <!-- Left Panel: Product Catalog & Filters -->
      <section class="pos-catalog-panel">
        <div class="catalog-header">
          <div class="header-titles">
            <p class="pos-eyebrow">POINT OF SALE</p>
            <h1 class="pos-title">Kasir Warung</h1>
          </div>

          <!-- Quick Search -->
          <div class="pos-search-box">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Ketik nama makanan atau bahan..."
              class="pos-search-input"
            />
            <button
              v-if="searchQuery"
              type="button"
              class="clear-search-btn"
              @click="searchQuery = ''"
            >
              ×
            </button>
          </div>
        </div>

        <!-- Filter 1: Kategori Besar (Restaurant Menu vs Raw Material) -->
        <div class="main-cat-tabs" role="tablist">
          <button
            type="button"
            class="main-tab-btn"
            :class="{ active: selectedMainCat === 'all' }"
            @click="setMainCategory('all')"
          >
            Semua Menu & Bahan
          </button>
          <button
            type="button"
            class="main-tab-btn"
            :class="{ active: selectedMainCat === 'restaurant' }"
            @click="setMainCategory('restaurant')"
          >
            Restaurant Menu (Siap Santap)
          </button>
          <button
            type="button"
            class="main-tab-btn"
            :class="{ active: selectedMainCat === 'raw' }"
            @click="setMainCategory('raw')"
          >
            Raw Material (Bahan Mentah)
          </button>
        </div>

        <!-- Filter 2: Subkategori Pills -->
        <div class="subcat-scroll-row">
          <button
            type="button"
            class="subcat-pill"
            :class="{ active: selectedSubcat === 'all' }"
            @click="selectedSubcat = 'all'"
          >
            Semua Subkategori
          </button>
          <button
            v-for="sub in filteredSubcategories"
            :key="sub.id"
            type="button"
            class="subcat-pill"
            :class="{ active: selectedSubcat === sub.id }"
            @click="selectedSubcat = sub.id"
          >
            {{ sub.name }}
          </button>
        </div>

        <!-- Products Grid -->
        <div v-if="filteredProducts.length > 0" class="pos-products-grid">
          <button
            v-for="product in filteredProducts"
            :key="product.id"
            type="button"
            class="pos-product-card"
            :class="{ 'out-of-stock': product.stock <= 0 || product.status === 'Sold Out' }"
            :disabled="product.stock <= 0 || product.status === 'Sold Out'"
            @click="addToCart(product)"
          >
            <div class="product-thumb">
              <img :src="product.image" :alt="product.name" @error="handleImgError($event)" />
              <span v-if="product.stock <= 0 || product.status === 'Sold Out'" class="sold-out-badge">
                HABIS
              </span>
              <span v-else-if="product.stock <= 5" class="low-stock-badge">
                Sisa {{ product.stock }}
              </span>
            </div>

            <div class="product-info">
              <span class="product-category-tag">
                {{ getSubcatName(product.subcategoryId || product.categoryId) }}
              </span>
              <h3 class="product-title">{{ product.name }}</h3>
              <div class="product-bottom-row">
                <span class="product-price">₩{{ (product.numericPrice || 0).toLocaleString('ko-KR') }}</span>
                <span class="product-unit">{{ product.unit || '1 porsi' }}</span>
              </div>
            </div>

            <!-- In-Cart Quantity Indicator Overlay -->
            <div v-if="getCartQty(product.id) > 0" class="in-cart-indicator">
              {{ getCartQty(product.id) }}
            </div>
          </button>
        </div>

        <div v-else class="empty-pos-catalog">
          <p>Tidak ada produk yang cocok dengan pencarian atau filter kategori.</p>
        </div>
      </section>

      <!-- Right Panel: Cart & Payment Checkout -->
      <aside class="pos-cart-panel">
        <div class="cart-header">
          <div class="cart-title-row">
            <h2 class="cart-title">Order Kasir</h2>
            <span class="cart-items-count">{{ cartTotalItems }} item</span>
          </div>

          <!-- Order Type Tabs (Dine In / Takeaway / Delivery) -->
          <div class="order-type-selector">
            <button
              type="button"
              class="type-btn"
              :class="{ active: orderType === 'Dine In' }"
              @click="orderType = 'Dine In'"
            >
              Makan di Tempat
            </button>
            <button
              type="button"
              class="type-btn"
              :class="{ active: orderType === 'Takeaway' }"
              @click="orderType = 'Takeaway'"
            >
              Bungkus
            </button>
            <button
              type="button"
              class="type-btn"
              :class="{ active: orderType === 'Delivery' }"
              @click="orderType = 'Delivery'"
            >
              Antar
            </button>
          </div>

          <!-- Extra details: Table number or Customer Name -->
          <div class="order-meta-inputs">
            <div v-if="orderType === 'Dine In'" class="meta-field">
              <label>No. Meja:</label>
              <input type="text" v-model="tableNumber" placeholder="Contoh: Meja 05" />
            </div>
            <div class="meta-field customer-name-field">
              <label>Nama Pelanggan:</label>
              <input type="text" v-model="customerName" placeholder="Nama / No. HP" />
            </div>
          </div>
        </div>

        <!-- Cart Items List -->
        <div class="cart-items-wrapper">
          <div v-if="cart.length > 0" class="cart-items-list">
            <div
              v-for="item in cart"
              :key="item.id"
              class="cart-item-row"
            >
              <div class="item-details">
                <h4 class="item-name">{{ item.name }}</h4>
                <span class="item-unit-price">
                  ₩{{ item.price.toLocaleString('ko-KR') }} / {{ item.unit || 'porsi' }}
                </span>
              </div>

              <!-- Quantity Controls -->
              <div class="qty-controls">
                <button
                  type="button"
                  class="qty-btn"
                  @click="decreaseQty(item.id)"
                  aria-label="Kurang"
                >
                  -
                </button>
                <span class="qty-display">{{ item.quantity }}</span>
                <button
                  type="button"
                  class="qty-btn"
                  :disabled="item.quantity >= item.stock"
                  @click="increaseQty(item.id)"
                  aria-label="Tambah"
                >
                  +
                </button>
              </div>

              <!-- Item Subtotal -->
              <div class="item-subtotal">
                ₩{{ (item.price * item.quantity).toLocaleString('ko-KR') }}
              </div>

              <!-- Remove -->
              <button
                type="button"
                class="remove-item-btn"
                title="Hapus"
                @click="removeFromCart(item.id)"
              >
                ×
              </button>
            </div>
          </div>

          <div v-else class="empty-cart-state">
            <div class="empty-icon-wrap">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="9" cy="21" r="1" stroke="currentColor" stroke-width="1.8" />
                <circle cx="20" cy="21" r="1" stroke="currentColor" stroke-width="1.8" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <p class="empty-cart-title">Keranjang Kasir Kosong</p>
            <p class="empty-cart-desc">Klik produk di katalog sebelah kiri untuk menambahkan pesanan.</p>
          </div>
        </div>

        <!-- Cart Summary & Payment -->
        <div class="cart-footer">
          <!-- Summary Calculations -->
          <div class="calculation-summary">
            <div class="calc-row">
              <span>Subtotal:</span>
              <span>₩{{ subtotal.toLocaleString('ko-KR') }}</span>
            </div>
            <div class="calc-row total-row">
              <span>Total Pembayaran:</span>
              <span class="total-amount">₩{{ grandTotal.toLocaleString('ko-KR') }}</span>
            </div>
          </div>

          <!-- Payment Method Tabs -->
          <div class="payment-method-block">
            <label class="section-label">Metode Pembayaran:</label>
            <div class="payment-methods-grid">
              <button
                type="button"
                class="pay-method-btn"
                :class="{ active: paymentMethod === 'Cash' }"
                @click="paymentMethod = 'Cash'"
              >
                Tunai (Cash)
              </button>
              <button
                type="button"
                class="pay-method-btn"
                :class="{ active: paymentMethod === 'QRIS' }"
                @click="paymentMethod = 'QRIS'"
              >
                QRIS / Transfer
              </button>
              <button
                type="button"
                class="pay-method-btn"
                :class="{ active: paymentMethod === 'Card' }"
                @click="paymentMethod = 'Card'"
              >
                Debit / Kartu
              </button>
            </div>

            <!-- Cash Payment Details (Amount Tendered & Change) -->
            <div v-if="paymentMethod === 'Cash'" class="cash-calc-wrapper">
              <div class="cash-input-row">
                <label>Uang Diterima:</label>
                <div class="cash-input-box">
                  <span>₩</span>
                  <input
                    type="number"
                    v-model.number="cashReceived"
                    min="0"
                    step="1000"
                    placeholder="0"
                  />
                </div>
              </div>

              <!-- Quick Cash Preset Chips -->
              <div class="cash-preset-row">
                <button type="button" class="preset-chip" @click="cashReceived = grandTotal">Uang Pas</button>
                <button type="button" class="preset-chip" @click="cashReceived = 10000">₩10.000</button>
                <button type="button" class="preset-chip" @click="cashReceived = 20000">₩20.000</button>
                <button type="button" class="preset-chip" @click="cashReceived = 50000">₩50.000</button>
                <button type="button" class="preset-chip" @click="cashReceived = 100000">₩100.000</button>
              </div>

              <div class="change-display-row">
                <span>Kembalian:</span>
                <strong :class="{ 'text-negative': cashChange < 0 }">
                  ₩{{ Math.max(0, cashChange).toLocaleString('ko-KR') }}
                </strong>
              </div>
            </div>
          </div>

          <!-- Checkout Button -->
          <div class="action-buttons-wrap">
            <button
              type="button"
              class="btn-clear-cart"
              :disabled="cart.length === 0 || isProcessing"
              @click="clearCart"
            >
              Reset
            </button>
            <button
              type="button"
              class="btn-checkout-pos"
              :disabled="cart.length === 0 || isProcessing || (paymentMethod === 'Cash' && cashReceived < grandTotal)"
              @click="handleProcessOrder"
            >
              {{ isProcessing ? 'Memproses Pesanan...' : `Bayar Sekarang (₩${grandTotal.toLocaleString('ko-KR')})` }}
            </button>
          </div>
        </div>
      </aside>
    </div>

    <!-- Success Modal with Receipt Preview -->
    <div v-if="completedOrder" class="pos-modal-backdrop" @click.self="closeSuccessModal">
      <div class="pos-success-dialog">
        <div class="dialog-header">
          <div class="success-icon-wrap">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div>
            <h3 class="success-title">Transaksi Berhasil!</h3>
            <p class="success-subtitle">Order ID: #{{ completedOrder.id }} ({{ completedOrder.orderType }})</p>
          </div>
        </div>

        <!-- Receipt Component Preview -->
        <div class="receipt-preview-container">
          <PrintableReceipt :order="completedOrder" />
        </div>

        <div class="dialog-actions">
          <button type="button" class="btn-print" @click="printReceipt">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <polyline points="6 9 6 2 18 2 18 9" stroke="currentColor" stroke-width="1.8" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" stroke-width="1.8" />
              <rect x="6" y="14" width="12" height="8" stroke="currentColor" stroke-width="1.8" />
            </svg>
            <span>Cetak Struk (Print)</span>
          </button>
          <button type="button" class="btn-new-order" @click="closeSuccessModal">
            Transaksi Baru
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { adminService } from '../../services/adminService.js';
import { useAuthStore } from '../../stores/auth.js';
import PrintableReceipt from '../../components/admin/PrintableReceipt.vue';

const authStore = useAuthStore();

const products = ref([]);
const mainCategories = ref([]);
const subcategories = ref([]);

const searchQuery = ref('');
const selectedMainCat = ref('all');
const selectedSubcat = ref('all');

const cart = ref([]);
const orderType = ref('Dine In');
const tableNumber = ref('Meja 01');
const customerName = ref('');
const paymentMethod = ref('Cash');
const cashReceived = ref(0);

const isProcessing = ref(false);
const completedOrder = ref(null);

const loadData = async () => {
  try {
    const [pList, mcList, scList] = await Promise.all([
      adminService.getProducts(),
      adminService.getMainCategories(),
      adminService.getSubcategories()
    ]);
    products.value = pList;
    mainCategories.value = mcList;
    subcategories.value = scList;
  } catch (err) {
    console.error('Error loading POS data:', err);
  }
};

onMounted(() => {
  loadData();
});

const setMainCategory = (cat) => {
  selectedMainCat.value = cat;
  selectedSubcat.value = 'all';
};

const filteredSubcategories = computed(() => {
  if (selectedMainCat.value === 'all') return subcategories.value;
  const targetMainId = selectedMainCat.value === 'restaurant' ? 1 : 2;
  return subcategories.value.filter(sc => {
    if (sc.mainCategoryId) return Number(sc.mainCategoryId) === targetMainId;
    return selectedMainCat.value === 'restaurant' ? sc.type === 'restaurant' : sc.type === 'raw';
  });
});

const getSubcatName = (subcatId) => {
  const found = subcategories.value.find(s => Number(s.id) === Number(subcatId));
  return found?.name || 'Menu';
};

const filteredProducts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return products.value.filter(prod => {
    // Main category filter
    let matchMain = true;
    if (selectedMainCat.value === 'restaurant') {
      matchMain = prod.category === 'restaurant' || prod.mainCategoryId === 1;
    } else if (selectedMainCat.value === 'raw') {
      matchMain = prod.category === 'raw' || prod.mainCategoryId === 2;
    }

    // Subcategory filter
    let matchSub = true;
    if (selectedSubcat.value !== 'all') {
      matchSub = String(prod.subcategoryId || prod.categoryId) === String(selectedSubcat.value);
    }

    // Search Query
    let matchQuery = true;
    if (query) {
      matchQuery = (prod.name + ' ' + (prod.description || '')).toLowerCase().includes(query);
    }

    return matchMain && matchSub && matchQuery;
  });
});

const getCartQty = (productId) => {
  const item = cart.value.find(i => i.id === productId);
  return item ? item.quantity : 0;
};

const addToCart = (product) => {
  const existing = cart.value.find(i => i.id === product.id);
  if (existing) {
    if (existing.quantity < product.stock) {
      existing.quantity++;
    }
  } else {
    cart.value.push({
      id: product.id,
      name: product.name,
      price: product.numericPrice || 0,
      unit: product.unit || '1 porsi',
      stock: product.stock,
      quantity: 1,
      image: product.image
    });
  }
};

const increaseQty = (productId) => {
  const item = cart.value.find(i => i.id === productId);
  if (item && item.quantity < item.stock) {
    item.quantity++;
  }
};

const decreaseQty = (productId) => {
  const item = cart.value.find(i => i.id === productId);
  if (item) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      removeFromCart(productId);
    }
  }
};

const removeFromCart = (productId) => {
  cart.value = cart.value.filter(i => i.id !== productId);
};

const clearCart = () => {
  cart.value = [];
  cashReceived.value = 0;
};

const cartTotalItems = computed(() => {
  return cart.value.reduce((acc, item) => acc + item.quantity, 0);
});

const subtotal = computed(() => {
  return cart.value.reduce((acc, item) => acc + (item.price * item.quantity), 0);
});

const grandTotal = computed(() => {
  return subtotal.value;
});

const cashChange = computed(() => {
  return (cashReceived.value || 0) - grandTotal.value;
});

const handleProcessOrder = async () => {
  if (cart.value.length === 0) return;
  if (paymentMethod.value === 'Cash' && cashReceived.value < grandTotal.value) {
    alert('Jumlah uang tunai yang diterima kurang dari total pembayaran!');
    return;
  }

  isProcessing.value = true;
  try {
    const cashierName = authStore.user?.name || authStore.user?.username || 'Kasir Warung';

    const orderData = {
      orderType: orderType.value,
      tableNumber: orderType.value === 'Dine In' ? tableNumber.value : null,
      customerName: customerName.value.trim() || (orderType.value === 'Dine In' ? `Tamu ${tableNumber.value}` : 'Pelanggan Kasir POS'),
      items: cart.value.map(item => ({
        id: item.id,
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      })),
      totalAmount: grandTotal.value,
      paymentMethod: paymentMethod.value,
      cashReceived: paymentMethod.value === 'Cash' ? cashReceived.value : grandTotal.value,
      cashChange: paymentMethod.value === 'Cash' ? Math.max(0, cashChange.value) : 0,
      cashier: cashierName
    };

    const newOrder = await adminService.createPosOrder(orderData);
    completedOrder.value = newOrder;

    // Refresh products list for updated stock
    await loadData();
  } catch (err) {
    alert('Gagal memproses transaksi: ' + err.message);
  } finally {
    isProcessing.value = false;
  }
};

const closeSuccessModal = () => {
  completedOrder.value = null;
  clearCart();
  customerName.value = '';
};

const printReceipt = () => {
  window.print();
};

const handleImgError = (event) => {
  event.target.src = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600';
};
</script>

<style scoped>
.pos-view {
  width: 100%;
  height: calc(100vh - 90px);
  min-height: 600px;
}

.pos-layout {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 20px;
  height: 100%;
}

/* Left Panel: Catalog */
.pos-catalog-panel {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid var(--line);
  padding: 20px;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(36, 25, 18, 0.04);
}

.catalog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.pos-eyebrow {
  margin: 0 0 4px;
  color: var(--red);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.pos-title {
  margin: 0;
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.5rem;
  font-weight: 600;
}

.pos-search-box {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 280px;
  flex: 1;
  max-width: 400px;
}

.pos-search-box svg {
  position: absolute;
  left: 12px;
  color: var(--muted);
  pointer-events: none;
}

.pos-search-input {
  width: 100%;
  padding: 9px 32px 9px 36px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--soft);
  font-size: 0.82rem;
  color: var(--ink);
  outline: none;
  transition: all var(--ease);
}

.pos-search-input:focus {
  background: #ffffff;
  border-color: var(--red);
}

.clear-search-btn {
  position: absolute;
  right: 10px;
  background: transparent;
  font-size: 1.2rem;
  color: var(--muted);
  cursor: pointer;
  line-height: 1;
}

/* Tabs */
.main-cat-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--line);
  padding-bottom: 10px;
}

.main-tab-btn {
  padding: 6px 14px;
  border-radius: var(--r-sm);
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--muted);
  background: transparent;
  cursor: pointer;
  transition: all var(--ease);
}

.main-tab-btn:hover {
  color: var(--ink);
  background: var(--soft);
}

.main-tab-btn.active {
  background: var(--red);
  color: #ffffff;
}

.subcat-scroll-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  overflow: visible;
  padding-bottom: 12px;
  margin-bottom: 14px;
}

.subcat-pill {
  padding: 4px 12px;
  border-radius: 20px;
  background: var(--soft);
  border: 1px solid var(--line);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--ink);
  white-space: nowrap;
  cursor: pointer;
  transition: all var(--ease);
}

.subcat-pill:hover {
  border-color: var(--red);
  color: var(--red);
}

.subcat-pill.active {
  background: var(--ink);
  color: #ffffff;
  border-color: var(--ink);
}

/* Products Grid */
.pos-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 14px;
  overflow-y: auto;
}

.pos-product-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 10px;
  overflow: hidden;
  text-align: left;
  cursor: pointer;
  transition: all var(--ease);
  padding: 0;
}

.pos-product-card:hover:not(:disabled) {
  border-color: var(--red);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(36, 25, 18, 0.08);
}

.pos-product-card.out-of-stock {
  opacity: 0.55;
  cursor: not-allowed;
}

.product-thumb {
  position: relative;
  width: 100%;
  height: 110px;
  background: var(--soft);
  overflow: hidden;
}

.product-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sold-out-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  background: #dc2626;
  color: #fff;
  font-size: 0.64rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
}

.low-stock-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  background: #f59e0b;
  color: #fff;
  font-size: 0.64rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
}

.in-cart-indicator {
  position: absolute;
  top: 6px;
  left: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--red);
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 800;
  display: grid;
  place-items: center;
  box-shadow: 0 2px 6px rgba(184, 40, 40, 0.4);
}

.product-info {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-category-tag {
  font-size: 0.65rem;
  font-weight: 750;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 2px;
}

.product-title {
  margin: 0 0 6px;
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--ink);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-bottom-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.product-price {
  font-size: 0.88rem;
  font-weight: 800;
  color: var(--red);
}

.product-unit {
  font-size: 0.7rem;
  color: var(--muted);
}

.empty-pos-catalog {
  padding: 60px 20px;
  text-align: center;
  color: var(--muted);
  font-size: 0.86rem;
}

/* Right Panel: Cart & Payment */
.pos-cart-panel {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid var(--line);
  box-shadow: 0 2px 10px rgba(36, 25, 18, 0.04);
  overflow: hidden;
}

.cart-header {
  padding: 16px 18px;
  border-bottom: 1px solid var(--line);
  background: var(--paper);
}

.cart-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.cart-title {
  margin: 0;
  font-size: 1.15rem;
  font-family: Georgia, "Times New Roman", serif;
  color: var(--ink);
}

.cart-items-count {
  padding: 2px 8px;
  border-radius: 12px;
  background: var(--soft);
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--muted);
}

.order-type-selector {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 4px;
  padding: 3px;
  background: var(--soft);
  border-radius: 8px;
  margin-bottom: 10px;
}

.type-btn {
  padding: 6px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--muted);
  background: transparent;
  cursor: pointer;
  transition: all var(--ease);
}

.type-btn.active {
  background: #ffffff;
  color: var(--ink);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.order-meta-inputs {
  display: flex;
  gap: 8px;
}

.meta-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.meta-field label {
  font-size: 0.68rem;
  font-weight: 750;
  color: var(--muted);
}

.meta-field input {
  padding: 5px 8px;
  border-radius: 6px;
  border: 1px solid var(--line);
  background: #fff;
  font-size: 0.78rem;
  color: var(--ink);
  outline: none;
}

.meta-field input:focus {
  border-color: var(--red);
}

/* Cart items list */
.cart-items-wrapper {
  flex: none;
  overflow: visible;
  padding: 12px 16px;
  max-height: none;
}

.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cart-item-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: var(--soft);
  border-radius: 8px;
  border: 1px solid var(--line);
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  margin: 0 0 2px;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-unit-price {
  font-size: 0.7rem;
  color: var(--muted);
}

.qty-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 2px 4px;
}

.qty-btn {
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  background: transparent;
  color: var(--ink);
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
}

.qty-display {
  font-size: 0.78rem;
  font-weight: 750;
  min-width: 16px;
  text-align: center;
}

.item-subtotal {
  font-size: 0.8rem;
  font-weight: 750;
  color: var(--ink);
  min-width: 65px;
  text-align: right;
}

.remove-item-btn {
  background: transparent;
  color: var(--muted);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}

.remove-item-btn:hover {
  color: #dc2626;
}

.empty-cart-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--soft);
  display: grid;
  place-items: center;
  color: var(--muted);
  margin-bottom: 12px;
}

.empty-cart-title {
  margin: 0 0 4px;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--ink);
}

.empty-cart-desc {
  margin: 0;
  font-size: 0.76rem;
  color: var(--muted);
  max-width: 220px;
  line-height: 1.4;
}

/* Cart Footer: Summary & Payment */
.cart-footer {
  padding: 14px 18px;
  border-top: 1px solid var(--line);
  background: var(--paper);
}

.calculation-summary {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.calc-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--muted);
}

.total-row {
  font-size: 1rem;
  font-weight: 800;
  color: var(--ink);
  padding-top: 6px;
  border-top: 1px dashed var(--line);
}

.total-amount {
  color: var(--red);
  font-size: 1.15rem;
}

.payment-method-block {
  margin-bottom: 14px;
}

.section-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 750;
  color: var(--muted);
  margin-bottom: 6px;
}

.payment-methods-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 6px;
  margin-bottom: 8px;
}

.pay-method-btn {
  padding: 6px 4px;
  border-radius: 6px;
  background: #ffffff;
  border: 1px solid var(--line);
  font-size: 0.7rem;
  font-weight: 750;
  color: var(--ink);
  cursor: pointer;
  transition: all var(--ease);
}

.pay-method-btn.active {
  background: var(--red);
  color: #ffffff;
  border-color: var(--red);
}

.cash-calc-wrapper {
  padding: 10px;
  border-radius: 8px;
  background: var(--soft);
  border: 1px solid var(--line);
}

.cash-input-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.cash-input-row label {
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--ink);
}

.cash-input-box {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 4px 8px;
  max-width: 140px;
}

.cash-input-box span {
  font-size: 0.78rem;
  font-weight: 750;
  color: var(--muted);
  margin-right: 4px;
}

.cash-input-box input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 0.82rem;
  font-weight: 750;
  color: var(--ink);
  text-align: right;
}

.cash-preset-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.preset-chip {
  padding: 3px 6px;
  border-radius: 4px;
  background: #ffffff;
  border: 1px solid var(--line);
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--ink);
  cursor: pointer;
}

.preset-chip:hover {
  border-color: var(--red);
}

.change-display-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.78rem;
  color: var(--ink);
  padding-top: 4px;
  border-top: 1px dashed var(--line);
}

.text-negative {
  color: #dc2626;
}

.action-buttons-wrap {
  display: flex;
  gap: 8px;
}

.btn-clear-cart {
  padding: 10px 14px;
  border-radius: var(--r-sm);
  background: #ffffff;
  border: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 750;
  cursor: pointer;
}

.btn-clear-cart:hover:not(:disabled) {
  background: var(--soft);
  color: var(--ink);
}

.btn-checkout-pos {
  flex: 1;
  padding: 10px 16px;
  border-radius: var(--r-sm);
  background: var(--red);
  color: #ffffff;
  font-size: 0.84rem;
  font-weight: 800;
  cursor: pointer;
  transition: all var(--ease);
}

.btn-checkout-pos:hover:not(:disabled) {
  background: var(--red-dark);
}

.btn-checkout-pos:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal Dialogs */
.pos-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(25, 21, 18, 0.6);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  z-index: 80;
  padding: 20px;
}

.pos-success-dialog {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  padding: 24px;
  animation: popIn 200ms ease;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

.success-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #edf7ee;
  color: var(--success);
  display: grid;
  place-items: center;
}

.success-title {
  margin: 0;
  font-size: 1.15rem;
  font-family: Georgia, "Times New Roman", serif;
  color: var(--ink);
}

.success-subtitle {
  margin: 2px 0 0;
  font-size: 0.76rem;
  color: var(--muted);
}

.receipt-preview-container {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 18px;
  border: 1px dashed var(--line);
  border-radius: 8px;
  padding: 12px;
  background: #fdfdfd;
}

.dialog-actions {
  display: flex;
  gap: 10px;
}

.btn-print {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: var(--r-sm);
  background: #ffffff;
  border: 1px solid var(--line);
  color: var(--ink);
  font-size: 0.82rem;
  font-weight: 750;
  cursor: pointer;
}

.btn-print:hover {
  background: var(--soft);
  border-color: var(--red);
  color: var(--red);
}

.btn-new-order {
  flex: 1;
  padding: 10px 16px;
  border-radius: var(--r-sm);
  background: var(--red);
  color: #ffffff;
  font-size: 0.82rem;
  font-weight: 750;
  cursor: pointer;
}

.btn-new-order:hover {
  background: var(--red-dark);
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

@media (max-width: 900px) {
  .pos-layout {
    grid-template-columns: 1fr;
    height: auto;
  }
}

/* ===============================
   RESPONSIVE UX IMPROVEMENTS
   Added: mobile-first POS behavior
================================ */

/* Better scrolling and touch experience */
.pos-view {
  overflow: visible;
}

button,
input {
  -webkit-tap-highlight-color: transparent;
}

.pos-product-card,
.main-tab-btn,
.subcat-pill,
.type-btn,
.pay-method-btn,
.qty-btn,
.btn-checkout-pos,
.btn-clear-cart {
  touch-action: manipulation;
}

/* Tablet */
@media (max-width: 1100px) {
  .pos-layout {
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 12px;
  }

  .pos-catalog-panel {
    padding: 14px;
  }

  .pos-products-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .cart-footer {
    padding: 12px;
  }
}

/* Mobile landscape + small tablet */
@media (max-width: 900px) {
  .pos-view {
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }

  .pos-layout {
    display: flex;
    flex-direction: column;
    height: auto;
  }

  .pos-catalog-panel {
    min-height: auto;
    max-height: none;
    overflow: visible;
    border-radius: 12px;
  }

  .catalog-header {
    position: sticky;
    top: 0;
    z-index: 5;
    background: #fff;
    padding-bottom: 10px;
  }

  .header-titles {
    width: 100%;
  }

  .pos-search-box {
    max-width: none;
    min-width: 0;
    width: 100%;
  }

  .main-cat-tabs {
    overflow-x: auto;
    scrollbar-width: none;
  }

  .main-cat-tabs::-webkit-scrollbar {
    display: none;
  }

  .main-tab-btn {
    flex: 0 0 auto;
    min-height: 40px;
  }

  .subcat-scroll-row {
    margin-bottom: 10px;
  }

  .pos-products-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    overflow: visible;
  }

  .product-thumb {
    height: 120px;
  }

  .pos-cart-panel {
    position: relative;
    width: 100%;
    border-radius: 12px;
    min-height: 520px;
  }

  .cart-items-wrapper {
    max-height: 420px;
  }

  .cart-footer {
    position: sticky;
    bottom: 0;
    z-index: 4;
    background: var(--paper);
  }
}

/* Small phones */
@media (max-width: 480px) {
  .pos-catalog-panel {
    padding: 10px;
  }

  .pos-title {
    font-size: 1.2rem;
  }

  .pos-products-grid {
    grid-template-columns: repeat(2, minmax(130px, 1fr));
    gap: 8px;
  }

  .product-thumb {
    height: 100px;
  }

  .product-info {
    padding: 8px;
  }

  .product-title {
    font-size: .78rem;
  }

  .product-price {
    font-size: .8rem;
  }

  .order-type-selector,
  .payment-methods-grid {
    grid-template-columns: 1fr;
  }

  .order-meta-inputs {
    flex-direction: column;
  }

  .cart-item-row {
    flex-wrap: wrap;
  }

  .item-details {
    flex-basis: calc(100% - 10px);
  }

  .qty-controls {
    margin-left: auto;
  }

  .item-subtotal {
    min-width: auto;
  }

  .action-buttons-wrap {
    flex-direction: column;
  }

  .btn-clear-cart,
  .btn-checkout-pos {
    width: 100%;
  }

  .pos-success-dialog {
    padding: 16px;
    max-height: 95vh;
  }

  .dialog-actions {
    flex-direction: column;
  }
}

/* Accessibility and interaction polish */
@media (hover: none) {
  .pos-product-card:hover:not(:disabled) {
    transform: none;
    box-shadow: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}



/* ===============================
   FINAL POS UX PATCH
================================ */

/* Hide every scrollbar on category pills */
.subcat-scroll-row,
.main-cat-tabs {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.subcat-scroll-row::-webkit-scrollbar,
.main-cat-tabs::-webkit-scrollbar {
  display: none;
}

/* Cart follows item height, no internal scrollbar */
.pos-cart-panel {
  overflow: visible;
  height: auto;
}

.cart-items-wrapper {
  overflow: visible !important;
  max-height: none !important;
}

.cart-items-list {
  max-height: none;
}

/* Let the POS grow naturally with products */
.pos-layout {
  min-height: auto;
}

@media (max-width: 900px) {
  .cart-items-wrapper {
    max-height: none !important;
    overflow: visible !important;
  }

  .subcat-scroll-row {
    flex-wrap: wrap;
  }
}



/* FINAL OVERFLOW FIX */
.pos-view,
.pos-layout,
.pos-cart-panel {
  overflow: visible !important;
}

.cart-footer {
  position: relative !important;
  bottom: auto !important;
}

@media (max-width: 900px) {
  .pos-layout {
    display: flex;
    flex-direction: column;
    height: auto !important;
  }

  .pos-cart-panel {
    height: auto !important;
    min-height: 0 !important;
  }

  .cart-items-wrapper {
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
  }
}

</style>
