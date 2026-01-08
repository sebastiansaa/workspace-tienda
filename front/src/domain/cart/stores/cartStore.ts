import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGetCart, useAddItemToCart, useUpdateItemQuantity, useRemoveItem, useClearCart } from '../app/hooks'
import type { CartResponse, AddItemRequest, UpdateItemRequest } from '../types/BackendShapeCart'
import type { ProductResponse } from '@/domain/products/types'
import type { CartItem } from '../types'

// Gestiona el estado del carrito de compras de manera centralizada y reactiva

export const CartStore = defineStore('cart', () => {
  const cart = ref<CartResponse | null>(null)
  const isLoading = ref(false)

  const totalItems = computed(() => (cart.value ? cart.value.items.reduce((s, i) => s + i.quantity, 0) : 0))
  const totalPrice = computed(() => {
    if (!cart.value) return 0

    return typeof cart.value.total === 'number'
      ? cart.value.total
      : cart.value.items.reduce((s, i) => s + i.lineTotal, 0)
  })

  // Devuelve los items tal cual vienen del backend (tipado como CartItem)
  const cartItems = computed<CartItem[]>(() => (cart.value?.items ?? []).map(i => ({ ...i } as CartItem)))

  const extract = (res: any) => res?.data ?? res

  async function getCart() {
    isLoading.value = true
    try {
      const { data, refetch } = useGetCart()
      // usar cache si existe, sino forzar refetch
      if (data?.value != null) {
        cart.value = data.value ?? null
      } else {
        const res = await refetch()
        cart.value = res.data ?? data?.value ?? null
      }
    } finally {
      isLoading.value = false
    }
  }

  // Interno: ejecuta la mutación por productId y actualiza el state.
  async function _addItemById(productId: number, quantity = 1) {
    isLoading.value = true
    try {
      const dto: AddItemRequest = { productId, quantity }
      const { mutateAsync } = useAddItemToCart()
      const res = await mutateAsync(dto)
      cart.value = extract(res) ?? cart.value
      return extract(res) ?? cart.value    // <-- devolver resultado útil
    } finally {
      isLoading.value = false
    }
  }

  async function addToCart(product: ProductResponse, quantity = 1) {
    return await _addItemById(product.id, quantity)
  }

  async function updateQuantity(productId: number, quantity: number) {
    isLoading.value = true
    try {
      const { mutateAsync } = useUpdateItemQuantity()
      const res = await mutateAsync({ productId, quantity })
      cart.value = extract(res) ?? cart.value
    } finally {
      isLoading.value = false
    }
  }

  async function removeItem(productId: number) {
    isLoading.value = true
    try {
      const { mutateAsync } = useRemoveItem()
      const res = await mutateAsync(productId)
      cart.value = extract(res) ?? cart.value
    } finally {
      isLoading.value = false
    }
  }

  async function clearCart() {
    isLoading.value = true
    try {
      const { mutateAsync } = useClearCart()
      const res = await mutateAsync()
      cart.value = extract(res) ?? null
    } finally {
      isLoading.value = false
    }
  }

  return {
    cart,
    isLoading,
    totalItems,
    totalPrice,
    cartItems,
    getCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  }
})
