import axios from 'axios';
import { authService } from './authService.js';

const apiBaseUrl = import.meta.env.VITE_API_URL
	|| `${import.meta.env.VITE_URL || 'http://localhost:8000'}/api`;
const orderStorageKey = 'warung-order-id';

function getErrorMessage(error, fallback) {
	return error.response?.data?.message
		|| Object.values(error.response?.data?.errors || {})[0]?.[0]
		|| fallback;
}

export const orderService = {
	async getOrderById(orderId) {
		try {
			const response = await axios.get(`${apiBaseUrl}/orders/${orderId}`);
			return response.data?.data || response.data;
		} catch (error) {
			throw new Error(getErrorMessage(error, 'Gagal mengambil detail pesanan.'));
		}
	},

	async createOrder(orderData) {
		try {
			const storedAuth = localStorage.getItem('warung-auth-data');
			const authData = storedAuth ? await authService.getStoredAuth() : null;
			const authenticatedUser = authData?.user;

			const payload = {
				customer_name: authenticatedUser?.name || orderData.customer_name,
				customer_phone: authenticatedUser?.phone_number || orderData.customer_phone,
				user_id: orderData.user_id || undefined,
				table_number: orderData.table_number || undefined,
				bank_account_id: orderData.bank_account_id || undefined,
				items: orderData.items.map(item => ({
					product_id: item.product_id,
					quantity: item.quantity
				}))
			};


			const response = await axios.post(`${apiBaseUrl}/orders`, payload);
			const createdOrder = response.data?.data || response.data;
			const orderId = createdOrder?.id || createdOrder?.order_id;

			if (!orderId) {
				throw new Error('ID order tidak ditemukan dari response server.');
			}

			localStorage.setItem(orderStorageKey, orderId);
			return createdOrder;
		} catch (error) {
			throw new Error(getErrorMessage(error, 'Gagal membuat pesanan.'));
		}
	},

	async uploadReceipt(file) {
		try {
			const orderId = localStorage.getItem(orderStorageKey);
			if (!orderId) {
				throw new Error('ID order tidak ditemukan. Silakan buat order terlebih dahulu.');
			}

			const formData = new FormData();
			formData.append('payment_receipt', file);

			const response = await axios.post(
				`${apiBaseUrl}/orders/${orderId}/receipt`,
				formData
			);
			const updatedOrder = response.data?.data || response.data;
			localStorage.removeItem(orderStorageKey);
			return updatedOrder;
		} catch (error) {
			throw new Error(getErrorMessage(error, 'Gagal mengunggah bukti pembayaran.'));
		}
	}
};
