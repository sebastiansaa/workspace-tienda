
import { z } from 'zod'

export const CheckoutSchema = z.object({
  fullName: z.string().min(2, 'Nombre requerido'),
  address: z.string().min(5, 'Dirección requerida'),
  phone: z.string().min(7, 'Teléfono inválido').max(20, 'Teléfono inválido'),
  email: z.string().email('Email inválido'),

})

export type CheckoutPayload = z.infer<typeof CheckoutSchema>
// Exportar validadores por campo para permitir validación en tiempo real
export const fullNameSchema = z.string().min(2, 'Nombre requerido')
export const addressSchema = z.string().min(5, 'Dirección requerida')
export const phoneSchema = z.string().min(7, 'Teléfono inválido').max(20, 'Teléfono inválido')
export const emailSchema = z.string().email('Email inválido')


