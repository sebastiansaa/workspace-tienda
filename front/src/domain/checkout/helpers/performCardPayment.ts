import { createPaymentIntent } from '@/domain/checkout/services/paymentService'
import { normalizeApiError, normalizeStripeError } from '@/shared/helpers/error'
import { logger } from '@/shared/services/logger'
import type { Customer, PaymentMethod, PaymentIntent, Order, CardFormRef } from '@/domain/checkout/interfaces/types'

export interface PerformCardPaymentParams {
  customer: Customer
  payment: PaymentMethod
  cardForm: CardFormRef | null
  total: number
}

export interface PerformCardPaymentResult {
  success: boolean
  paymentIntent?: PaymentIntent
  order?: Order
}

export type PerformCardPaymentError = {
  stage: 'create_intent' | 'confirm' | 'validation' | 'unknown'
  message: string
  code?: string | number
  raw?: any
}

/* Flujo de pago con tarjeta (Stripe o mock).
 * - Valida datos,  Crea PaymentIntent, Confirma pago en cliente
 */
export async function performCardPayment(params: PerformCardPaymentParams): Promise<PerformCardPaymentResult> {
  const { customer, payment, cardForm, total } = params

  if (!customer) {
    const err: PerformCardPaymentError = { stage: 'validation', message: 'Cliente no proporcionado', code: 'MISSING_CUSTOMER' }
    throw err
  }
  if (!payment || !payment.method) {
    const err: PerformCardPaymentError = { stage: 'validation', message: 'Método de pago no seleccionado', code: 'MISSING_PAYMENT_METHOD' }
    throw err
  }
  if (!total || Number(total) <= 0) {
    const err: PerformCardPaymentError = { stage: 'validation', message: 'Importe inválido para crear PaymentIntent', code: 'INVALID_AMOUNT' }
    throw err
  }

  if (!cardForm || typeof cardForm.confirmPayment !== 'function') {
    const err: PerformCardPaymentError = { stage: 'validation', message: 'Formulario de tarjeta no disponible para confirmar pago', code: 'INVALID_CARD_FORM' }
    throw err
  }

  try {
    // Crear PaymentIntent (paymentService maneja mock si corresponde)
    logger.info('[performCardPayment] crear PaymentIntent', { total })
    const data = await createPaymentIntent(total, 'eur')
    const clientSecret = data?.client_secret
    if (!clientSecret) {
      const err: PerformCardPaymentError = { stage: 'create_intent', message: 'client_secret no devuelto por el backend', code: 'MISSING_CLIENT_SECRET' }
      throw err
    }

    logger.info('[performCardPayment] clientSecret recibido', { clientSecret })

    // Confirmar el pago en el cliente (Stripe Elements o mock interno)
    logger.info('[performCardPayment] confirmPayment - iniciando confirmación en cliente')
    const result = await cardForm.confirmPayment(clientSecret)
    logger.info('[performCardPayment] confirmPayment - resultado', { result })
    if (result?.error) {
      const s = normalizeStripeError(result.error)
      // Enviar error con contexto
      const err: PerformCardPaymentError = { stage: 'confirm', message: s.message, code: s.code, raw: result.error }
      throw err
    }

    const pi = result.paymentIntent

    // Si no está succeeded, devolvemos estado parcial
    if (pi && pi.status && pi.status !== 'succeeded') {
      return { success: false, paymentIntent: pi }
    }

    return { success: true, paymentIntent: pi }
  } catch (err: any) {
    // Normalizar y propagar error con contexto
    logger.info('[performCardPayment] catch', { err })
    if ((err as PerformCardPaymentError)?.stage) {
      // ya es un PerformCardPaymentError
      throw err
    }
    const norm = normalizeApiError(err)
    const out: PerformCardPaymentError = {
      stage: 'unknown',
      message: norm.message ?? String(err),
      raw: err,
      code: norm.status,
    }
    throw out
  }
}

export default performCardPayment
