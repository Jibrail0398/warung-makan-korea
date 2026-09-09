import axios from 'axios';
import { authService } from './authService.js';

const apiBaseUrl = import.meta.env.VITE_API_URL
  || `${import.meta.env.VITE_URL || 'http://localhost:8000'}/api`;

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
      const stored = localStorage.getItem('warung-auth-data');
      const authData = await authService.decode(stored);
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
};
