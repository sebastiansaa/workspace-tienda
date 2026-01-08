// Runtime flags y variables de entorno
export const FORCE_MOCK_PAYMENTS = (import.meta.env.VITE_FORCE_MOCK_PAYMENTS as string) === 'true'

export const STRIPE_PUBLISHABLE_KEY = (import.meta.env.VITE_STRIPE_PK as string) || undefined

export default {
    FORCE_MOCK_PAYMENTS,
    STRIPE_PUBLISHABLE_KEY,
}
