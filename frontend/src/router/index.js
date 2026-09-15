import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '../views/public/HomeView/HomeView.vue'
import AdminLayout from '../views/admin/AdminLayout/AdminLayout.vue'
import { authService } from '../services/authService.js'

const routes = [
  // ==========================================
  // CUSTOMER / GUEST & MEMBER ROUTES
  // ==========================================
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/public/LoginView/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/public/RegisterView/RegisterView.vue')
  },
  {
    path: '/verify-otp',
    name: 'verify-otp',
    component: () => import('../views/public/VerifyOtpView/VerifyOtpView.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/public/CartView/CartView.vue')
  },
  {
    path: '/checkout',
    alias: '/Checkout',
    name: 'checkout',
    component: () => import('../views/public/CheckoutView/CheckoutView.vue')
  },

  {
    path: '/orders',
    alias: '/Orders',
    name: 'orders',
    component: () => import('../views/public/OrdersView/OrdersView.vue'),
    meta: { requiredRole: 'member' }
  },
    
  {
    path: '/orders/:id',
    name: 'order-tracking',
    component: () => import('../views/public/OrderHistoryDetailView/OrderHistoryDetailView.vue')
  },
  {
    path: '/profile',
    name: 'CustomerProfile',
    component: () => import('../views/public/CustomerProfile/CustomerProfile.vue'),
    meta: { requiredRole: 'member' }
  },
  {
    path: '/employeeprofile',
    name: 'EmployeeProfile',
    component: () => import('../views/public/EmployeeProfile/EmployeeProfile.vue'),
    meta: { requiredRole: 'member' }
  },
  {
    path: '/order-history',
    name: 'OrderHistory',
    component: () => import('../views/public/OrderHistoryListView/OrderHistoryListView.vue'),
    meta: { requiredRole: 'member' }
  },
  {
    path: '/order-history/:id',
    name: 'OrderHistoryDetail',
    component: () => import('../views/public/OrderHistoryDetailView/OrderHistoryDetailView.vue'),
    meta: { requiredRole: 'member' }
  },
  // ==========================================
  // SINGLE LOGIN REDIRECTS (LEGACY PATHS)
  // ==========================================
  {
    path: '/admin/login',
    redirect: '/login'
  },
  {
    path: '/whatsapp-sessions',
    redirect: '/admin/whatsapp-sessions'
  },
  /*
  {
    path: '/super-admin/login',
    redirect: '/login'
  },
  */

  // ==========================================
  // ADMIN / KASIR ROUTES
  // ==========================================
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiredRole: ['admin', 'superadmin'] },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('../views/admin/AdminDashboardView/AdminDashboardView.vue')
      },
      {
        path: 'pos',
        name: 'admin-pos',
        component: () => import('../views/admin/AdminPosView/AdminPosView.vue')
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: () => import('../views/admin/AdminOrdersView/AdminOrdersView.vue')
      },
      {
        path: 'orders/:id',
        name: 'admin-order-detail',
        component: () => import('../views/admin/AdminOrderDetailView/AdminOrderDetailView.vue')
      },
      {
        path: 'products',
        name: 'admin-products',
        component: () => import('../views/admin/AdminProductsView/AdminProductsView.vue')
      },
      {
        path: 'main-categories',
        name: 'admin-main-categories',
        component: () => import('../views/admin/AdminMainCategoriesView/AdminMainCategoriesView.vue')
      },
      {
        path: 'categories',
        alias: 'subcategories',
        name: 'admin-categories',
        component: () => import('../views/admin/AdminCategoriesView/AdminCategoriesView.vue')
      },
      {
        path: 'reports',
        redirect: '/admin/reports/transactions'
      },
      {
        path: 'reports/transactions',
        name: 'admin-reports-transactions',
        component: () => import('../views/admin/AdminTransactionReportView/AdminTransactionReportView.vue')
      },
      {
        path: 'reports/financial',
        name: 'admin-reports-financial',
        component: () => import('../views/admin/AdminFinancialReportView/AdminFinancialReportView.vue')
      },
      {
        path: 'reset-password',
        name: 'admin-reset-password',
        component: () => import('../views/admin/AdminResetPasswordView/AdminResetPasswordView.vue')
      },
      {
        path: 'whatsapp-sessions',
        name: 'admin-whatsapp-sessions',
        component: () => import('../views/superadmin/SuperAdminWhatsAppSessionView/SuperAdminWhatsAppSessionView.vue'),
        meta: { requiredRole: 'superadmin' }
      }
    ]
  },

  // ==========================================
  // SUPER ADMIN ROUTES
  // ==========================================
  // {
  //   path: '/super-admin',
  //   component: AdminLayout,
  //   meta: { requiredRole: 'superadmin' },
  //   children: [
  //     {
  //       path: '',
  //       redirect: '/admin/whatsapp-sessions'
  //     }
  //   ]
  // },

  // ==========================================
  // LEGACY SUPER ADMIN ROUTES (DISABLED)
  // ==========================================
  /*
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
        component: () => import('../views/superadmin/SuperAdminDashboardView/SuperAdminDashboardView.vue')
      },
      {
        path: 'audit-logs',
        name: 'superadmin-audit-logs',
        component: () => import('../views/superadmin/SuperAdminAuditLogView/SuperAdminAuditLogView.vue')
      },
      {
        path: 'admins',
        name: 'superadmin-management',
        component: () => import('../views/superadmin/SuperAdminManagementView/SuperAdminManagementView.vue')
      }
    ]
  },
  */

  // Fallback Catch All
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 80
      };
    }

    return { top: 0 };
  }
});

// ==========================================
// ROLE-BASED NAVIGATION GUARDS
// ==========================================
router.beforeEach(async (to) => {
  const requiredRole = to.meta.requiredRole
  const authData = await authService.decode(localStorage.getItem('warung-auth-data'))
  const currentRole = authData?.user?.role?.toLowerCase()
  const adminRoles = ['admin', 'superadmin']

  if (adminRoles.includes(currentRole) && ['home', 'login'].includes(to.name)) {
    return { path: '/admin/dashboard' }
  }

  // Login, register, and OTP routes intentionally have no requiredRole.
  if (!requiredRole) return true

  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
  const normalizedAllowedRoles = allowedRoles.map((role) => role.toLowerCase())

  if (normalizedAllowedRoles.includes(currentRole)) {
    return true
  }

  return { path: '/login' }
})

export default router;