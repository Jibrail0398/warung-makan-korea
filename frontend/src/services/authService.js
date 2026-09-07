import axios from 'axios';

/**
 * Auth Service
 * Handles authentication requests (Login, Register, OTP verification).
 */

const apiBaseUrl = import.meta.env.VITE_API_URL
  || `${import.meta.env.VITE_URL || 'http://localhost:8000'}/api`;
const authStorageKey = 'warung-auth-data';
const encryptionSecret = import.meta.env.VITE_AUTH_STORAGE_KEY || 'warung-makan-korea-auth';

const toBase64 = (bytes) => {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const fromBase64 = (value) => {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

export const authService = {

  //Untuk encode localstorage
  async encode(data) {
    const secretBytes = new TextEncoder().encode(encryptionSecret);
    const secretHash = await crypto.subtle.digest('SHA-256', secretBytes);
    const key = await crypto.subtle.importKey(
      'raw',
      secretHash,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(JSON.stringify(data));
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encodedData
    );

    return `${toBase64(iv)}.${toBase64(new Uint8Array(encryptedData))}`;
  },

  //untuk decode localstorage
  async decode(encodedValue) {
    if (!encodedValue) return null;

    try {
      const [encodedIv, encodedData] = encodedValue.split('.');
      if (!encodedIv || !encodedData) return null;

      const secretBytes = new TextEncoder().encode(encryptionSecret);
      const secretHash = await crypto.subtle.digest('SHA-256', secretBytes);
      const key = await crypto.subtle.importKey(
        'raw',
        secretHash,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );
      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: fromBase64(encodedIv) },
        key,
        fromBase64(encodedData)
      );

      return JSON.parse(new TextDecoder().decode(decryptedData));
    } catch {
      return null;
    }
  },

  async getStoredAuth() {
    return this.decode(localStorage.getItem(authStorageKey));
  },


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
      const authData = response.data?.data;

      if (authData) {
        const encodedAuthData = await this.encode(authData);
        localStorage.setItem(authStorageKey, encodedAuthData);
      }

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
  

  // Integrasi API Login dan pengiriman OTP
  async login(userData) {
    try {
      const response = await axios.post(`${apiBaseUrl}/auth/login`, {
        phone_number: userData.phone_number,
        password: userData.password
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login gagal. Silakan coba lagi.';
      throw new Error(message);
    }
  },


  

  
};
