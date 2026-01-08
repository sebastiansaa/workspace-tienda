import { ref, computed, watch, type Ref } from 'vue'
import { logger } from '../services/logger'

interface Options {
  initial?: number
  increment?: number
  resetOn?: Ref<unknown> | undefined
}

// Composable genérico para manejar paginación incremental en dropdowns/listas.
// @param resultsRef - Ref con el array de items a paginar
// @param opts - Opciones de configuración (initial, increment, resetOn)
// @returns displayed, increaseShown, reset, shownCount
export function useSearchDropdown<T>(resultsRef: Ref<T[]>, opts: Options = {}) {
  const INITIAL = opts.initial ?? 5
  const INCREMENT = opts.increment ?? 5

  const shownCount = ref(INITIAL)

  const results = computed(() => resultsRef.value ?? [])

  const displayed = computed(() => results.value.slice(0, shownCount.value))

  const increaseShown = () => {
    const remain = results.value.length - shownCount.value
    if (remain <= 0) return
    shownCount.value = Math.min(shownCount.value + INCREMENT, results.value.length)
    logger.debug(`[useSearchDropdown] Increased shown count to ${shownCount.value}`)
  }

  const reset = () => {
    shownCount.value = INITIAL
    logger.debug('[useSearchDropdown] Reset shown count')
  }

  // Resetear cuando cambian los resultados
  watch(() => resultsRef.value, () => reset(), { deep: true })

  // Resetear cuando cambia el trigger externo (ej: visible)
  if (opts.resetOn) {
    watch(() => opts.resetOn!.value, (newVal) => {
      if (!newVal) reset()
    })
  }

  return {
    shownCount,
    displayed,
    increaseShown,
    reset,
  }
}

export default useSearchDropdown
