import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import SuperAdminLayout from '../layouts/SuperAdminLayout.vue'
import { authService } from '../services/authService.js'

const routes = [
  // ==========================================
  // CUSTOMER / GUEST & MEMBER ROUTES (UNMODIFIED)
  // ==========================================
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/menu',
    alias: ['/products', '/all-menu'],
    name: 'menu',
    component: () => import('../views/MenuView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/verify-otp',
    name: 'verify-otp',
    component: () => import('../views/VerifyOtpView.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/CartView.vue'),
    meta: { requiredRole: 'member' }
  },
  {
    path: '/checkout',
    alias: '/Checkout',
    name: 'checkout',
    component: () => import('../views/CheckoutView.vue'),
    meta: { requiredRole: 'member' }
  },
  {
    path: '/orders',
    alias: '/Orders',
    name: 'orders',
    component: () => import('../views/OrdersView.vue'),
    meta: { requiredRole: 'member' }
  },
  {
    path: '/orders/:id',
    name: 'order-tracking',
    component: () => import('../views/OrderHistoryDetailView.vue'),
    meta: { requiredRole: 'member' }
  },
  {
    path: '/profile',
    name: 'CustomerProfile',
    component: () => import('../views/CustomerProfile.vue'),
    meta: { requiredRole: 'member' }
  },
  {
    path: '/employeeprofile',
    name: 'EmployeeProfile',
    component: () => import('../views/EmployeeProfile.vue'),
    meta: { requiredRole: 'member' }
  },
  {
    path: '/order-history',
    name: 'OrderHistory',
    component: () => import('../views/OrderHistoryListView.vue'),
    meta: { requiredRole: 'member' }
  },
  {
    path: '/order-history/:id',
    name: 'OrderHistoryDetail',
    component: () => import('../views/OrderHistoryDetailView.vue'),
    meta: { requiredRole: 'member' }
  },

  // ==========================================
  // ADMIN / KASIR ROUTES
  // ==========================================
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('../views/admin/AdminLoginView.vue')
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiredRole: 'admin' },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('../views/admin/AdminDashboardView.vue')
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: () => import('../views/admin/AdminOrdersView.vue')
      },
      {
        path: 'orders/:id',
        name: 'admin-order-detail',
        component: () => import('../views/admin/AdminOrderDetailView.vue')
      },
      {
        path: 'products',
        name: 'admin-products',
        component: () => import('../views/admin/AdminProductsView.vue')
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: () => import('../views/admin/AdminCategoriesView.vue')
      },
      {
        path: 'reports',
        redirect: '/admin/reports/transactions'
      },
      {
        path: 'reports/transactions',
        name: 'admin-reports-transactions',
        component: () => import('../views/admin/AdminTransactionReportView.vue')
      },
      {
        path: 'reports/financial',
        name: 'admin-reports-financial',
        component: () => import('../views/admin/AdminFinancialReportView.vue')
      },
      {
        path: 'reset-password',
        name: 'admin-reset-password',
        component: () => import('../views/admin/AdminResetPasswordView.vue')
      }
    ]
  },

  // ==========================================
  // SUPER ADMIN (INTERNAL DEVELOPER) ROUTES
  // ==========================================
  {
    path: '/super-admin/login',
    name: 'superadmin-login',
    component: () => import('../views/superadmin/SuperAdminLoginView.vue')
  },
  {
    path: '/super-admin',
    component: SuperAdminLayout,
    meta: { requiredRole: 'superadmin' },
    children: [
      {
        path: '',
        redirect: '/super-admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'superadmin-dashboard',
        component: () => import('../views/superadmin/SuperAdminDashboardView.vue')
      },
      {
        path: 'audit-logs',
        name: 'superadmin-audit-logs',
        component: () => import('../views/superadmin/SuperAdminAuditLogView.vue')
      },
      {
        path: 'admins',
        name: 'superadmin-management',
        component: () => import('../views/superadmin/SuperAdminManagementView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// ==========================================
// ROLE-BASED NAVIGATION GUARDS
// ==========================================
router.beforeEach(async (to) => {
  const requiredRole = to.meta.requiredRole

  // Login, register, and OTP routes intentionally have no requiredRole.
  if (!requiredRole) return true

  const authData = await authService.decode(localStorage.getItem('warung-auth-data'))
  const currentRole = authData?.user?.role

  if (currentRole === requiredRole) return true

  if (requiredRole === 'superadmin') {
    return { name: 'superadmin-login' }
  }

  if (requiredRole === 'admin') {
    return { name: 'admin-login' }
  }

  return { name: 'login' }
})

export default router