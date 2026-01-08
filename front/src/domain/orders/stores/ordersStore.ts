import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { logger } from '@/shared/services/logger'

export const useOrdersStore = defineStore('orders', () => {
  // Estado interno (privado)
  const _showSuccess = ref(false)

  // Getters (computed)
  const showSuccess = computed(() => _showSuccess.value)

  // Actions
  function setShowSuccess(value: boolean) {
    logger.debug(`[ordersStore] setShowSuccess: ${value}`)
    _showSuccess.value = value
  }

  function resetStore() {
    logger.debug('[ordersStore] resetStore')
    _showSuccess.value = false
  }

  return {
    showSuccess,
    setShowSuccess,
    resetStore,
  }
})


export default useOrdersStore
