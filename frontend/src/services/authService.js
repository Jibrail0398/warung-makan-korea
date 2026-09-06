import { users } from '../data/user.js';
import axios from 'axios';

/**
 * Auth Service
 * Handles authentication requests (Login, Register, OTP verification).
 */

const apiBaseUrl = import.meta.env.VITE_API_URL
  || `${import.meta.env.VITE_URL || 'http://localhost:8000'}/api`;

export const authService = {


  //Integrasi API Registrasi Akun
  async register(userData) {
    try {
      const response = await axios.post(`${apiBaseUrl}/auth/register`, {
        name: userData.name,
        phone_number: userData.phone_number,
        password: userData.password
      });
      
      return response.data;
    } catch (error) {
      const message = error.response.data.message;
      throw new Error(message);
    }
  },

  //Integrasi API Verifikasi OTP
  async verifyOtp(phone, code) {
    try{

      const data = {
        "phone_number":phone,
        "code":code
      }

      const response = await axios.post(`${apiBaseUrl}/auth/otp/verify`,data);
      return response.data;
      
    }catch(error){
      const message = error.response.data.message;
      throw new Error(message);
    }
  },

  //Integrasi API SendOTP
  async sendOtp(phone) {
    try{
      const data = {
        phone_number:phone
      }
      const response = await axios.post(`${apiBaseUrl}/auth/otp/send`,data);
      return response.data;
    }catch(error){
      const message = error.response.data.message;
      throw new Error(message);
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


  

  
};
