import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { LoginSchema } from '../schemas/loginSchema'
import type { LoginPayload } from '../schemas/loginSchema'

// Gestiona la validación reactiva de campos de login usando Vee-Validate + Zod.
export function useLoginForm() {
  // Centralizamos la validación en el schema del formulario
  const { handleSubmit, values, errors } = useForm<LoginPayload>({
    validationSchema: toTypedSchema(LoginSchema),
    initialValues: {
      email: '',
      password: '',
    },
  })

  // useField se conecta automáticamente al schema global por el nombre
  const { value: email, errorMessage: emailError, handleBlur: emailBlur } = useField<string>('email')
  const { value: password, errorMessage: passwordError, handleBlur: passwordBlur } = useField<string>('password')

  // Valida y devuelve los datos del formulario.
  // handleSubmit SOLO ejecuta este callback si la validación del schema pasó exitosamente.
  const onSubmit = handleSubmit((values) => {
    console.log('[LoginForm] Datos validados:', values)
    return values
  })

  return {
    // campos reactivos
    email,
    emailError,
    emailBlur,
    password,
    passwordError,
    passwordBlur,

    // helpers
    values,
    formErrors: errors,
    onSubmit,
  }
}
