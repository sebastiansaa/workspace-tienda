import { ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { CheckoutSchema } from '../schema/checkoutSchema'
import type { CheckoutPayload } from '../schema/checkoutSchema'

/**
 * Gestiona la validación reactiva de campos usando Vee-Validate + Zod.
 * NO procesa el pago - solo valida y devuelve los datos del comprador.
 */
export function useCheckoutForm() {

  // 1. Centralizamos la validación en el schema del formulario.
  // 'errors' es reactivo y contiene los mensajes de error automáticamente.
  const { handleSubmit, values, errors } = useForm<CheckoutPayload>({
    validationSchema: toTypedSchema(CheckoutSchema),
    initialValues: {
      fullName: '',
      address: '',
      phone: '',
      email: '',
    },
  })

  // 2. Simplificación: useField se conecta automáticamente al schema global por el nombre.
  // No es necesario pasar 'createFieldValidator' de nuevo.
  const { value: fullName, errorMessage: fullNameError, handleBlur: fullNameBlur } = useField<string>('fullName')
  const { value: address, errorMessage: addressError, handleBlur: addressBlur } = useField<string>('address')
  const { value: phone, errorMessage: phoneError, handleBlur: phoneBlur } = useField<string>('phone')
  const { value: email, errorMessage: emailError, handleBlur: emailBlur } = useField<string>('email')

  /**
   * Valida y devuelve los datos del formulario como Customer.
   * handleSubmit SOLO ejecuta este callback si la validación del schema pasó exitosamente.
   */
  const onSubmit = handleSubmit((values) => {
    // Si entramos aquí, VeeValidate garantiza que 'values' cumple con CheckoutSchema.
    console.log('[CheckoutForm] Datos validados:', values)
    return values
  })

  return {
    // campos reactivos
    fullName, fullNameError, fullNameBlur,
    address, addressError, addressBlur,
    phone, phoneError, phoneBlur,
    email, emailError, emailBlur,

    // helpers
    values,
    formErrors: errors, // Usamos los errores nativos de vee-validate
    onSubmit,
  }
}
