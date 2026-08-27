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

  function saveCart() {
    localStorage.setItem('warung-cart', JSON.stringify(cart.value));
  }

  const cartItems = computed(() => {
    return products
      .filter(product => cart.value[product.id] > 0)
      .map(product => ({
        ...product,
        quantity: cart.value[product.id]
      }));
  });

  const cartCount = computed(() => {
    return Object.values(cart.value).reduce((total, qty) => total + (qty || 0), 0);
  });

  const subtotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.numericPrice * item.quantity, 0);
  });

  const delivery = computed(() => {
    if (cartItems.value.length === 0) return 0;
    return subtotal.value >= 50000 ? 0 : 3000;
  });

  const total = computed(() => {
    return subtotal.value + delivery.value;
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
    formatPrice
  };
});
