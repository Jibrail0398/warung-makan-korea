/**
 * Activity Log Service
 * Handles activity/audit log requests for Super Admin.
 * Endpoints: GET /activity-logs, GET /activity-logs/{id}
 */

import axios from 'axios';
import { authService } from './authService.js';

const apiBaseUrl = import.meta.env.VITE_API_URL
  || `${import.meta.env.VITE_URL || 'http://localhost:8000'}/api`;

async function getAuthHeaders() {
  const authData = await authService.getStoredAuth();
  const token = authData?.access_token || '';
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };
}

function buildError(error, fallback) {
  const data = error.response?.data;
  let message = data?.message || fallback;

  if (data?.errors && typeof data.errors === 'object') {
    const firstError = Object.values(data.errors).flat()[0];
    if (firstError) message = firstError;
  }

  const normalized = new Error(message);
  normalized.status = error.response?.status;
  return normalized;
}

export const activityLogService = {
  async getActivityLogs(params = {}) {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${apiBaseUrl}/activity-logs`, {
        params,
        headers,
      });
      const payload = response.data?.data || {};

      return {
        logs: payload.data || [],
        pagination: {
          currentPage: payload.meta?.current_page || params.page || 1,
          lastPage: payload.meta?.last_page || 1,
          total: payload.meta?.total || 0,
          perPage: payload.meta?.per_page || 0,
        },
      };
    } catch (error) {
      throw buildError(error, 'Gagal mengambil daftar log aktivitas.');
    }
  },

  async getActivityLog(id) {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${apiBaseUrl}/activity-logs/${id}`, { headers });
      return response.data?.data || null;
    } catch (error) {
      throw buildError(error, 'Gagal mengambil detail log aktivitas.');
    }
  },
};
