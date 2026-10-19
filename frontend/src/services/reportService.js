/**
 * Report Service
 * Handles sales report requests (daily, weekly, monthly, yearly).
 * Endpoint: GET /reports/sales/{period}
 */

import axios from 'axios';
import { authService } from './authService.js';
import { apiBaseUrl } from '../utils/config.js';

async function getAuthHeaders() {
  const authData = await authService.getStoredAuth();
  return {
    Authorization: `Bearer ${authData?.access_token || ''}`,
    Accept: 'application/json',
  };
}

export const reportService = {
  async getSalesReport(period = 'daily', params = {}) {
    try {
      const response = await axios.get(`${apiBaseUrl}/reports/sales/${period}`, {
        params,
        headers: await getAuthHeaders(),
      });
      return response.data?.data || null;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil laporan penjualan.');
    }
  },
};
