import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { cartStore } from '@/domain/cart/stores/cartStore';
import { useAuthStore } from '@/domain/auth/stores/authStore';
import { addItemToCart } from '@/domain/cart/services';

// Mocks de servicios
vi.mock('@/domain/cart/services/addItemToCart', () => ({
  addItemToCart: vi.fn(async () => ({ id: 'c1', userId: 'u1', items: [{ productId: 1, quantity: 2, price: 10, lineTotal: 20 }], total: 20, createdAt: '', updatedAt: '' })),
}));
vi.mock('@/domain/cart/services/updateCartItemQuantity', () => ({
  updateCartItemQuantity: vi.fn(async () => ({ id: 'c1', userId: 'u1', items: [{ productId: 1, quantity: 3, price: 10, lineTotal: 30 }], total: 30, createdAt: '', updatedAt: '' })),
}));
vi.mock('@/domain/cart/services/removeItemFromCart', () => ({
  removeItemFromCart: vi.fn(async () => ({ id: 'c1', userId: 'u1', items: [], total: 0, createdAt: '', updatedAt: '' })),
}));
vi.mock('@/domain/cart/services/getCart', () => ({
  getCart: vi.fn(async () => ({ id: 'c1', userId: 'u1', items: [], total: 0, createdAt: '', updatedAt: '' })),
}));
vi.mock('@/domain/cart/services/clearCart', () => ({
  clearCart: vi.fn(async () => null),
}));
vi.mock('@/domain/products/services', () => ({
  getProductById: vi.fn(async () => ({ id: 1, title: 'p', slug: 'p', price: 10, description: '', category: { id: 1, name: '', slug: '', image: '', createdAt: '', updatedAt: '' }, images: [], stock: 5, active: true, createdAt: '', updatedAt: '' })),
}));
vi.mock('vue-toastification', () => ({ useToast: () => ({ error: vi.fn(), success: vi.fn() }) }));

// Helper para crear store con auth mockeado
const setupStores = (isLogged: boolean) => {
  setActivePinia(createPinia());
  const auth = useAuthStore();
  auth.accessToken = isLogged ? 'token' : null;
  auth.user = isLogged ? { id: 'u1', email: 'a@b.c', roles: ['user'], createdAt: '', updatedAt: '' } : null;
  return cartStore();
};

describe('cartStore modes', () => {
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('guest adds item locally', async () => {
    const store = setupStores(false);
    await store.addToCart({ id: 1, title: 'p', slug: 'p', price: 10, description: '', category: { id: 1, name: '', slug: '', image: '', createdAt: '', updatedAt: '' }, images: [], stock: 5, active: true, createdAt: '', updatedAt: '' }, 2);
    expect(store.count).toBe(2);
    expect(store.totalPrice).toBe(20);
  });

  it('auth adds item via backend', async () => {
    const store = setupStores(true);
    await store.addToCart({ id: 1, title: 'p', slug: 'p', price: 10, description: '', category: { id: 1, name: '', slug: '', image: '', createdAt: '', updatedAt: '' }, images: [], stock: 5, active: true, createdAt: '', updatedAt: '' }, 2);
    expect(store.count).toBe(2);
    expect(store.totalPrice).toBe(20);
    expect(vi.mocked(addItemToCart)).toHaveBeenCalledWith(1, 2);
  });
});
