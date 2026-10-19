import axios from 'axios';
import { authService } from './authService.js';
import { apiBaseUrl } from '../utils/config.js';

export const categoriesService = {
  async getCategories() {
    try {
      const response = await axios.get(`${apiBaseUrl}/categories`);
      const items = response.data?.data?.data || [];
      return items.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
      }));
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal mengambil kategori.';
      throw new Error(message);
    }
  },

  //Integrasi API Create Category
  async createCategory(categoryData) {
    try {
      const authData = await authService.getStoredAuth();
      const token = authData?.access_token || '';

      const response = await axios.post(`${apiBaseUrl}/categories`, {
        name: categoryData.name
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal membuat kategori.';
      throw new Error(message);
    }
  },

  async updateCategory(id, categoryData) {
    try {
      const authData = await authService.getStoredAuth();
      const token = authData?.access_token || '';

      const response = await axios.put(`${apiBaseUrl}/categories/${id}`, {
        name: categoryData.name
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal memperbarui kategori.';
      throw new Error(message);
    }
  },

  async deleteCategory(id) {
    try {
      const authData = await authService.getStoredAuth();
      const token = authData?.access_token || '';

      const response = await axios.delete(`${apiBaseUrl}/categories/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal menghapus kategori.';
      throw new Error(message);
    }
  },
};
