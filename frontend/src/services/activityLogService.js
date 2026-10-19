/**
 * Activity Log Service
 * Handles activity/audit log requests for Super Admin.
 * Endpoints: GET /activity-logs, GET /activity-logs/{id}
 */

import axios from 'axios';
import { authService } from './authService.js';
import { apiBaseUrl } from '../utils/config.js';
import { buildError } from './errors.js';

async function getAuthHeaders() {
  const authData = await authService.getStoredAuth();
  const token = authData?.access_token || '';
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };
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
