import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { logger } from '@/shared/services/logger'
import type { MiniCartState } from '@/domain/cart/types'

/**
 * Store Pinia para controlar el estado del mini-cart drawer.
 * Estados posibles: 'closed' | 'mini' | 'expanded'
 */
export const useMiniCartStore = defineStore('miniCart', () => {
  // Estado interno (privado)
  const _state = ref<MiniCartState>('closed')

  // Getters (computed)
  const state = computed(() => _state.value)
  const isOpen = computed(() => _state.value !== 'closed')
  const isMini = computed(() => _state.value === 'mini')
  const isExpanded = computed(() => _state.value === 'expanded')

  // Actions
  const openMini = () => {
    logger.debug('[miniCartStore] openMini')
    _state.value = 'mini'
  }

  const openExpanded = () => {
    logger.debug('[miniCartStore] openExpanded')
    _state.value = 'expanded'
  }

  const expand = () => {
    if (_state.value === 'mini') {
      logger.debug('[miniCartStore] expand (from mini)')
      _state.value = 'expanded'
    }
  }

  const close = () => {
    logger.debug('[miniCartStore] close')
    _state.value = 'closed'
  }

  const resetStore = () => {
    close()
  }

  return {
    // Getters
    state,
    isOpen,
    isMini,
    isExpanded,
    // Actions
    openMini,
    openExpanded,
    expand,
    close,
    resetStore,
  }
})

