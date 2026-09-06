import { users } from '../data/user.js';
import axios from 'axios';

/**
 * Auth Service
 * Handles authentication requests (Login, Register, OTP verification).
 */

const apiBaseUrl = import.meta.env.VITE_API_URL
  || `${import.meta.env.VITE_URL || 'http://localhost:8000'}/api`;

export const authService = {

  async register(userData) {
    try {
      const response = await axios.post(`${apiBaseUrl}/auth/register`, {
        name: userData.name,
        phone_number: userData.phone_number
      });
      
      return response.data;
    } catch (error) {
      if (!error.response) {
        if (error.request) {
          throw new Error('Server tidak dapat dihubungi. Pastikan backend sedang berjalan.');
        }

        throw new Error('Permintaan registrasi gagal disiapkan. Silakan coba lagi.');
      }

      const { status, data } = error.response;
      console.log(error.response)
      const validationErrors = data?.errors || data?.data?.errors;
      const validationMessage = validationErrors
        ? Object.values(validationErrors).flat()[0]
        : null;

      switch (status) {
        case 400:
          throw new Error(data?.message || 'Data registrasi tidak valid.');
        case 409:
          throw new Error('Nomor HP tersebut sudah terdaftar.');
        case 422:
          throw new Error(validationMessage || data?.message || 'Data registrasi tidak valid.');
        case 500:
        case 502:
        case 503:
          throw new Error('Registrasi gagal diproses server. Silakan coba lagi.');
        default:
          throw new Error(data?.message || `Registrasi gagal (kode ${status}).`);
      }
    }
  },



  async login(phone, password) {
    // Simulated backend API call
    await new Promise(resolve => setTimeout(resolve, 600));
    if (!phone || !password) {
      throw new Error('Nomor HP dan kata sandi wajib diisi');
    }
    const cust = users.customer || { name: 'Budi Santoso', phone: '+82 10 2233 4455' };
    return {
      user: {
        id: cust.id || 'CUST-001',
        phone: phone || cust.phone,
        name: cust.name || 'Budi Santoso',
        email: cust.email || 'customer@example.com',
        role: 'Member'
      },
      token: 'member-jwt-' + Date.now()
    };
  },


  async sendOtp(phone) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { status: 'otp_sent', phone };
  },

  async verifyOtp(phone, code) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (code === '000000') {
      throw new Error('Kode OTP sudah kedaluwarsa. Silakan kirim ulang OTP.');
    }
    return { status: 'verified', phone };
  }
};
