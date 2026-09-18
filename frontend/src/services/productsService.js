/**
 * Product Service
 * Handles Products Request
 */

import axios from 'axios';
import { authService } from './authService.js';

const apiBaseUrl = import.meta.env.VITE_API_URL
  || `${import.meta.env.VITE_URL || 'http://localhost:8000'}/api`;

async function getAuthHeaders() {
    const authData = await authService.getStoredAuth();
    const token = authData?.access_token || '';
    return { Authorization: `Bearer ${token}` };
}

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
                    const categoryName = item.category?.name || '';

                    return {
                        id: item.id,
                        name: item.name,
                        description: item.description || '',
                        image: item.image_url || '',
                        numericPrice,
                        price: `₩${numericPrice.toLocaleString('ko-KR')}`,
                        category: categoryName || categorySlug || '',
                        categoryName: categoryName || categorySlug || '',
                        categorySlug,
                        categoryId: item.category_id,
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

    async getCategories() {
        try {
            const response = await axios.get(`${apiBaseUrl}/categories`);
            return response.data?.data?.data || [];
        } catch (error) {
            const message = error.response?.data?.message || 'Gagal mengambil kategori.';
            throw new Error(message);
        }
    },

    async getAdminProducts(page = 1, filters = {}) {
        try {
            const headers = await getAuthHeaders();
            const params = { page };
            if (filters.search) params.search = filters.search;
            if (filters.categoryId && filters.categoryId !== 'all') params.category_id = filters.categoryId;
            if (filters.status && filters.status !== 'all') params.status = filters.status;

            const response = await axios.get(`${apiBaseUrl}/admin/products`, {
                params,
                headers
            });
            const payload = response.data?.data || {};

            return {
                products: (payload.data || []).map((item) => {
                    const numericPrice = Number(item.price) || 0;

                    return {
                        id: item.id,
                        name: item.name,
                        description: item.description || '',
                        image: item.image_url || '',
                        numericPrice,
                        price: `₩${numericPrice.toLocaleString('ko-KR')}`,
                        category: item.category?.name || '',
                        categorySlug: item.category?.slug || '',
                        categoryId: item.category_id,
                        weightOrUnit: item.weight_or_unit || '',
                        isActive: item.is_active !== false,
                        status: item.is_active !== false ? 'Available' : 'Sold Out'
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

    async addProduct(body) {
        try {
            const headers = await getAuthHeaders();
            const response = await axios.post(`${apiBaseUrl}/products`, body, {
                headers: {
                    ...headers,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Gagal menambahkan produk.';
            throw new Error(message);
        }
    },

    async updateProduct(id, formData) {
        try {
            const headers = await getAuthHeaders();

            // Laravel tidak menerima multipart untuk PUT langsung, gunakan method spoofing
            formData.append('_method', 'PUT');

            const response = await axios.post(`${apiBaseUrl}/products/${id}`, formData, {
                headers: {
                    ...headers,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Gagal memperbarui produk.';
            throw new Error(message);
        }
    },

    async deleteProduct(id) {
        try {
            const headers = await getAuthHeaders();
            const response = await axios.delete(`${apiBaseUrl}/products/${id}`, {
                headers
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Gagal menghapus produk.';
            throw new Error(message);
        }
    }
}