//Provee un localValue con debounce nativo, manejo de IME (compositionstart/compositionend), flush() (forzar sincronización), clear() y stop() (limpiar timers).
// Diseñado para aceptar callbacks onFlush y onClear para sincronizar con un store o realizar side-effects.

import { ref, watch, type Ref, unref } from 'vue'
import { logger } from '../services/logger'

export function useBufferedInput(
  initial: string | Ref<string> | undefined,
  options: { debounceMs?: number; onFlush?: (v: string) => void; onClear?: () => void } = {}
) {
  const debounceMs = options.debounceMs ?? 200
  const onFlush = options.onFlush
  const onClear = options.onClear

  const localValue = ref<string>(unref(initial) || '')
  const isComposing = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null

  const stop = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  watch(localValue, (val) => {
    if (isComposing.value) return
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      logger.debug(`[useBufferedInput] Debounce flush: ${val}`)
      onFlush?.(val)
      timer = null
    }, debounceMs)
  })

  function flush() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    logger.debug(`[useBufferedInput] Manual flush: ${localValue.value}`)
    onFlush?.(localValue.value)
  }

  function clear() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    localValue.value = ''
    logger.debug('[useBufferedInput] Cleared')
    onClear?.()
  }

  function onCompositionStart() {
    isComposing.value = true
  }

  function onCompositionEnd() {
    isComposing.value = false
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    logger.debug(`[useBufferedInput] Composition end flush: ${localValue.value}`)
    onFlush?.(localValue.value)
  }

  return { localValue, isComposing, flush, clear, onCompositionStart, onCompositionEnd, stop }
}
