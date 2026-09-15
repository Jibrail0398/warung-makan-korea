/**
 * Users Service
 * Handles CRUD requests for staff/user accounts (Admin & Superadmin).
 * Endpoints: GET/POST /users, GET/PUT/DELETE /users/{user}
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

  // Laravel validation errors (422): ambil pesan pertama agar jelas ke pengguna.
  if (data?.errors && typeof data.errors === 'object') {
    const firstError = Object.values(data.errors).flat()[0];
    if (firstError) message = firstError;
  }

  const normalized = new Error(message);
  normalized.status = error.response?.status;
  return normalized;
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
};
