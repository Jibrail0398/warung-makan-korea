import { adminService } from './adminService.js';
import { products as fallbackProducts } from '../data/products.js';

/**
 * Menu Service
 * Handles menu item data retrieval and filtering.
 * Connects directly with admin product & category management.
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

  async getMainCategories() {
    try {
      return await adminService.getMainCategories();
    } catch (e) {
      return [
        { id: 1, name: 'Restaurant Menu', code: 'restaurant', slug: 'restaurant-menu' },
        { id: 2, name: 'Raw Material', code: 'raw', slug: 'raw-material' }
      ];
    }
  },

  async getSubcategories() {
    try {
      return await adminService.getSubcategories();
    } catch (e) {
      return [];
    }
  },

  async filterProducts({ mainCategory = 'all', subcategory = 'all', query = '' }) {
    const allProducts = await this.getProducts();
    const cleanQuery = query.trim().toLowerCase();

    return allProducts.filter(product => {
      // Main Category match: check by code ('restaurant'/'raw') or mainCategoryId
      let mainCategoryMatch = mainCategory === 'all';
      if (!mainCategoryMatch) {
        if (mainCategory === 'restaurant' || mainCategory === '1' || mainCategory === 1) {
          mainCategoryMatch = product.category === 'restaurant' || product.mainCategoryId === 1;
        } else if (mainCategory === 'raw' || mainCategory === '2' || mainCategory === 2) {
          mainCategoryMatch = product.category === 'raw' || product.mainCategoryId === 2;
        }
      }

      // Subcategory match
      let subcategoryMatch = subcategory === 'all';
      if (!subcategoryMatch) {
        subcategoryMatch = String(product.subcategoryId || product.categoryId) === String(subcategory);
      }

      const searchMatch =
        !cleanQuery ||
        (product.name + ' ' + (product.description || '')).toLowerCase().includes(cleanQuery);

      return mainCategoryMatch && subcategoryMatch && searchMatch;
    });
  }
};


