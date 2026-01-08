import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import { authGuard } from '@/domain/auth/guards/authGuard'
import { adminGuard } from '@/domain/admin/guards/adminGuard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../domain/auth/views/AuthView.vue'),
    },
    {
      path: '/products/:categoryId',
      name: 'productsByCategory',
      component: () => import('../domain/products/views/ProductsView.vue'),
    },
    {
      path: '/products/:categoryId/:id',
      name: 'productDetail',
      component: () => import('../domain/products/views/ProductDetailView.vue'),
      props: true
    },
    {
      path: '/payment',
      name: 'payment',
      component: () => import('../domain/cart-summary/views/PaymentView.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../domain/checkout/views/CheckoutView.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../domain/orders/views/OrdersListView.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/domain/account/views/AccountLayout.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/admin',
      component: () => import('@/domain/admin/views/AdminLayout.vue'),
      beforeEnter: adminGuard,
      children: [
        {
          path: '',
          name: 'admin',
          component: () => import('@/domain/admin/views/AdminDashboardView.vue'),
        },
      ],
    },

  ],
})

export default router
