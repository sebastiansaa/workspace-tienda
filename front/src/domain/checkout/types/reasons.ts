// Códigos de error y reasons para el dominio `checkout`.
// Mantener aquí valores constantes evita typos y facilita refactor.

// Códigos de tokenización (dominio checkout)
export const TokenizeReasons = {
    NO_FORM: 'no_form' as const,
    NO_TOKEN: 'no_token' as const,
    FAILED: 'failed' as const,
}

export type TokenizeReason = (typeof TokenizeReasons)[keyof typeof TokenizeReasons]

// Códigos generales usados por handlePayment
export const CheckoutFailureReasons = {
    NOT_READY: 'not_ready' as const,
    INVALID_CARD_FORM: 'invalid_card_form' as const,
    TOKENIZATION_FAILED: 'tokenization_failed' as const,
    PAYMENT_INCOMPLETE: 'payment_incomplete' as const,
    PAYMENT_NOT_SUCCEEDED: 'payment_not_succeeded' as const,
    EXCEPTION: 'exception' as const,
}

export type CheckoutFailureReason = (typeof CheckoutFailureReasons)[keyof typeof CheckoutFailureReasons]

// Export práctico que agrupa todos los reasons del dominio
export const AllCheckoutReasons = {
    ...TokenizeReasons,
    ...CheckoutFailureReasons,
} as const

export type AnyCheckoutReason = (typeof AllCheckoutReasons)[keyof typeof AllCheckoutReasons]

export default {
    TokenizeReasons,
    CheckoutFailureReasons,
}
