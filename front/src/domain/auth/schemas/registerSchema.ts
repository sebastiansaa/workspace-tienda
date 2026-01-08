import { z } from 'zod'

export const RegisterSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
})

export type RegisterPayload = z.infer<typeof RegisterSchema>

// Exportar validadores por campo para permitir validación en tiempo real
export const nameSchema = z.string().min(2, 'El nombre debe tener al menos 2 caracteres')
export const emailSchema = z.string().email('Email inválido')
export const passwordSchema = z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
export const confirmPasswordSchema = z.string().min(6, 'Confirma tu contraseña')
