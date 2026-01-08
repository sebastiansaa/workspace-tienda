import { useQuery } from '@tanstack/vue-query'
import { useTimeoutFn } from '@vueuse/core'
import { computed } from 'vue'
import { useOrdersStore } from '../stores/ordersStore'
import { logger } from '@/shared/services/logger'
import type { Order } from '../interfaces/types'
import { fetchOrders } from '../services'

export function useOrders() {
  const store = useOrdersStore()

  const query = useQuery<Order[], Error>({
    queryKey: ['orders'],
    queryFn: async () => {
      logger.debug('[useOrders] Fetching orders from backend')
      return await fetchOrders()
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: true,
  })

  // Timer único para ocultar el mensaje de éxito
  const { start: startSuccessTimer } = useTimeoutFn(() => {
    store.setShowSuccess(false)
  }, 5000, { immediate: false })

  // Cuando se establezca showSuccess en true, iniciar/reiniciar el timer
  function watchSuccess() {
    if (!store.showSuccess) return
    logger.debug('[useOrders] Starting success message timer')
    startSuccessTimer()
  }

  const orders = computed(() => query.data.value ?? [])
  const isLoading = computed(() => query.isLoading.value)
  const isError = computed(() => query.isError.value)
  const error = computed(() => query.error.value)

  return {
    // State
    orders,
    isLoading,
    isError,
    error,

    // Actions
    refetch: query.refetch,
    watchSuccess,
    clearHistory: () => undefined,
  }
}

export default useOrders
