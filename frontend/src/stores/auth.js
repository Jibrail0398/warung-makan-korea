import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { adminService } from '../services/adminService.js';
import { users } from '../data/user.js';

export const useAuthStore = defineStore('auth', () => {
  // Read initial user and token from localStorage
  const user = ref(JSON.parse(localStorage.getItem('warung-user') || 'null'));
  const token = ref(localStorage.getItem('warung-token') || '');

  // Role resolution
  const role = computed(() => {
    if (!token.value || !user.value) return 'Guest';
    return user.value.role || 'Customer';
  });

  const isAuthenticated = computed(() => !!token.value && role.value !== 'Guest');
  const isGuest = computed(() => !isAuthenticated.value);
  const isCustomer = computed(() => isAuthenticated.value && (role.value === 'Customer' || role.value === 'Member'));
  const isAdmin = computed(() => isAuthenticated.value && role.value === 'Admin');
  const isKasir = computed(() => isAuthenticated.value && role.value === 'Kasir');
  const isAdminOrKasir = computed(() => isAuthenticated.value && (role.value === 'Admin' || role.value === 'Kasir'));
  const isSuperAdmin = computed(() => isAuthenticated.value && role.value === 'Super Admin');

  // Unified login handler supporting phone (Korea) & username/email
  async function login(identifier, password) {
    await new Promise(r => setTimeout(r, 450));

    if (!identifier || !password) {
      throw new Error('Nomor HP / Username dan kata sandi wajib diisi');
    }

    if (password.length < 4) {
      throw new Error('Kata sandi minimal 4 karakter');
    }

    const cleanInput = String(identifier).trim();
    const cleanDigits = cleanInput.replace(/\D/g, '');
    const cleanLower = cleanInput.toLowerCase();

    let matchedUser = null;
    let userRole = 'Customer';

    // 1. Check Super Admin
    if (
      cleanLower === 'superadmin' ||
      cleanLower === 'dev@warungnusantara.internal' ||
      cleanDigits === '821099990000' ||
      cleanDigits === '01099990000' ||
      cleanInput === '+82 10 9999 0000'
    ) {
      userRole = 'Super Admin';
      matchedUser = {
        id: users.superadmin?.id || 'SUPER-001',
        name: users.superadmin?.name || 'Root Developer',
        username: 'superadmin',
        email: users.superadmin?.email || 'dev@warungnusantara.internal',
        phone: users.superadmin?.phone || '+82 10 9999 0000',
        role: 'Super Admin',
        avatar: 'SA'
      };
    }
    // 2. Check Admin Kelvin
    else if (
      cleanLower === 'admin_kelvin' ||
      cleanLower === 'admin' ||
      cleanLower === 'admin@warungnusantara.kr' ||
      cleanDigits === '821012345678' ||
      cleanDigits === '01012345678' ||
      cleanInput === '+82 10 1234 5678'
    ) {
      userRole = 'Admin';
      matchedUser = {
        id: users.admin?.id || 'ADM-001',
        name: users.admin?.name || 'Kelvin Winata',
        username: 'admin_kelvin',
        email: users.admin?.email || 'admin@warungnusantara.kr',
        phone: users.admin?.phone || '+82 10 1234 5678',
        role: 'Admin',
        avatar: 'K'
      };
    }
    // 3. Check Kasir Dina
    else if (
      cleanLower === 'kasir_dina' ||
      cleanLower === 'kasir' ||
      cleanLower === 'kasir1@warungnusantara.kr' ||
      cleanDigits === '821098765432' ||
      cleanDigits === '01098765432' ||
      cleanInput === '+82 10 9876 5432'
    ) {
      userRole = 'Kasir';
      matchedUser = {
        id: users.kasir?.id || 'ADM-002',
        name: users.kasir?.name || 'Dina Permata',
        username: 'kasir_dina',
        email: users.kasir?.email || 'kasir1@warungnusantara.kr',
        phone: users.kasir?.phone || '+82 10 9876 5432',
        role: 'Kasir',
        avatar: 'D'
      };
    }
    // 4. Check dynamic admins in storage
    else {
      try {
        const storedAdmins = await adminService.getAdmins();
        const found = storedAdmins.find(
          a =>
            a.username?.toLowerCase() === cleanLower ||
            a.email?.toLowerCase() === cleanLower ||
            a.phone?.replace(/\D/g, '') === cleanDigits
        );

        if (found) {
          if (found.status === 'Inactive') {
            throw new Error('Akun ini sedang dinonaktifkan oleh Administrator.');
          }
          userRole = found.role || 'Kasir';
          matchedUser = {
            id: found.id,
            name: found.name,
            username: found.username,
            email: found.email,
            phone: found.phone || '+82 10 0000 0000',
            role: userRole,
            avatar: (found.name || 'A').charAt(0).toUpperCase()
          };
        }
      } catch (err) {
        if (err.message && err.message.includes('dinonaktifkan')) throw err;
      }
    }

    // 5. Default fallback to Customer
    if (!matchedUser) {
      userRole = 'Customer';
      const cust = users.customer || {};
      const formattedPhone = cleanDigits.length >= 8 
        ? (cleanInput.startsWith('+') ? cleanInput : `+82 10 ${cleanDigits.slice(-8, -4)} ${cleanDigits.slice(-4)}`)
        : (cleanInput || '+82 10 2233 4455');

      matchedUser = {
        id: cust.id || `CUST-${Math.floor(100 + Math.random() * 900)}`,
        name: cust.name || 'Budi Santoso',
        phone: formattedPhone,
        email: cleanLower.includes('@') ? cleanLower : (cust.email || 'customer@warungnusantara.kr'),
        role: 'Customer',
        avatar: (cust.name || 'B').charAt(0).toUpperCase(),
        address: cust.address || 'Mapo-gu, Seoul, South Korea'
      };
    }

    // Generate token
    const generatedToken = `${userRole.toLowerCase().replace(/\s+/g, '-')}-jwt-${Date.now()}`;
    user.value = matchedUser;
    token.value = generatedToken;

    // Save to localStorage
    localStorage.setItem('warung-user', JSON.stringify(matchedUser));
    localStorage.setItem('warung-token', generatedToken);
    localStorage.setItem('warung-role', userRole);

    // Sync legacy keys for backward compatibility
    if (userRole === 'Super Admin') {
      localStorage.setItem('warung-superadmin-user', JSON.stringify(matchedUser));
      localStorage.setItem('warung-superadmin-token', generatedToken);
      adminService.logActivity('Super Admin', 'LOGIN', 'Super Admin Console');
    } else if (userRole === 'Admin' || userRole === 'Kasir') {
      localStorage.setItem('warung-admin-user', JSON.stringify(matchedUser));
      localStorage.setItem('warung-admin-token', generatedToken);
      adminService.logActivity(`${matchedUser.name} (${userRole})`, 'LOGIN', 'Admin Portal');
    } else {
      localStorage.setItem('token', generatedToken);
    }

    return {
      user: matchedUser,
      token: generatedToken,
      role: userRole
    };
  }

  function logout() {
    if (user.value && (user.value.role === 'Admin' || user.value.role === 'Kasir' || user.value.role === 'Super Admin')) {
      try {
        adminService.logActivity(`${user.value.name} (${user.value.role})`, 'LOGOUT', 'Portal System');
      } catch (e) {
        console.warn(e);
      }
    }

    user.value = null;
    token.value = '';

    // Clear all storage keys
    localStorage.removeItem('warung-user');
    localStorage.removeItem('warung-token');
    localStorage.removeItem('warung-role');
    localStorage.removeItem('warung-admin-user');
    localStorage.removeItem('warung-admin-token');
    localStorage.removeItem('warung-superadmin-user');
    localStorage.removeItem('warung-superadmin-token');
    localStorage.removeItem('token');
  }

  return {
    user,
    token,
    role,
    isAuthenticated,
    isGuest,
    isCustomer,
    isAdmin,
    isKasir,
    isAdminOrKasir,
    isSuperAdmin,
    login,
    logout
  };
});

