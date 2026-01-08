import { cartStore } from '@/domain/cart/stores/cartStore'
import type { CartItem } from '@/domain/cart/types'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toNumberSafe, buildCheckoutQuery, type CheckoutQuery } from '@/shared/helpers/navigation'
import { logger } from '@/shared/services/logger'

/**
 * Composable que gestiona la navegación hacia el flujo de pago.
 * Sincroniza el `productId` desde la ruta o desde un valor inicial,
 * y verifica si el carrito contiene productos antes de permitir continuar.
 */
export const usePaymentNavigation = (initialProductId?: number) => {
  const router = useRouter()
  const route = useRoute()
  const store = cartStore()

  const items = computed<CartItem[]>(() => store.cartItems)

  // Estado interno (privado)
  const _productId = ref<number | null>(initialProductId ?? toNumberSafe(route.query.productId))

  // Sincroniza `productId` si cambia el query param en la ruta (conversión segura a número)
  watch(
    () => route.query.productId,
    (v) => {
      _productId.value = toNumberSafe(v)
    }
  )

  const canBeginPayment = computed(() => items.value.length > 0)

  // API Pública (Readonly)
  const productId = computed(() => _productId.value)
  const productIdString = computed(() => (_productId.value !== null && _productId.value !== undefined ? String(_productId.value) : ''))

  /**
   * Actualiza manualmente el ID del producto seleccionado.
   * Si el valor proporcionado no es un número válido, se establece como null.
   * @param id - ID del producto a establecer, puede ser number, null o undefined
   */
  const setProductId = (id?: number | null) => {
    logger.debug(`[usePaymentNavigation] setProductId: ${id}`)
    _productId.value = typeof id === 'number' ? id : null
  }

  /**
   * Resetea el ID del producto seleccionado a null.
   */
  const resetProductId = () => {
    logger.debug('[usePaymentNavigation] resetProductId')
    _productId.value = null
  }

  /**
   * Navega al checkout si hay productos en el carrito.
   * Incluye `productId` en la query solo si corresponde a un ítem válido.
   * Permite opcionalmente definir una ruta de retorno (`returnTo`).
   * @param opts - Opciones de navegación
   * @param opts.returnTo - Ruta opcional a la que volver después del checkout
   */
  const goToCheckout = (opts?: { returnTo?: string }) => {
    if (!canBeginPayment.value) {
      logger.warn('[usePaymentNavigation] goToCheckout blocked: cart is empty')
      return
    }

    // Validación de negocio: Verificar si el producto seleccionado sigue en el carrito
    if (_productId.value !== null) {
      const exists = store.cartItems.some((item) => item.product?.id === _productId.value)
      if (!exists) {
        logger.warn(
          `[usePaymentNavigation] productId ${_productId.value} not found in cart. Resetting.`,
        )
        _productId.value = null
      }
    }

    logger.debug('[usePaymentNavigation] goToCheckout initiated')
    const query: CheckoutQuery = buildCheckoutQuery({
      productId: _productId.value,
      cartItems: store.cartItems,
      returnTo: opts?.returnTo,
    })
    router.push({ path: '/checkout', query })
  }

  return {
    items, // Productos actuales en el carrito (reactivo)
    productId, // ID del producto seleccionado (readonly computed)
    productIdString, // Versión string del ID, útil para props o queries
    setProductId, // Actualiza manualmente el ID del producto seleccionado
    resetProductId, // Resetea el ID del producto seleccionado
    canBeginPayment, // Booleano reactivo: true si el carrito tiene productos
    goToCheckout, // Navega a /checkout con parámetros opcionales (productId, returnTo)
  }
}




