/**
 * User Data (Mock / Initial Data)
 * Roles: admin, superadmin, customer
 */

export const users = {
  admin: {
    id: 'ADM-001',
    name: 'Kelvin Winata',
    username: 'admin_kelvin',
    email: 'admin@warungnusantara.kr',
    role: 'Admin',
    phone: '+82 10 1234 5678',
    status: 'Active',
    avatar: 'K',
    lastLogin: '2026-08-27 18:30',
    createdAt: '2026-01-15'
  },
  kasir: {
    id: 'ADM-002',
    name: 'Dina Permata',
    username: 'kasir_dina',
    email: 'kasir1@warungnusantara.kr',
    role: 'Kasir',
    phone: '+82 10 9876 5432',
    status: 'Active',
    avatar: 'D',
    lastLogin: '2026-08-27 12:15',
    createdAt: '2026-03-01'
  },
  superadmin: {
    id: 'SUPER-001',
    name: 'Root Developer',
    username: 'superadmin',
    email: 'dev@warungnusantara.internal',
    role: 'Super Admin',
    phone: '+82 10 9999 0000',
    status: 'Active',
    avatar: 'SA',
    lastLogin: '2026-08-27 20:00',
    createdAt: '2025-12-01'
  },
  customer: {
    id: 'CUST-001',
    name: 'Budi Santoso',
    phone: '+82 10 2233 4455',
    email: 'budi.santoso@example.com',
    role: 'Member',
    avatar: 'B',
    address: 'Mapo-gu, Seoul, South Korea',
    createdAt: '2026-02-10'
  }
};

export const adminUser = users.admin;
export const kasirUser = users.kasir;
export const superAdminUser = users.superadmin;
export const customerUser = users.customer;

export default users;
