import type { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js'

export type StripeInitResult = {
  stripe: Stripe | null
  elements: StripeElements | null
  card: StripeCardElement | null
  mode: 'stripe' | 'mock'
  error?: any
}

/** Precarga el SDK de Stripe para reducir latencia */
export async function prefetchStripe(publishableKey?: string | undefined) {
  if (typeof window === 'undefined') return null
  try {
    const mod = await import('@stripe/stripe-js')
    const loadStripe = mod.loadStripe
    if (!loadStripe) return null
    const key = publishableKey?.trim()
    if (!key) return null
    await loadStripe(key)
    return true
  } catch (err) {
    return null
  }
}

// Inicializa Stripe Elements o activa modo mock
export async function initStripeElements(
  publishableKey?: string | undefined,
  container?: HTMLElement | null,
  forceMock = false,
): Promise<StripeInitResult> {
  if (typeof window === 'undefined') return { stripe: null, elements: null, card: null, mode: 'mock' }
  if (forceMock) return { stripe: null, elements: null, card: null, mode: 'mock' }

  try {
    const mod = await import('@stripe/stripe-js')
    const loadStripe = mod.loadStripe
    if (typeof loadStripe !== 'function') {
      return { stripe: null, elements: null, card: null, mode: 'mock' }
    }

    const key = publishableKey?.trim()
    if (!key) return { stripe: null, elements: null, card: null, mode: 'mock' }

    const stripe: Stripe | null = await loadStripe(key)
    if (!stripe) return { stripe: null, elements: null, card: null, mode: 'mock' }

    const elements = stripe.elements()
    const card = elements.create('card', { style: { base: { fontSize: '16px' } } })

    if (container && card && typeof (card as any).mount === 'function') {
      try {
        ; (card as any).mount(container)
        return { stripe, elements, card, mode: 'stripe' }
      } catch (err) {
        return { stripe: null, elements: null, card: null, mode: 'mock', error: err }
      }
    }

    return { stripe: null, elements: null, card: null, mode: 'mock' }
  } catch (err) {
    return { stripe: null, elements: null, card: null, mode: 'mock', error: err }
  }
}

export function destroyStripeElements(card?: StripeCardElement | null) {
  try {
    card?.unmount()
  } catch (e) {
    /* ignore */
  }
}

export type { Stripe, StripeElements, StripeCardElement }
