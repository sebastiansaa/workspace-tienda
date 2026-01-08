import { z } from 'zod'

export const LoginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type LoginPayload = z.infer<typeof LoginSchema>

// Exportar validadores por campo para permitir validación en tiempo real
export const emailSchema = z.string().email('Email inválido')
export const passwordSchema = z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
