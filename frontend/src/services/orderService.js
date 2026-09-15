import axios from 'axios';
import { authService } from './authService.js';

const apiBaseUrl = import.meta.env.VITE_API_URL
	|| `${import.meta.env.VITE_URL || 'http://localhost:8000'}/api`;
const orderStorageKey = 'warung-order-id';
const authStorageKeys = ['warung-auth-key', 'warung-auth-data'];

function getErrorMessage(error, fallback) {
	return error.response?.data?.message
		|| Object.values(error.response?.data?.errors || {})[0]?.[0]
		|| fallback;
}

async function getAuthorizationHeaders() {
	let authData = null;

	for (const storageKey of authStorageKeys) {
		const storedAuth = localStorage.getItem(storageKey);
		if (storedAuth) {
			authData = await authService.decode(storedAuth);
			if (authData?.access_token) break;
		}
	}

	const token = authData?.access_token || '';

	return {
		Authorization: `Bearer ${token}`
	};
}

export const orderService = {
	async getOrderById(orderId) {
		try {
			const response = await axios.get(`${apiBaseUrl}/orders/${orderId}`, {
				headers: await getAuthorizationHeaders()
			});
			return response.data?.data || response.data;
		} catch (error) {
			throw new Error(getErrorMessage(error, 'Gagal mengambil detail pesanan.'));
		}
	},

	async getActiveOrder() {
		const orderId = localStorage.getItem(orderStorageKey);
		if (!orderId) return null;
		try {
			return await this.getOrderById(orderId);
		} catch (error) {
			return null;
		}
	},

	async getOrderHistory() {
		try {
			// Endpoint khusus: hanya pesanan milik pengguna yang sedang login.
			const response = await axios.get(`${apiBaseUrl}/my-orders`, {
				headers: await getAuthorizationHeaders()
			});
			const orders = response.data?.data?.data || [];

			return orders.map((order) => ({
				id: order.id,
				date: order.created_at,
				status: order.status,
				paymentStatus: order.payment_status,
				total: order.total_price,
				items: (order.items || []).map((item) => ({
					id: item.id,
					productId: item.product_id,
					name: item.product?.name || 'Produk',
					quantity: item.quantity,
					price: item.price,
					subTotal: item.sub_total
				}))
			}));
		} catch (error) {
			throw new Error(getErrorMessage(error, 'Gagal mengambil riwayat pesanan.'));
		}
	},

	async updateOrderStatus(orderId, payload) {
		try {
			const response = await axios.put(
				`${apiBaseUrl}/orders/${orderId}/status`,
				payload,
				{ headers: await getAuthorizationHeaders() }
			);
			return response.data;
		} catch (error) {
			throw new Error(getErrorMessage(error, 'Gagal memperbarui status pesanan.'));
		}
	},

	async createOrder(orderData) {
		try {
			console.log('[OrderService] createOrder started', orderData);
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
			console.log('[OrderService] createOrder response', {
				status: response.status,
				orderId: createdOrder?.id || createdOrder?.order_id,
				data: createdOrder
			});
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

	async getAllOrders(filters = {}) {
		try {
			const params = {};
			if (filters.paymentStatus && filters.paymentStatus !== 'all') params.payment_status = filters.paymentStatus;
			if (filters.orderStatus && filters.orderStatus !== 'all') params.status = filters.orderStatus;
			if (filters.date) params.date = filters.date;

			const response = await axios.get(`${apiBaseUrl}/orders`, {
				params,
				headers: await getAuthorizationHeaders()
			});
			return response.data?.data || response.data;
		} catch (error) {
			throw new Error(getErrorMessage(error, 'Gagal mengambil daftar pesanan.'));
		}
	},

	async uploadReceipt(file) {
		try {
			const orderId = localStorage.getItem(orderStorageKey);
			console.log('[OrderService] uploadReceipt started', {
				orderId,
				fileName: file?.name,
				fileType: file?.type,
				fileSize: file?.size
			});
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
			console.log('[OrderService] uploadReceipt response', {
				status: response.status,
				orderId,
				data: updatedOrder
			});
			localStorage.removeItem(orderStorageKey);
			return updatedOrder;
		} catch (error) {
			throw new Error(getErrorMessage(error, 'Gagal mengunggah bukti pembayaran.'));
		}
	}
};
