import { adminService } from './adminService.js';
import { products as fallbackProducts } from '../data/products.js';

/**
 * Menu Service
 * Handles menu item data retrieval and filtering.
 * Connects directly with admin product management.
 */
export const menuService = {
  async getProducts() {
    try {
      const items = await adminService.getProducts();
      if (items && items.length > 0) {
        return items;
      }
    } catch (e) {
      console.warn('Fallback to local products list:', e);
    }
    return [...fallbackProducts];
  },

  async filterProducts({ category = 'all', query = '' }) {
    const allProducts = await this.getProducts();
    const cleanQuery = query.trim().toLowerCase();

    return allProducts.filter(product => {
      const categoryMatch = category === 'all' || product.category === category;
      const searchMatch =
        !cleanQuery ||
        (product.name + ' ' + (product.description || '')).toLowerCase().includes(cleanQuery);
      return categoryMatch && searchMatch;
    });
  }
};

