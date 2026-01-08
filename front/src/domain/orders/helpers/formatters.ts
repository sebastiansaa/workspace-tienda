import type { OrderStatus } from '../interfaces/types'

/**
 * Formatea una fecha para mostrarla en formato local
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * Obtiene la etiqueta legible para el estado de un pedido.
 * @param status - Estado del pedido ('PENDING' | 'PAID' | 'CANCELLED' | 'COMPLETED').
   @returns Etiqueta legible correspondiente al estado.
 */
export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<string, string> = {
    COMPLETED: 'Completada',
    PENDING: 'Pendiente',
    CANCELLED: 'Cancelada',
    PAID: 'Pagada',
  }
  return labels[status] || String(status)
}
