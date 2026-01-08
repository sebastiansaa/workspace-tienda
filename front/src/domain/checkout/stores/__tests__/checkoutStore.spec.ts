import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCheckoutStore } from '../checkoutStore'
import { CheckoutFailureReasons } from '../../types/reasons'

// Mock performCardPayment to avoid network and focus on orchestration
vi.mock('../../helpers/performCardPayment', () => ({
  performCardPayment: vi.fn(async ({ customer, payment, cardForm, total }) => {
    return {
      success: true,
      paymentIntent: { id: 'pi_mock', status: 'succeeded' },
    }
  }),
}))

import { performCardPayment } from '../../helpers/performCardPayment'

describe('checkoutStore - handlePayment', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('tokeniza y llama a performCardPayment con la ref pasada', async () => {
    const store = useCheckoutStore()

    // Preparar customer y método de pago
    store.onCustomerConfirm({ name: 'Test', email: 'a@b.com' } as any)
    store.onPaymentSelect({ method: 'card' } as any)

    // Mock CardFormRef con tokenizePayload
    const mockCardForm: any = {
      tokenizePayload: vi.fn(async () => ({ token: 'tok_123', brand: 'visa' })),
    }

    const result = await store.handlePayment(1000, mockCardForm)

    expect(result).toBeDefined()
    expect(result.ok).toBe(true)
    // El payment.details fue asignado a partir del token
    expect((result as any).payload.payment.details).toEqual({ token: 'tok_123', brand: 'visa' })

    // performCardPayment fue llamado
    expect(performCardPayment).toHaveBeenCalled()
    const call = (performCardPayment as any).mock.calls[0][0]
    expect(call.cardForm).toBe(mockCardForm)
    expect(call.total).toBe(1000)
  })

  it('lanza si cardFormRef no tiene tokenizePayload', async () => {
    const store = useCheckoutStore()
    store.onCustomerConfirm({ name: 'Test', email: 'a@b.com' } as any)
    store.onPaymentSelect({ method: 'card' } as any)

    const badForm: any = {}

    const bad = await store.handlePayment(500, badForm)
    expect(bad).toBeDefined()
    expect(bad.ok).toBe(false)
    expect((bad as any).reason).toBe(CheckoutFailureReasons.INVALID_CARD_FORM)
  })

  it('maneja tokenización fallida (TokenizeReasons.FAILED)', async () => {
    const store = useCheckoutStore()
    store.onCustomerConfirm({ name: 'Test', email: 'a@b.com' } as any)
    store.onPaymentSelect({ method: 'card' } as any)

    const mockCardForm: any = {
      tokenizePayload: vi.fn(async () => ({ error: new Error('token error') })),
    }

    const res = await store.handlePayment(200, mockCardForm)
    expect(res).toBeDefined()
    expect(res.ok).toBe(false)
    expect((res as any).reason).toBe(CheckoutFailureReasons.TOKENIZATION_FAILED)
  })

  it('maneja performCardPayment con success:false', async () => {
    const store = useCheckoutStore()
    store.onCustomerConfirm({ name: 'Test', email: 'a@b.com' } as any)
    store.onPaymentSelect({ method: 'card', details: { token: 'tok_123' } } as any)

      // Forzar performCardPayment a devolver failure
      ; (performCardPayment as any).mockResolvedValueOnce({ success: false, paymentIntent: { status: 'requires_payment_method' } })

    const mockCardForm: any = { tokenizePayload: vi.fn(async () => ({ token: 'tok_123' })) }
    const res = await store.handlePayment(300, mockCardForm)
    expect(res).toBeDefined()
    expect(res.ok).toBe(false)
    expect((res as any).reason).toBe(CheckoutFailureReasons.PAYMENT_INCOMPLETE)
  })

  it('maneja paymentIntent no succeeded', async () => {
    const store = useCheckoutStore()
    store.onCustomerConfirm({ name: 'Test', email: 'a@b.com' } as any)
    store.onPaymentSelect({ method: 'card', details: { token: 'tok_123' } } as any)

      ; (performCardPayment as any).mockResolvedValueOnce({ success: true, paymentIntent: { status: 'requires_action' } })

    const mockCardForm: any = { tokenizePayload: vi.fn(async () => ({ token: 'tok_123' })) }
    const res = await store.handlePayment(400, mockCardForm)
    expect(res).toBeDefined()
    expect(res.ok).toBe(false)
    expect((res as any).reason).toBe(CheckoutFailureReasons.PAYMENT_NOT_SUCCEEDED)
  })

  it('devuelve not_ready si falta cliente', async () => {
    const store = useCheckoutStore()
    // No setActive customer
    store.onPaymentSelect({ method: 'card' } as any)

    const mockCardForm: any = { tokenizePayload: vi.fn(async () => ({ token: 'tok_123' })) }
    const res = await store.handlePayment(500, mockCardForm)
    expect(res).toBeDefined()
    expect(res.ok).toBe(false)
    expect((res as any).reason).toBe(CheckoutFailureReasons.NOT_READY)
  })

  it('devuelve exception si ocurre un error inesperado', async () => {
    const store = useCheckoutStore()
    store.onCustomerConfirm({ name: 'Test', email: 'a@b.com' } as any)
    store.onPaymentSelect({ method: 'card', details: { token: 'tok_123' } } as any)

      // Forzar error en performCardPayment
      ; (performCardPayment as any).mockRejectedValueOnce(new Error('Unexpected crash'))

    const mockCardForm: any = { tokenizePayload: vi.fn(async () => ({ token: 'tok_123' })) }
    const res = await store.handlePayment(600, mockCardForm)
    expect(res).toBeDefined()
    expect(res.ok).toBe(false)
    expect((res as any).reason).toBe(CheckoutFailureReasons.EXCEPTION)
  })
})
