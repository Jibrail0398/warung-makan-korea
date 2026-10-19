/**
 * Users Service
 * Handles CRUD requests for staff/user accounts (Admin & Superadmin).
 * Endpoints: GET/POST /users, GET/PUT/DELETE /users/{user}
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


export const usersService = {
  async getUsers(page = 1) {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${apiBaseUrl}/users`, {
        params: { page },
        headers,
      });
      const payload = response.data?.data || {};

      return {
        users: payload.data || [],
        pagination: {
          currentPage: payload.meta?.current_page || page,
          lastPage: payload.meta?.last_page || 1,
          total: payload.meta?.total || 0,
          perPage: payload.meta?.per_page || 0,
        },
      };
    } catch (error) {
      throw buildError(error, 'Gagal mengambil daftar pengguna.');
    }
  },

  async getUser(id) {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${apiBaseUrl}/users/${id}`, { headers });
      return response.data;
    } catch (error) {
      throw buildError(error, 'Gagal mengambil detail pengguna.');
    }
  },

  async createUser(body) {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(`${apiBaseUrl}/users`, body, { headers });
      return response.data;
    } catch (error) {
      throw buildError(error, 'Gagal menambahkan pengguna.');
    }
  },

  async updateUser(id, body) {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.put(`${apiBaseUrl}/users/${id}`, body, { headers });
      return response.data;
    } catch (error) {
      throw buildError(error, 'Gagal memperbarui pengguna.');
    }
  },

  async deleteUser(id) {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.delete(`${apiBaseUrl}/users/${id}`, { headers });
      return response.data;
    } catch (error) {
      throw buildError(error, 'Gagal menghapus pengguna.');
    }
  },

  async changePassword(id, body) {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.put(`${apiBaseUrl}/users/${id}/password`, body, { headers });
      return response.data;
    } catch (error) {
      throw buildError(error, 'Gagal mengubah password pengguna.');
    }
  },
};
