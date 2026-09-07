/**
 * Auth Service
 * Handles Products Request
 */

import axios from 'axios';
const apiBaseUrl = import.meta.env.VITE_API_URL
  || `${import.meta.env.VITE_URL || 'http://localhost:8000'}/api`;


export const productService = {
    async getProducts() {
        try {
            const response = await axios.get(`${apiBaseUrl}/products`);
            return response.data;
        } catch (error) {
            const message = error.response.data.message;
            throw new Error(message);
        }
    },
}