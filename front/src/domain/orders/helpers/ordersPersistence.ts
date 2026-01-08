import { logger } from '@/shared/services/logger'
import type { Order } from '../interfaces/types'

const STORAGE_KEY = 'orders'

/**
 * Recupera y parsea la lista de pedidos desde localStorage.
 * Convierte las fechas de string a objetos Date.
 * @returns Array de pedidos o array vacío si hay error/no hay datos.
 */
export function loadOrdersFromStorage(): Order[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []

  try {
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) {
      logger.warn('[ordersPersistence] Stored orders is not an array')
      return []
    }
    // Mapeo seguro para instanciar fechas
    return parsed.map((o: unknown) => {
      const item = o as Record<string, unknown>
      return {
        ...item,
        date: new Date(String(item.date || new Date())),
      } as Order
    })
  } catch (e) {
    logger.error('[ordersPersistence] Error parsing orders from storage', e)
    return []
  }
}

/**
 * Guarda la lista de pedidos en localStorage.
 * @param orders - Lista de pedidos a persistir.
 */
export function saveOrdersToStorage(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  } catch (e) {
    logger.error('[ordersPersistence] Error saving orders to storage', e)
  }
}

/**
 * Elimina los pedidos almacenados en localStorage.
 */
export function clearOrdersFromStorage(): void {
  localStorage.removeItem(STORAGE_KEY)
}
