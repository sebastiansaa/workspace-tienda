import { z } from 'zod'

export const PaymentResponseSchema = z.object({
    paymentId: z.string(),
    orderId: z.string(),
    amount: z.number(),
    status: z.string(),
    externalPaymentId: z.string().optional().nullable(),
    clientSecret: z.string().optional().nullable(),
    provider: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export type PaymentResponse = z.infer<typeof PaymentResponseSchema>

export default {
    PaymentResponseSchema,
}
