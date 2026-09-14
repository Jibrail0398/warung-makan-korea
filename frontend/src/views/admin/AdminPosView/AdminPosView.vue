<template>
  <div class="pos-view">
    <div class="pos-layout">
      <section class="pos-catalog-panel">
        <div class="catalog-header">
          <div class="header-titles"><p class="pos-eyebrow">POINT OF SALE</p><h1 class="pos-title">Kasir Warung</h1></div>
          <div class="pos-search-box">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.8" /><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
            <input type="text" v-model="searchQuery" placeholder="Ketik nama makanan atau bahan..." class="pos-search-input" />
            <button v-if="searchQuery" type="button" class="clear-search-btn" @click="searchQuery = ''">×</button>
          </div>
        </div>
        <div class="main-cat-tabs" role="tablist">
          <button type="button" class="main-tab-btn" :class="{ active: selectedMainCat === 'all' }" @click="setMainCategory('all')">Semua Menu & Bahan</button>
          <button type="button" class="main-tab-btn" :class="{ active: selectedMainCat === 'restaurant' }" @click="setMainCategory('restaurant')">Restaurant Menu (Siap Santap)</button>
          <button type="button" class="main-tab-btn" :class="{ active: selectedMainCat === 'raw' }" @click="setMainCategory('raw')">Raw Material (Bahan Mentah)</button>
        </div>
        <div class="subcat-scroll-row">
          <button type="button" class="subcat-pill" :class="{ active: selectedSubcat === 'all' }" @click="selectedSubcat = 'all'">Semua Subkategori</button>
          <button v-for="sub in filteredSubcategories" :key="sub.id" type="button" class="subcat-pill" :class="{ active: selectedSubcat === sub.id }" @click="selectedSubcat = sub.id">{{ sub.name }}</button>
        </div>
        <div v-if="filteredProducts.length > 0" class="pos-products-grid">
          <button v-for="product in filteredProducts" :key="product.id" type="button" class="pos-product-card" :class="{ 'out-of-stock': product.stock <= 0 || product.status === 'Sold Out' }" :disabled="product.stock <= 0 || product.status === 'Sold Out'" @click="addToCart(product)">
            <div class="product-thumb">
              <img :src="product.image" :alt="product.name" @error="handleImgError($event)" />
              <span v-if="product.stock <= 0 || product.status === 'Sold Out'" class="sold-out-badge">HABIS</span>
              <span v-else-if="product.stock <= 5" class="low-stock-badge">Sisa {{ product.stock }}</span>
            </div>
            <div class="product-info">
              <span class="product-category-tag">{{ getSubcatName(product.subcategoryId || product.categoryId) }}</span>
              <h3 class="product-title">{{ product.name }}</h3>
              <div class="product-bottom-row"><span class="product-price">₩{{ (product.numericPrice || 0).toLocaleString('ko-KR') }}</span><span class="product-unit">{{ product.unit || '1 porsi' }}</span></div>
            </div>
            <div v-if="getCartQty(product.id) > 0" class="in-cart-indicator">{{ getCartQty(product.id) }}</div>
          </button>
        </div>
        <div v-else class="empty-pos-catalog"><p>Tidak ada produk yang cocok dengan pencarian atau filter kategori.</p></div>
      </section>
      <aside class="pos-cart-panel">
        <div class="cart-header">
          <div class="cart-title-row"><h2 class="cart-title">Order Kasir</h2><span class="cart-items-count">{{ cartTotalItems }} item</span></div>
          <div class="order-type-selector">
            <button type="button" class="type-btn" :class="{ active: orderType === 'Dine In' }" @click="orderType = 'Dine In'">Makan di Tempat</button>
            <button type="button" class="type-btn" :class="{ active: orderType === 'Takeaway' }" @click="orderType = 'Takeaway'">Bungkus</button>
            <button type="button" class="type-btn" :class="{ active: orderType === 'Delivery' }" @click="orderType = 'Delivery'">Antar</button>
          </div>
          <div class="order-meta-inputs">
            <div v-if="orderType === 'Dine In'" class="meta-field"><label>No. Meja:</label><input type="text" v-model="tableNumber" placeholder="Contoh: Meja 05" /></div>
            <div class="meta-field customer-name-field"><label>Nama Pelanggan:</label><input type="text" v-model="customerName" placeholder="Nama / No. HP" /></div>
          </div>
        </div>
        <div class="cart-items-wrapper">
          <div v-if="cart.length > 0" class="cart-items-list">
            <div v-for="item in cart" :key="item.id" class="cart-item-row">
              <div class="item-details"><h4 class="item-name">{{ item.name }}</h4><span class="item-unit-price">₩{{ item.price.toLocaleString('ko-KR') }} / {{ item.unit || 'porsi' }}</span></div>
              <div class="qty-controls">
                <button type="button" class="qty-btn" @click="decreaseQty(item.id)" aria-label="Kurang">-</button>
                <span class="qty-display">{{ item.quantity }}</span>
                <button type="button" class="qty-btn" :disabled="item.quantity >= item.stock" @click="increaseQty(item.id)" aria-label="Tambah">+</button>
              </div>
              <div class="item-subtotal">₩{{ (item.price * item.quantity).toLocaleString('ko-KR') }}</div>
              <button type="button" class="remove-item-btn" title="Hapus" @click="removeFromCart(item.id)">×</button>
            </div>
          </div>
          <div v-else class="empty-cart-state">
            <div class="empty-icon-wrap"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="21" r="1" stroke="currentColor" stroke-width="1.8" /><circle cx="20" cy="21" r="1" stroke="currentColor" stroke-width="1.8" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg></div>
            <p class="empty-cart-title">Keranjang Kasir Kosong</p>
            <p class="empty-cart-desc">Klik produk di katalog sebelah kiri untuk menambahkan pesanan.</p>
          </div>
        </div>
        <div class="cart-footer">
          <div class="calculation-summary">
            <div class="calc-row"><span>Subtotal:</span><span>₩{{ subtotal.toLocaleString('ko-KR') }}</span></div>
            <div class="calc-row total-row"><span>Total Pembayaran:</span><span class="total-amount">₩{{ grandTotal.toLocaleString('ko-KR') }}</span></div>
          </div>
          <div class="payment-method-block">
            <label class="section-label">Metode Pembayaran:</label>
            <div class="payment-methods-grid">
              <button type="button" class="pay-method-btn" :class="{ active: paymentMethod === 'Cash' }" @click="paymentMethod = 'Cash'">Tunai (Cash)</button>
              <button type="button" class="pay-method-btn" :class="{ active: paymentMethod === 'QRIS' }" @click="paymentMethod = 'QRIS'">QRIS / Transfer</button>
              <button type="button" class="pay-method-btn" :class="{ active: paymentMethod === 'Card' }" @click="paymentMethod = 'Card'">Debit / Kartu</button>
            </div>
            <div v-if="paymentMethod === 'Cash'" class="cash-calc-wrapper">
              <div class="cash-input-row"><label>Uang Diterima:</label><div class="cash-input-box"><span>₩</span><input type="number" v-model.number="cashReceived" min="0" step="1000" placeholder="0" /></div></div>
              <div class="cash-preset-row">
                <button type="button" class="preset-chip" @click="cashReceived = grandTotal">Uang Pas</button>
                <button type="button" class="preset-chip" @click="cashReceived = 10000">₩10.000</button>
                <button type="button" class="preset-chip" @click="cashReceived = 20000">₩20.000</button>
                <button type="button" class="preset-chip" @click="cashReceived = 50000">₩50.000</button>
                <button type="button" class="preset-chip" @click="cashReceived = 100000">₩100.000</button>
              </div>
              <div class="change-display-row"><span>Kembalian:</span><strong :class="{ 'text-negative': cashChange < 0 }">₩{{ Math.max(0, cashChange).toLocaleString('ko-KR') }}</strong></div>
            </div>
          </div>
          <div class="action-buttons-wrap">
            <button type="button" class="btn-clear-cart" :disabled="cart.length === 0 || isProcessing" @click="clearCart">Reset</button>
            <button type="button" class="btn-checkout-pos" :disabled="cart.length === 0 || isProcessing || (paymentMethod === 'Cash' && cashReceived < grandTotal)" @click="handleProcessOrder">{{ isProcessing ? 'Memproses Pesanan...' : `Bayar Sekarang (₩${grandTotal.toLocaleString('ko-KR')})` }}</button>
          </div>
        </div>
      </aside>
    </div>
    <div v-if="completedOrder" class="pos-modal-backdrop" @click.self="closeSuccessModal">
      <div class="pos-success-dialog">
        <div class="dialog-header">
          <div class="success-icon-wrap"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg></div>
          <div><h3 class="success-title">Transaksi Berhasil!</h3><p class="success-subtitle">Order ID: #{{ completedOrder.id }} ({{ completedOrder.orderType }})</p></div>
        </div>
        <div class="receipt-preview-container"><PrintableReceipt :order="completedOrder" /></div>
        <div class="dialog-actions">
          <button type="button" class="btn-print" @click="printReceipt"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><polyline points="6 9 6 2 18 2 18 9" stroke="currentColor" stroke-width="1.8" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" stroke-width="1.8" /><rect x="6" y="14" width="12" height="8" stroke="currentColor" stroke-width="1.8" /></svg><span>Cetak Struk (Print)</span></button>
          <button type="button" class="btn-new-order" @click="closeSuccessModal">Transaksi Baru</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminPosScript from './AdminPosView.js';
export default { ...AdminPosScript };
</script>
