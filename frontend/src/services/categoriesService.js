import axios from 'axios';

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
};
