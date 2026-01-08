import { z } from 'zod'

export const saveProductSchema = z.object({
    id: z.number().int().positive().optional(),
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    price: z.number().min(0, 'Price must be non-negative'),
    description: z.string().optional(),
    stock: z.number().int().min(0, 'Stock must be non-negative').optional(),
    active: z.boolean().optional(),
    images: z.array(z.string().url()).min(1, 'At least one image is required'),
    categoryId: z.number().int().positive('Category is required'),
})

export const updateStockSchema = z.object({
    quantity: z.number().int().min(0, 'Quantity must be non-negative'),
})
