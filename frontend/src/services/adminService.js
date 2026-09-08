import api from './api.js';

export const adminService = {
  // ==========================================
  // DASHBOARD & ANALYTICS
  // ==========================================
  async getDashboardStats() {
    try {
      const response = await api.get('/reports/dashboard');
      return response.data?.data || {};
    } catch (error) {
      console.error('Failed to get dashboard stats:', error);
      throw error;
    }
  },

  async getTransactionReports(params = {}) {
    try {
      const response = await api.get('/reports/transactions', { params });
      return response.data?.data || { summary: {}, orders: [] };
    } catch (error) {
      console.error('Failed to get transaction reports:', error);
      throw error;
    }
  },

  async getFinancialReports(params = {}) {
    try {
      const response = await api.get('/reports/financial', { params });
      return response.data?.data || { breakdown: {}, topProducts: [] };
    } catch (error) {
      console.error('Failed to get financial reports:', error);
      throw error;
    }
  },

  // ==========================================
  // ORDER MONITORING & MANAGEMENT
  // ==========================================
  async getOrders(params = {}) {
    try {
      const response = await api.get('/orders', {
        params: {
          all: 'true',
          ...params
        }
      });
      const data = response.data?.data;
      return Array.isArray(data) ? data : (data?.data || []);
    } catch (error) {
      console.error('Failed to get orders:', error);
      throw error;
    }
  },

  async getOrderById(id) {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data?.data;
    } catch (error) {
      console.error(`Failed to get order ${id}:`, error);
      throw error;
    }
  },

  async updateOrderStatus(id, payload) {
    try {
      const statusData = typeof payload === 'string' ? { status: payload } : payload;
      const response = await api.put(`/orders/${id}/status`, statusData);
      return response.data?.data;
    } catch (error) {
      console.error(`Failed to update order ${id} status:`, error);
      throw error;
    }
  },

  async createPosOrder(orderPayload) {
    try {
      const response = await api.post('/orders', orderPayload);
      return response.data?.data;
    } catch (error) {
      console.error('Failed to create POS order:', error);
      const message = error.response?.data?.message || 'Gagal memproses transaksi pesanan';
      throw new Error(message);
    }
  },

  // ==========================================
  // PRODUCT MANAGEMENT
  // ==========================================
  async getProducts(params = {}) {
    try {
      const response = await api.get('/products', {
        params: {
          all: 'true',
          ...params
        }
      });
      const data = response.data?.data;
      return Array.isArray(data) ? data : (data?.data || []);
    } catch (error) {
      console.error('Failed to get products:', error);
      throw error;
    }
  },

  async createProduct(productData) {
    try {
      const response = await api.post('/products', productData);
      return response.data?.data;
    } catch (error) {
      console.error('Failed to create product:', error);
      const message = error.response?.data?.message || 'Gagal menambahkan produk';
      throw new Error(message);
    }
  },

  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data?.data;
    } catch (error) {
      console.error(`Failed to update product ${id}:`, error);
      const message = error.response?.data?.message || 'Gagal memperbarui produk';
      throw new Error(message);
    }
  },

  async deleteProduct(id) {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete product ${id}:`, error);
      const message = error.response?.data?.message || 'Gagal menghapus produk';
      throw new Error(message);
    }
  },

  // ==========================================
  // CATEGORIES MANAGEMENT
  // ==========================================
  async getCategories(params = {}) {
    try {
      const response = await api.get('/categories', {
        params: {
          all: 'true',
          ...params
        }
      });
      const data = response.data?.data;
      return Array.isArray(data) ? data : (data?.data || []);
    } catch (error) {
      console.error('Failed to get categories:', error);
      throw error;
    }
  },

  async createCategory(categoryData) {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data?.data;
    } catch (error) {
      console.error('Failed to create category:', error);
      const message = error.response?.data?.message || 'Gagal menambahkan kategori';
      throw new Error(message);
    }
  },

  async updateCategory(id, categoryData) {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data?.data;
    } catch (error) {
      console.error(`Failed to update category ${id}:`, error);
      const message = error.response?.data?.message || 'Gagal memperbarui kategori';
      throw new Error(message);
    }
  },

  async deleteCategory(id) {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete category ${id}:`, error);
      const message = error.response?.data?.message || 'Gagal menghapus kategori';
      throw new Error(message);
    }
  },

  // ==========================================
  // AUTH & ACCOUNT SECURITY
  // ==========================================
  async changePassword(passwordData) {
    try {
      const response = await api.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Failed to change password:', error);
      const message = error.response?.data?.message || 'Gagal memperbarui kata sandi';
      throw new Error(message);
    }
  }
};
