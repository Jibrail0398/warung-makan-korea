import axios from 'axios';
import { authService } from './authService.js';

const apiBaseUrl = import.meta.env.VITE_API_URL
  || `${import.meta.env.VITE_URL || 'http://localhost:8000'}/api`;

const getAuthConfig = async () => {
  const authData = await authService.decode(localStorage.getItem('warung-auth-data'));

  return {
    headers: {
      Authorization: `Bearer ${authData?.access_token || ''}`,
      Accept: 'application/json',
    },
  };
};

const unwrapResponse = (response) => response.data?.data || response.data;

export const whatsappSessionService = {
  async get() {
    const response = await axios.get(`${apiBaseUrl}/whatsapp/session`, await getAuthConfig());
    return unwrapResponse(response);
  },

  async start() {
    const response = await axios.post(`${apiBaseUrl}/whatsapp/session/start`, {}, await getAuthConfig());
    return unwrapResponse(response);
  },
};
