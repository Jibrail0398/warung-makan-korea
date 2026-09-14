import api from './api.js';
import { products as fallbackProducts } from '../data/products.js';

const CATEGORY_TYPE_MAP = {
  'makanan-utama': 'restaurant',
  'korean-street-food': 'restaurant',
  'sup-jjigae': 'restaurant',
  'banchan-side-dish': 'restaurant',
  'minuman': 'restaurant',
  'dessert': 'restaurant',
  'bahan-mentah-daging': 'raw',
  'bumbu-sambal': 'raw',
  'beras-sembako': 'raw',
  'camilan-tambahan': 'raw',
};

function mapProduct(item) {
  const categorySlug = item.category?.slug || '';
  const categoryType = CATEGORY_TYPE_MAP[categorySlug] || 'restaurant';
  const mainCategoryId = categoryType === 'restaurant' ? 1 : 2;
  const numericPrice = Number(item.price) || 0;

  return {
    id: item.id,
    name: item.name,
    description: item.description || '',
    image: item.image_url || '',
    price: `₩${numericPrice.toLocaleString('ko-KR')}`,
    numericPrice,
    category: categoryType,
    mainCategoryId,
    subcategoryId: item.category_id,
    categoryId: item.category_id,
    weightOrUnit: item.weight_or_unit || '',
    isActive: item.is_active !== false,
  };
}

export const menuService = {
  async getProducts() {
    try {
      const { data } = await api.get('/products');
      const items = data?.data?.data || data?.data || [];
      return items.map(mapProduct);
    } catch (e) {
      console.warn('Backend unavailable, falling back to local products:', e);
      return [...fallbackProducts];
    }
  },

  async getMainCategories() {
    try {
      const { data } = await api.get('/categories');
      const items = data?.data?.data || data?.data || [];
      return items.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        code: CATEGORY_TYPE_MAP[c.slug] || 'restaurant',
      }));
    } catch (e) {
      return [
        { id: 1, name: 'Restaurant Menu', code: 'restaurant', slug: 'restaurant-menu' },
        { id: 2, name: 'Raw Material', code: 'raw', slug: 'raw-material' },
      ];
    }
  },

  async getSubcategories() {
    try {
      const { data } = await api.get('/categories');
      return data?.data?.data || data?.data || [];
    } catch (e) {
      return [];
    }
  },

  async filterProducts({ mainCategory = 'all', subcategory = 'all', query = '' }) {
    const allProducts = await this.getProducts();
    const cleanQuery = query.trim().toLowerCase();

    return allProducts.filter(product => {
      let mainCategoryMatch = mainCategory === 'all';
      if (!mainCategoryMatch) {
        mainCategoryMatch = product.category === mainCategory;
      }

      let subcategoryMatch = subcategory === 'all';
      if (!subcategoryMatch) {
        subcategoryMatch = String(product.categoryId) === String(subcategory);
      }

      const searchMatch =
        !cleanQuery ||
        (product.name + ' ' + (product.description || '')).toLowerCase().includes(cleanQuery);

      return mainCategoryMatch && subcategoryMatch && searchMatch;
    });
  },
};
