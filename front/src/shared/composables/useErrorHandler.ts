/** Manejo de errores para la aplicación con toast */

import { useToast } from 'vue-toastification'
import { normalizeApiError, normalizeStripeError } from '@/shared/helpers/error'
import { logger } from '@/shared/services/logger'

export function useErrorHandler() {
  const toast = useToast()

  const handleError = (error: unknown, context?: string) => {
    logger.error(`Error in ${context || 'unknown'}:`, error)

    // Normalizar primero (sin efectos)
    const apiNorm = normalizeApiError(error)
    const maybeStripe = (error && typeof error === 'object' && ('error' in error || 'code' in error)) ? normalizeStripeError(error) : null

    let message = maybeStripe?.message ?? apiNorm.message ?? 'Ha ocurrido un error inesperado.'
    let title = 'Error'
    const status = apiNorm.status

    if (status) {
      switch (status) {
        case 404:
          title = 'No encontrado'
          message = 'El recurso solicitado no fue encontrado.'
          break
        case 401:
          title = 'No autorizado'
          message = 'No tienes permisos para acceder a este recurso.'
          break
        case 403:
          title = 'Acceso denegado'
          message = 'No tienes permisos suficientes.'
          break
        case 500:
          title = 'Error del servidor'
          message = 'Error interno del servidor. Inténtalo más tarde.'
          break
        default:
          // dejar el message resuelto por normalizeApiError
          break
      }
    } else if (message) {
      // Error de red o cliente
      if (message.includes('Network Error')) {
        title = 'Error de conexión'
        message = 'Revisa tu conexión a internet e inténtalo de nuevo.'
      }
    }

    // Solo mostrar toast para errores críticos
    if ((status && status >= 500) || title === 'Error de conexión') {
      toast.error(message, {
        timeout: 5000,
        closeOnClick: true,
      })
    }

    // Logging siempre
    logger.error(`[${title}] ${message}`)

    return { title, message, status }
  }

  const handleSuccess = (message: string) => {
    toast.success(message, {
      timeout: 3000,
      closeOnClick: true,
    })
    logger.info(`✅ Success: ${message}`)
  }

  const handleInfo = (message: string) => {
    toast.info(message, {
      timeout: 4000,
      closeOnClick: true,
    })
    logger.info(`ℹ️ Info: ${message}`)
  }

  const handleWarning = (message: string) => {
    toast.warning(message, {
      timeout: 4000,
      closeOnClick: true,
    })
    logger.warn(`⚠️ Warning: ${message}`)
  }

  return {
    handleError,
    handleSuccess,
    handleInfo,
    handleWarning,
  }
}
