/**
 * Bank Account Service
 * Handles CRUD requests for bank transfer accounts.
 * Endpoints: GET/POST /bank-accounts, GET/PUT/DELETE /bank-accounts/{bank_account}
 */

import axios from 'axios';
import { authService } from './authService.js';

const apiBaseUrl = import.meta.env.VITE_API_URL
  || `${import.meta.env.VITE_URL || 'http://localhost:8000'}/api`;

const REQUEST_TIMEOUT = 15000;

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

function mapAccount(account) {
  return {
    id: account.id,
    bankName: account.bank_name,
    accountNumber: account.account_number,
    accountName: account.account_name,
    isActive: Boolean(account.is_active),
    createdAt: account.created_at,
    updatedAt: account.updated_at,
  };
}

export const bankAccountService = {
  // withAuth: true dipakai halaman admin (fitur hanya untuk role admin).
  // Checkout/guest memakai mode publik (tanpa header auth).
  async getBankAccounts({ onlyActive = false, withAuth = false } = {}) {
    try {
      const config = {
        params: onlyActive ? { active: 'true' } : {},
        timeout: REQUEST_TIMEOUT,
        ...(withAuth ? { headers: await getAuthHeaders() } : {}),
      };
      const response = await axios.get(`${apiBaseUrl}/bank-accounts`, config);
      const items = response.data?.data || [];
      return items.map(mapAccount);
    } catch (error) {
      throw buildError(error, 'Gagal mengambil daftar rekening bank.');
    }
  },

  async getBankAccount(id) {
    try {
      const response = await axios.get(`${apiBaseUrl}/bank-accounts/${id}`, { timeout: REQUEST_TIMEOUT });
      return mapAccount(response.data?.data || {});
    } catch (error) {
      throw buildError(error, 'Gagal mengambil detail rekening bank.');
    }
  },

  async createBankAccount(body) {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(`${apiBaseUrl}/bank-accounts`, body, { headers, timeout: REQUEST_TIMEOUT });
      return response.data;
    } catch (error) {
      throw buildError(error, 'Gagal menambahkan rekening bank.');
    }
  },

  async updateBankAccount(id, body) {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.put(`${apiBaseUrl}/bank-accounts/${id}`, body, { headers, timeout: REQUEST_TIMEOUT });
      return response.data;
    } catch (error) {
      throw buildError(error, 'Gagal memperbarui rekening bank.');
    }
  },

  async deleteBankAccount(id) {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.delete(`${apiBaseUrl}/bank-accounts/${id}`, { headers, timeout: REQUEST_TIMEOUT });
      return response.data;
    } catch (error) {
      throw buildError(error, 'Gagal menghapus rekening bank.');
    }
  },
};
