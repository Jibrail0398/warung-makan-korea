import { users } from '../data/user.js';

/**
 * Auth Service
 * Handles authentication requests (Login, Register, OTP verification).
 */
export const authService = {
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

  async register(userData) {
    // Simulated backend API call
    await new Promise(resolve => setTimeout(resolve, 800));
    if (!userData.phone || !userData.name || !userData.password) {
      throw new Error('Data pendaftaran tidak lengkap');
    }
    return {
      status: 'success',
      phone: userData.phone
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
