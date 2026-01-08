import type { CartItem } from '@/domain/cart/types'
import type { LocationQueryRaw } from 'vue-router'

/**
 * Parámetros de entrada para construir la query del checkout.
 */
export interface BuildCheckoutQueryParams {
  productId?: number | null
  cartItems: CartItem[]
  returnTo?: string
}

/**
 * Tipo de retorno explícito para la query del checkout.
 * Extiende LocationQueryRaw para ser compatible con vue-router.
 */
export interface CheckoutQuery extends LocationQueryRaw {
  productId?: string
  returnTo?: string
}

// Convierte un valor a número válido o devuelve null
export function toNumberSafe(value: unknown): number | null {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

export function isProductInCartById(cartItems: CartItem[], id: number | null): boolean {
  if (id === null || id === undefined) return false
  return cartItems.some((it) => it?.product?.id === id)
}

/**
 * Construye el objeto query para la navegación al checkout.
 * Valida que el producto exista en el carrito antes de incluirlo.
 */
export function buildCheckoutQuery(params: BuildCheckoutQueryParams): CheckoutQuery {
  const { productId, cartItems, returnTo } = params
  const q: CheckoutQuery = {}

  if (productId != null && isProductInCartById(cartItems, productId)) {
    q.productId = String(productId)
  }

  if (returnTo) {
    q.returnTo = returnTo
  }

  return q
}

export default { toNumberSafe, isProductInCartById, buildCheckoutQuery }
