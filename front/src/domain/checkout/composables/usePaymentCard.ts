import { ref, onMounted, onBeforeUnmount, computed, type Ref } from 'vue'
import { FORCE_MOCK_PAYMENTS, STRIPE_PUBLISHABLE_KEY } from '@/shared/config/config'
import { initStripeElements, destroyStripeElements } from '@/domain/checkout/helpers/stripe'
import type { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js'
import type { CardTokenPayload } from '@/domain/checkout/interfaces/types'

// Tipos auxiliares exportados para consumidores
export type TokenizeSuccess = CardTokenPayload
export type TokenizeError = { error: any }
export type TokenizeResult = TokenizeSuccess | TokenizeError

/**
 * Composable para pagos con tarjeta (Stripe o mock).
 * Orquesta el flujo completo de pago: inicialización, tokenización y confirmación.
 */
export const usePaymentCard = (
  publishableKey?: string,
  // Aceptamos una Ref de Vue estándar para el contenedor
  containerRef?: Ref<HTMLElement | null>
) => {

  // Estado del formulario (usado principalmente en modo Mock)
  const cardholder = ref('')
  const number = ref('')
  const exp = ref('')
  const cvc = ref('')

  // Estado de la UI (Privado)
  const _processing = ref(false)
  const _error = ref<string | null>(null)
  const _mode = ref<'stripe' | 'mock'>('mock')
  const _tokenizingLabel = ref('Tokenizando...')

  // Getters (Públicos - Readonly)
  const processing = computed(() => _processing.value)
  const error = computed(() => _error.value)
  const mode = computed(() => _mode.value)
  const tokenizingLabel = computed(() => _tokenizingLabel.value)

  // Referencias internas de Stripe
  const stripeRef = ref<Stripe | null>(null)
  const elementsRef = ref<StripeElements | null>(null)
  const cardElementRef = ref<StripeCardElement | null>(null)

  // Computed: Validación básica para habilitar botón de pago (solo relevante en Mock)
  const isFilled = computed(() => {
    if (_mode.value === 'stripe') return true // Stripe Elements maneja su propia validación interna

    const hasHolder = !!(cardholder.value && cardholder.value.trim().length > 0)
    // Validación laxa para mock
    const hasNumber = !!(number.value && number.value.replace(/\s+/g, '').length >= 12)
    const hasExp = !!(exp.value && exp.value.replace(/\s+/g, '').length >= 3)
    const hasCvc = !!(cvc.value && cvc.value.replace(/\s+/g, '').length >= 3)

    return hasHolder && hasNumber && hasExp && hasCvc
  })

  /**
   * Helper interno: Detecta marca de tarjeta (solo visual/mock)
   */
  const detectBrand = (num: string) => {
    if (/^4/.test(num)) return 'visa'
    if (/^5[1-5]/.test(num)) return 'mastercard'
    if (/^3[47]/.test(num)) return 'amex'
    return 'unknown'
  }

  /**
   * Inicialización: Decide si usar Stripe o Mock
   */
  onMounted(async () => {
    try {
      // Prioridad: prop > env > config default
      const key = publishableKey ?? (import.meta.env.VITE_STRIPE_PK as string) ?? STRIPE_PUBLISHABLE_KEY

      // initStripeElements maneja la lógica de carga de script y creación de elementos
      const res = await initStripeElements(key, containerRef?.value ?? null, !!FORCE_MOCK_PAYMENTS)

      stripeRef.value = res.stripe
      elementsRef.value = res.elements
      cardElementRef.value = res.card
      _mode.value = res.mode
    } catch (err) {
      console.warn('[usePaymentCard] Fallo al iniciar Stripe, usando modo Mock', err)
      _mode.value = 'mock'
    }
  })

  onBeforeUnmount(() => {
    destroyStripeElements(cardElementRef.value)
  })

  /**
   * Acción Principal: Tokenizar
   * Convierte los datos de la tarjeta en un token seguro (o simulado)
   */
  const tokenize = async (): Promise<TokenizeResult | undefined> => {
    _error.value = null
    _processing.value = true

    try {
      // 1. Flujo Stripe Real
      if (_mode.value === 'stripe' && stripeRef.value && cardElementRef.value) {
        const res = await stripeRef.value.createPaymentMethod({
          type: 'card',
          card: cardElementRef.value,
          billing_details: { name: cardholder.value || undefined },
        })

        if (res.error) {
          _error.value = res.error.message || 'Error al tokenizar con Stripe'
          return { error: res.error }
        }

        const pm = res.paymentMethod
        return {
          token: pm.id,
          last4: pm.card?.last4 ?? null,
          brand: pm.card?.brand ?? null,
          cardholder: cardholder.value,
        }
      }

      // 2. Flujo Mock
      if (!number.value || !exp.value || !cvc.value) {
        _error.value = 'Completa los datos de la tarjeta.'
        return { error: new Error(_error.value) }
      }

      const sanitized = number.value.replace(/\s+/g, '')
      const last4 = sanitized.slice(-4)
      const brand = detectBrand(sanitized)

      // Simular latencia de red
      await new Promise((r) => setTimeout(r, 600))

      const token = `tok_mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      return { token, last4, brand, cardholder: cardholder.value }

    } catch (err: any) {
      _error.value = err?.message ?? String(err)
      return { error: err }
    } finally {
      _processing.value = false
    }
  }

  /**
   * Wrapper para tokenize que normaliza la salida
   * Usado por el componente padre para obtener el payload limpio
   */
  const tokenizePayload = async () => {
    const res = await tokenize()
    if (!res) return undefined
    if ('error' in res) return res

    return {
      token: res.token,
      last4: res.last4 ?? null,
      brand: res.brand ?? null,
      cardholder: res.cardholder ?? cardholder.value ?? null,
    }
  }

  /**
   * Acción Secundaria: Confirmar Pago (3DS)
   * Se llama después de que el backend crea el PaymentIntent si requiere acción adicional
   */
  const confirmPayment = async (clientSecret: string) => {
    _error.value = null
    _processing.value = true

    try {
      if (_mode.value === 'stripe' && stripeRef.value && cardElementRef.value) {
        const res = await stripeRef.value.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElementRef.value,
            billing_details: { name: cardholder.value || undefined },
          },
        })

        if (res.error) {
          _error.value = res.error.message || 'Error en la confirmación del pago'
          return { error: res.error }
        }
        return { paymentIntent: res.paymentIntent }
      }

      // Mock confirm
      await new Promise((r) => setTimeout(r, 800))
      return { paymentIntent: { status: 'succeeded', id: `pi_mock_${Date.now()}` } }

    } catch (err: any) {
      _error.value = err?.message ?? String(err)
      return { error: err }
    } finally {
      _processing.value = false
    }
  }

  return {
    // State
    cardholder,
    number,
    exp,
    cvc,
    processing,
    error,
    mode,
    tokenizingLabel,
    isFilled,

    // Refs (expuestas para casos avanzados)
    stripeRef,
    elementsRef,
    cardElementRef,

    // Actions
    tokenize,
    tokenizePayload,
    confirmPayment,
  }
}

export default usePaymentCard
