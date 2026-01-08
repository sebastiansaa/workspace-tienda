import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCheckoutStore } from '@/domain/checkout/stores/checkoutStore'
import type { CardFormRef } from '@/domain/checkout/interfaces/types'

/**
 * Composable para orquestar el flujo del CheckoutSidebar.
 */
export function useCheckoutSidebar() {
  const checkout = useCheckoutStore()
  const { customer, payment, errorMessage, isProcessing, success, isCheckoutReady } = storeToRefs(checkout)
  const { onCustomerConfirm, onPaymentSelect, handlePayment } = checkout

  // Referencia local al componente de tarjeta.
  // No necesitamos sincronizarla con el store globalmente, solo pasarla al pagar.
  const cardFormRef = ref<CardFormRef>(null)

  /**
   * Maneja el clic en el botón "Pagar ahora".
   */
  async function handlePay(total: number, items?: any[]) {
    // Validación defensiva simple
    if (payment.value?.method === 'card' && !cardFormRef.value) {
      console.error('Intento de pago con tarjeta sin referencia al formulario')
      return { ok: false, reason: 'form_missing' }
    }

    // Pasamos la ref directamente. El store no necesita haberla guardado antes.
    return await handlePayment(total, cardFormRef.value, items)
  }

  const canPay = computed(() => {
    if (!isCheckoutReady.value) return false

    if (payment.value?.method === 'card') {
      const card = cardFormRef.value
      if (!card) return false

      // Soporte para isFilled como valor directo o Ref
      const val = card.isFilled
      if (val && typeof val === 'object' && 'value' in val) {
        return (val as any).value === true
      }
      return val === true
    }
    return true
  })

  return {
    // Estado
    customer,
    payment,
    errorMessage,
    isProcessing,
    success,
    cardFormRef,

    // Acciones
    onCustomerConfirm,
    onPaymentSelect,
    handlePay,
    canPay,
  }
}
