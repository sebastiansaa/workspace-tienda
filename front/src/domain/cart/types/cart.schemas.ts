import { z } from 'zod'

export const addItemSchema = z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().min(1),
})

export const updateQuantitySchema = z.object({
    quantity: z.number().int().min(0),
})

export type AddItemDto = z.infer<typeof addItemSchema>
export type UpdateQuantityDto = z.infer<typeof updateQuantitySchema>
