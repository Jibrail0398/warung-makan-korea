import { defineStore } from 'pinia';
import { ref } from 'vue';
import { orderService } from '../services/orderService.js';

export const useOrderStore = defineStore('order', () => {
  const currentOrder = ref(null);
  const orderHistory = ref([]);
  const isLoading = ref(false);

  async function fetchActiveOrder() {
    isLoading.value = true;
    try {
      currentOrder.value = await orderService.getActiveOrder();
      return currentOrder.value;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchOrderById(id) {
    isLoading.value = true;
    try {
      currentOrder.value = await orderService.getOrderById(id);
      return currentOrder.value;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchOrderHistory() {
    isLoading.value = true;
    try {
      orderHistory.value = await orderService.getOrderHistory();
      return orderHistory.value;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    currentOrder,
    orderHistory,
    isLoading,
    fetchActiveOrder,
    fetchOrderById,
    fetchOrderHistory
  };
});
