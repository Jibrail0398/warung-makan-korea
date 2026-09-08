import axios from 'axios';
import { authService } from './authService.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    || `${import.meta.env.VITE_URL || 'http://localhost:8000'}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(async (config) => {
  try {
    const rawAuth = localStorage.getItem('warung-auth-data');
    if (rawAuth) {
      const authData = await authService.decode(rawAuth);
      const token = authData?.access_token || localStorage.getItem('warung-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      const token = localStorage.getItem('warung-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // If decryption fails, continue without throwing
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
