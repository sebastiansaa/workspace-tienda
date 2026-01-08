import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { autoTokenizeCard } from '@/domain/checkout/helpers/cardTokenization'
import type { CardFormRef } from '@/domain/checkout/interfaces/types'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import type { Customer, PaymentMethod, PaymentResponse } from '@/domain/checkout/interfaces/types'
import { logger } from '@/shared/services/logger'
import { TokenizeReasons, CheckoutFailureReasons } from '@/domain/checkout/types/reasons'
import type { Result } from '@/shared/types'
import { initiatePayment, confirmPayment } from '@/domain/checkout/services/paymentService'
import { createOrderFromCart, safeMarkOrderPaid } from '@/domain/orders/services'

//Orquesta el flujo de checkout para pagos

export const useCheckoutStore = defineStore('checkout', () => {
  // Estado reactivo (Privado)
  const _customer = ref<Customer | null>(null)
  const _payment = ref<PaymentMethod | null>(null)
  const _errorMessage = ref<string | null>(null)
  const _isProcessing = ref(false)
  const _success = ref(false)

  const { handleError, handleSuccess } = useErrorHandler()

  // Getters (Públicos - Readonly)
  const customer = computed(() => _customer.value)
  const payment = computed(() => _payment.value)
  const errorMessage = computed(() => _errorMessage.value)
  const isProcessing = computed(() => _isProcessing.value)
  const success = computed(() => _success.value)

  // Indica si el checkout está listo para pagar
  const isCheckoutReady = computed(() => !!_customer.value && !!_payment.value?.method)

  // Guarda datos del comprador
  function onCustomerConfirm(payload: Customer) {
    _customer.value = payload
  }

  // Guarda método de pago
  function onPaymentSelect(payload: PaymentMethod) {
    _payment.value = payload
  }

  /* Ejecuta el pago completo con tokenización automática.
   * - Valida datos, Tokeniza , Crea y confirma el PaymentIntent - Devuelve payload completo o null   */
  async function handlePayment(total: number, cardFormRef: CardFormRef, items?: any[], currency = 'eur'): Promise<Result<PaymentResponse>> {
    if (!isCheckoutReady.value) return { ok: false, reason: CheckoutFailureReasons.NOT_READY }

    // Precondición explícita: si se intenta pagar con tarjeta, la ref debe
    // contener `tokenizePayload`.
    if (_payment.value?.method === 'card' && !cardFormRef?.tokenizePayload) {
      return { ok: false, reason: CheckoutFailureReasons.INVALID_CARD_FORM, details: 'cardFormRef missing tokenizePayload' }
    }

    logger.info('[checkoutStore] handlePayment start', { total, hasCustomer: !!_customer.value, paymentMethod: _payment.value?.method ?? null })

    resetErrors()
    _isProcessing.value = true
    _success.value = false

    try {
      if (!_customer.value) throw new Error('Cliente no establecido')
      if (!_payment.value) throw new Error('Método de pago no establecido')

      const currentCustomer = _customer.value
      let currentPayment = _payment.value

      // Tokenizar si es tarjeta y no tiene detalles
      if (currentPayment.method === 'card' && !currentPayment.details) {
        logger.info('[checkoutStore] tokenization - starting', { currentPayment: currentPayment.method })
        const tokenResult = await autoTokenizeCard(cardFormRef)
        logger.info('[checkoutStore] tokenization - result', { tokenResult })
        if (!tokenResult.ok) {
          // Diferenciar mensajes según causa
          if (tokenResult.reason === TokenizeReasons.NO_FORM) {
            _errorMessage.value = 'Formulario de tarjeta no disponible.'
            return { ok: false, reason: CheckoutFailureReasons.INVALID_CARD_FORM }
          }
          _errorMessage.value = `Error al tokenizar tarjeta: ${String(tokenResult.error ?? 'unknown')}`
          return { ok: false, reason: CheckoutFailureReasons.TOKENIZATION_FAILED, details: tokenResult.error }
        }

        // Asignar detalles tokenizados
        _payment.value = { ...currentPayment, details: tokenResult.payload }
        currentPayment = _payment.value
      }

      const paymentMethodToken = currentPayment.method === 'card' ? currentPayment.details?.token : undefined

      // Paso 0: crear orden en backend desde el carrito
      const order = await createOrderFromCart()
      const orderId = order.id

      // Paso 1: iniciar pago vinculando la orden creada
      const initiated = await initiatePayment({
        orderId,
        amount: total,
        currency,
        paymentMethodToken,
        items,
      })

      if (!initiated || initiated.status === 'FAILED') {
        _errorMessage.value = 'No se pudo iniciar el pago'
        return { ok: false, reason: CheckoutFailureReasons.PAYMENT_INCOMPLETE, details: initiated?.status }
      }

      // Paso 2: confirmar pago en backend
      const confirmed = await confirmPayment(initiated.paymentId, { paymentMethodToken })
      if (!confirmed || confirmed.status !== 'PAID') {
        _errorMessage.value = `Pago no completado: ${String(confirmed?.status ?? 'unknown')}`
        return { ok: false, reason: CheckoutFailureReasons.PAYMENT_NOT_SUCCEEDED, details: confirmed?.status }
      }

      // Paso 3: marcar la orden como pagada
      await safeMarkOrderPaid(orderId)

      handleSuccess('Pago confirmado. Completando orden...')
      _success.value = true

      return { ok: true, payload: { ...confirmed, orderId } as PaymentResponse }
    } catch (err: any) {
      logger.error('[checkoutStore] handlePayment error', { err })

      const info = handleError(err, 'CheckoutStore')
      // Enriquecer mensaje con contexto mínimo
      _errorMessage.value = `Error en pago: ${info.message}`
      _success.value = false
      return { ok: false, reason: CheckoutFailureReasons.EXCEPTION, details: info }
    } finally {
      _isProcessing.value = false
    }
  }

  // Limpia el estado del checkout
  function resetCheckout() {
    resetErrors()
    resetPaymentState()
    _customer.value = null
  }

  function resetErrors() {
    _errorMessage.value = null
    _isProcessing.value = false
  }

  function resetPaymentState() {
    _payment.value = null
    _success.value = false
  }

  return {
    customer,
    payment,
    errorMessage,
    isProcessing,
    success,
    isCheckoutReady,
    onCustomerConfirm,
    onPaymentSelect,
    handlePayment,
    resetCheckout,
  }
})

export default useCheckoutStore
