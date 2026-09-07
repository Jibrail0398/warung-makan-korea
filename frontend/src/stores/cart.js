import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { products } from '../data/products.js';

export const useCartStore = defineStore('cart', () => {
  // Initial cart state from localStorage or default initial items
  const initialCart = JSON.parse(localStorage.getItem('warung-cart') || null) || {
    1: 2,
    3: 1,
    5: 3,
    2: 1,
    4: 5
  };

  const cart = ref(initialCart);
  const storedProducts = JSON.parse(localStorage.getItem('warung-cart-products') || '{}');
  const productCatalog = ref({
    ...products.reduce((catalog, product) => {
      catalog[product.id] = product;
      return catalog;
    }, {}),
    ...storedProducts
  });

  function saveCart() {
    localStorage.setItem('warung-cart', JSON.stringify(cart.value));
  }

  function saveProductCatalog() {
    localStorage.setItem('warung-cart-products', JSON.stringify(productCatalog.value));
  }

  function registerProducts(items) {
    items.forEach((item) => {
      const numericPrice = Number(item.numericPrice ?? item.price);
      productCatalog.value[item.id] = {
        ...item,
        numericPrice: Number.isFinite(numericPrice) ? numericPrice : 0
      };
    });
    saveProductCatalog();
  }

  const cartItems = computed(() => {
    return Object.entries(cart.value)
      .filter(([id, quantity]) => Number(quantity) > 0 && productCatalog.value[id])
      .map(([id, quantity]) => ({
        ...productCatalog.value[id],
        quantity: Number(quantity)
      }));
  });

  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0);
  });

  const subtotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + Number(item.numericPrice || 0) * item.quantity, 0);
  });

  // Delivery (disabled)
  // const delivery = computed(() => {
  //   if (cartItems.value.length === 0) return 0;
  //   return subtotal.value >= 50000 ? 0 : 3000;
  // });
  const delivery = computed(() => 0);

  const total = computed(() => {
    return subtotal.value;
  });

  function getQuantity(productId) {
    return cart.value[productId] || 0;
  }

  function increaseQuantity(product) {
    const id = typeof product === 'object' ? product.id : product;
    const currentQty = getQuantity(id);

    cart.value = {
      ...cart.value,
      [id]: currentQty + 1
    };

    saveCart();
  }

  function decreaseQuantity(product) {
    const id = typeof product === 'object' ? product.id : product;
    const currentQty = getQuantity(id);

    if (currentQty <= 1) {
      removeItem(id);
      return;
    }

    cart.value = {
      ...cart.value,
      [id]: currentQty - 1
    };

    saveCart();
  }

  function removeItem(id) {
    const updated = { ...cart.value };
    delete updated[id];
    cart.value = updated;
    saveCart();
  }

  function clearCart() {
    cart.value = {};
    saveCart();
  }

  function formatPrice(value) {
    return `₩${value.toLocaleString('ko-KR')}`;
  }

  return {
    cart,
    cartItems,
    cartCount,
    subtotal,
    delivery,
    total,
    getQuantity,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    registerProducts,
    formatPrice
  };
});
