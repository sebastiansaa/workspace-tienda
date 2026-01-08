export type ApiErrorNormalized = {
    message: string
    status?: number
    raw?: unknown
}

export type StripeErrorNormalized = {
    message: string
    code?: string
    raw?: unknown
}

export function normalizeApiError(err: unknown): ApiErrorNormalized {
    const raw = err as Record<string, unknown>
    let message = 'Ha ocurrido un error inesperado.'
    let status: number | undefined

    if (raw?.response) {
        const response = raw.response as Record<string, unknown>
        status = response?.status as number | undefined
        // intentar obtener mensaje desde body
        if (response.data && (typeof response.data === 'string' || typeof (response.data as Record<string, unknown>).message === 'string')) {
            const data = response.data as Record<string, unknown>
            message = (data.message as string) ?? String(response.data)
        } else if (response.statusText) {
            message = `${response.status}: ${response.statusText}`
        }
    } else if (raw?.message) {
        message = raw.message as string
    } else if (typeof raw === 'string') {
        message = raw
    }

    return { message, status, raw: err }
}

export function normalizeStripeError(err: unknown): StripeErrorNormalized {
    const raw = err as Record<string, unknown>
    // Stripe errors often come as { error: { message, code, type } } or as Error with message
    if (raw?.error && (raw.error as Record<string, unknown>).message || (raw.error as Record<string, unknown>).code) {
        const error = raw.error as Record<string, unknown>
        return { message: (error.message as string) ?? String(raw.error), code: error.code as string | undefined, raw: err }
    }

    if (raw?.code || raw?.message) {
        return { message: (raw.message as string) ?? String(raw), code: raw.code as string | undefined, raw: err }
    }

    if (typeof raw === 'string') {
        return { message: raw, raw: err }
    }

    return { message: 'Error en el pago con tarjeta.', raw: err }
}

export default { normalizeApiError, normalizeStripeError }
