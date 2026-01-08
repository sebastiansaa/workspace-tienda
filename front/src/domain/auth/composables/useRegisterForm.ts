import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { RegisterSchema } from '../schemas/registerSchema'
import type { RegisterPayload } from '../schemas/registerSchema'

// Validación reactiva de campos de registro usando Vee-Validate + Zod.
export function useRegisterForm() {
  // Centralizamos la validación en el schema del formulario
  const { handleSubmit, values, errors } = useForm<RegisterPayload>({
    validationSchema: toTypedSchema(RegisterSchema),
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  // useField se conecta automáticamente al schema global por el nombre
  const { value: name, errorMessage: nameError, handleBlur: nameBlur } = useField<string>('name')
  const { value: email, errorMessage: emailError, handleBlur: emailBlur } = useField<string>('email')
  const { value: password, errorMessage: passwordError, handleBlur: passwordBlur } = useField<string>('password')
  const { value: confirmPassword, errorMessage: confirmPasswordError, handleBlur: confirmPasswordBlur } = useField<string>('confirmPassword')

  // Valida y devuelve los datos del formulario.
  // handleSubmit SOLO ejecuta este callback si la validación del schema pasó exitosamente.
  const onSubmit = handleSubmit((values) => {
    console.log('[RegisterForm] Datos validados:', values)
    return values
  })

  return {
    // campos reactivos
    name,
    nameError,
    nameBlur,
    email,
    emailError,
    emailBlur,
    password,
    passwordError,
    passwordBlur,
    confirmPassword,
    confirmPasswordError,
    confirmPasswordBlur,

    // helpers
    values,
    formErrors: errors,
    onSubmit,
  }
}
