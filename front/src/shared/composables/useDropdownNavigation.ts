//Gestiona navegación por teclado para listas/dropdowns: ArrowDown, ArrowUp, Enter y Escape.

import { ref, watch, type Ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { logger } from '../services/logger'

export function useDropdownNavigation<T>(
  items: Ref<T[]>,
  onSelect: (item: T) => void,
  opts: { isOpen?: Ref<boolean>; loop?: boolean } = {}
) {
  const activeIndex = ref(-1)
  const loop = opts.loop ?? false
  const isOpen = opts.isOpen

  function reset() {
    logger.debug('[useDropdownNavigation] Resetting active index')
    activeIndex.value = -1
  }

  function selectActive() {
    const idx = activeIndex.value
    if (idx >= 0 && items.value && items.value[idx]) {
      logger.debug(`[useDropdownNavigation] Selecting item at index ${idx}`)
      onSelect(items.value[idx])
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (isOpen && !isOpen.value) return
    const len = items.value?.length ?? 0
    if (len === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (activeIndex.value < len - 1) activeIndex.value++
      else if (loop) activeIndex.value = 0
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (activeIndex.value > 0) activeIndex.value--
      else if (loop) activeIndex.value = len - 1
    } else if (e.key === 'Enter') {
      e.preventDefault()
      selectActive()
    } else if (e.key === 'Escape') {
      reset()
    }
  }

  // Usar useEventListener de VueUse para manejo seguro de eventos y SSR
  useEventListener(document, 'keydown', onKeydown)

  // reset when items change
  watch(items, () => reset())

  return { activeIndex, setActive: (i: number) => (activeIndex.value = i), reset, selectActive }
}
