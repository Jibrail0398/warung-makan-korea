import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import SuperAdminLayout from '../layouts/SuperAdminLayout.vue'

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
    component: () => import('../views/CartView.vue')
  },
  {
    path: '/checkout',
    alias: '/Checkout',
    name: 'checkout',
    component: () => import('../views/CheckoutView.vue')
  },
  {
    path: '/orders',
    alias: '/Orders',
    name: 'orders',
    component: () => import('../views/OrdersView.vue')
  },
  {
    path: '/orders/:id',
    name: 'order-tracking',
    component: () => import('../views/OrderHistoryDetailView.vue')
  },
  {
    path: '/profile',
    name: 'CustomerProfile',
    component: () => import('../views/CustomerProfile.vue')
  },
  {
    path: '/employeeprofile',
    name: 'EmployeeProfile',
    component: () => import('../views/EmployeeProfile.vue')
  },
  {
    path: '/order-history',
    name: 'OrderHistory',
    component: () => import('../views/OrderHistoryListView.vue')
  },
  {
    path: '/order-history/:id',
    name: 'OrderHistoryDetail',
    component: () => import('../views/OrderHistoryDetailView.vue')
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
router.beforeEach((to, from, next) => {
  const adminToken = localStorage.getItem('warung-admin-token')
  const superAdminToken = localStorage.getItem('warung-superadmin-token')

  // Super Admin route protection
  if (to.path.startsWith('/super-admin') && to.name !== 'superadmin-login') {
    if (!superAdminToken) {
      return next({ name: 'superadmin-login' })
    }
  }

  if (to.name === 'superadmin-login' && superAdminToken) {
    return next({ name: 'superadmin-dashboard' })
  }

  // Admin / Kasir route protection
  if (to.path.startsWith('/admin') && to.name !== 'admin-login') {
    if (!adminToken) {
      return next({ name: 'admin-login' })
    }
  }

  if (to.name === 'admin-login' && adminToken) {
    return next({ name: 'admin-dashboard' })
  }

  next()
})

export default router