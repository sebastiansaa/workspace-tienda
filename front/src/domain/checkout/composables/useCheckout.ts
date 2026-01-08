import { useMutation } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { cartStore } from '@/domain/cart/stores/cartStore'
import { completeCheckout } from '../services/paymentService'
import type { CompleteCheckoutResponse, CompleteCheckoutPayload } from '@/domain/checkout/interfaces/types'


// Encapsula la lógica del proceso de checkout utilizando `useMutation` de Vue Query. Simula una integración con pasarela de pago, limpia el carrito tras el éxito y redirige al usuario a la vista de órdenes.


export function useCheckout() {
  const router = useRouter()
  const cart = cartStore()

  const checkoutMutation = useMutation<CompleteCheckoutResponse, Error, CompleteCheckoutPayload>({
    // 1. La mutationFn se mantiene pura: solo entrada -> salida asíncrona
    mutationFn: (formData: CompleteCheckoutPayload) => completeCheckout(formData),

    // 2. Los efectos secundarios van aquí
    onSuccess: (data) => {
      void cart.clearCart()

      // UI Feedback / Redirección
      setTimeout(() => {
        router.push({ path: '/orders', query: { success: 'true' } })
      }, 800)
    },

    // Opcional: Manejo de errores global si lo necesitas
    onError: (error) => {
      console.error('Checkout falló', error)
    }
  })

  return {
    performCheckout: checkoutMutation.mutate,
    performCheckoutAsync: checkoutMutation.mutateAsync,
    processing: checkoutMutation.isPending,
    success: checkoutMutation.isSuccess,
    error: checkoutMutation.error,
  }
}

