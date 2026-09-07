/**
 * Auth Service
 * Handles Products Request
 */

import axios from 'axios';
const apiBaseUrl = import.meta.env.VITE_API_URL
  || `${import.meta.env.VITE_URL || 'http://localhost:8000'}/api`;

const rawCategorySlugs = new Set([
        'bahan-mentah-daging',
        'bumbu-sambal',
        'beras-sembako',
        'camilan-tambahan'
]);


export const productService = {
    async getProducts(page = 1) {
        try {
            const response = await axios.get(`${apiBaseUrl}/products`, {
                params: { page }
            });
            const payload = response.data?.data || {};

            return {
                products: (payload.data || []).map((item) => {
                    const numericPrice = Number(item.price) || 0;
                    const categorySlug = item.category?.slug || '';

                    return {
                        id: item.id,
                        name: item.name,
                        description: item.description || '',
                        image: item.image_url || '',
                        price: `₩${numericPrice.toLocaleString('ko-KR')}`,
                        numericPrice,
                        category: rawCategorySlugs.has(categorySlug) ? 'raw' : 'restaurant',
                        categoryId: item.category_id,
                        subcategoryId: item.category_id,
                        weightOrUnit: item.weight_or_unit || '',
                        isActive: item.is_active !== false
                    };
                }),
                pagination: {
                    currentPage: payload.meta?.current_page || page,
                    lastPage: payload.meta?.last_page || 1,
                    total: payload.meta?.total || 0,
                    perPage: payload.meta?.per_page || 0
                }
            };
        } catch (error) {
            const message = error.response?.data?.message || 'Gagal mengambil produk.';
            throw new Error(message);
        }
    },
}