import { serverAdapter } from '@/shared/api/serverAdapter'
import { FORCE_MOCK_PAYMENTS } from '@/shared/config/config'
import { logger } from '@/shared/services/logger'
import { PaymentResponseSchema } from '@/domain/checkout/schema/paymentResponses'
import type { PaymentResponse } from '@/domain/checkout/interfaces/types'
import { normalizeApiError } from '@/shared/helpers/error'

type InitiatePayload = {
  orderId?: string | null
  amount: number
  currency?: string
  paymentMethodToken?: string
  items?: any[]
}

type ConfirmPayload = {
  paymentMethodToken?: string
}

export async function initiatePayment(payload: InitiatePayload): Promise<PaymentResponse> {
  if (FORCE_MOCK_PAYMENTS) {
    logger.debug('[paymentService] Mocking initiatePayment')
    return {
      paymentId: `pay_mock_${Date.now()}`,
      orderId: payload.orderId ?? `order_mock_${Date.now()}`,
      amount: payload.amount,
      status: 'PENDING',
      clientSecret: `cs_mock_${Date.now()}`,
      provider: 'FAKE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  try {
    logger.info('[paymentService] initiatePayment', { ...payload, paymentMethodToken: !!payload.paymentMethodToken })
    const resp = await serverAdapter.post('/payments/initiate', payload)
    const parsed = PaymentResponseSchema.safeParse(resp.data)
    if (!parsed.success) {
      logger.error('[paymentService] Invalid initiate response', { errors: parsed.error.format() })
      throw new Error('Respuesta de initiate inválida')
    }
    return parsed.data
  } catch (err) {
    const norm = normalizeApiError(err)
    logger.error('[paymentService] initiatePayment failed', { error: norm })
    throw new Error(norm.message || 'Error al iniciar el pago')
  }
}

export async function confirmPayment(paymentId: string, payload: ConfirmPayload): Promise<PaymentResponse> {
  if (FORCE_MOCK_PAYMENTS) {
    logger.debug('[paymentService] Mocking confirmPayment')
    return {
      paymentId,
      orderId: `order_mock_${Date.now()}`,
      amount: payload?.paymentMethodToken ? 100 : 0,
      status: 'PAID',
      provider: 'FAKE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  try {
    logger.info('[paymentService] confirmPayment', { paymentId, hasToken: !!payload.paymentMethodToken })
    const resp = await serverAdapter.post(`/payments/${paymentId}/confirm`, payload)
    const parsed = PaymentResponseSchema.safeParse(resp.data)
    if (!parsed.success) {
      logger.error('[paymentService] Invalid confirm response', { errors: parsed.error.format() })
      throw new Error('Respuesta de confirm inválida')
    }
    return parsed.data
  } catch (err) {
    const norm = normalizeApiError(err)
    logger.error('[paymentService] confirmPayment failed', { error: norm })
    throw new Error(norm.message || 'Error al confirmar el pago')
  }
}
