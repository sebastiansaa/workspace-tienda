import type { cartStore } from '@/domain/cart/stores/cartStore'

type CartStore = ReturnType<typeof cartStore>

/* * MODIFICADO: Solo guarda la ÚLTIMA orden para mostrar en la página de éxito. */
export function persistOrder(orderId: string, items: any[], total: number) {
  // Asegurarnos de trabajar con un snapshot/clon profundo de los items
  let itemsSnapshot: any[]
  try {
    itemsSnapshot = typeof structuredClone === 'function' ? structuredClone(items) : JSON.parse(JSON.stringify(items))
  } catch (e) {
    itemsSnapshot = JSON.parse(JSON.stringify(items))
  }

  const order = {
    id: orderId,
    date: new Date().toISOString(),
    status: 'completed',
    items: itemsSnapshot.map((item: any) => ({
      id: item.product?.id ?? item.productId,
      title: item.product?.title ?? 'Producto',
      image: item.product?.image ?? item.product?.images?.[0] ?? '',
      quantity: item.quantity,
      price: item.price ?? item.product?.price ?? 0,
    })),
    total,
  }

  // Loguear lo que vamos a persistir para facilitar debugging
  try {
    console.info('[persistence] persistOrder - saving last order', { orderId, total })
  } catch (e) { /* noop */ }

  // OPCIÓN B: Sobrescribir siempre con un array de 1 solo elemento.
  // Esto permite que la vista de órdenes funcione (espera un array) pero sin historial antiguo.
  const orders = [order]
  localStorage.setItem('orders', JSON.stringify(orders))
}

/** Limpia el carrito local usando la API del store proporcionado.
 * Acepta tanto un store con `clearCart()` como un store con `removeFromCart()`.
 */
export function clearLocalCart(cart: CartStore) {
  if (!cart) return
  if (typeof (cart as any).clearCart === 'function') {
    ; (cart as any).clearCart()
    return
  }

  const items = (cart as any).cartItems || []
  items.forEach((it: any) => {
    if (it?.product?.id) (cart as any).removeFromCart(it.product.id)
  })
}

export default {
  persistOrder,
  clearLocalCart,
}
