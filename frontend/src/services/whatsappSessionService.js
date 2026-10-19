import axios from 'axios';
import { authService } from './authService.js';
import { apiBaseUrl } from '../utils/config.js';

const getAuthConfig = async () => {
  const authData = await authService.getStoredAuth();

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

  async destroy() {
    const response = await axios.delete(`${apiBaseUrl}/whatsapp/session`, await getAuthConfig());
    return unwrapResponse(response);
  },
};
