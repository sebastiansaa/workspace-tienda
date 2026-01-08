/**
 * Calcula dinámicamente la altura del header y actualiza la CSS custom property (--header-offset).
 * Refactorizado para usar VueUse's useElementBounding + useDebounceFn.
 * NO ESTA SIENDO USADO POR AHORA, PERO ES UN BUEN EJEMPLO DE CALCULAR Y MODIFICAR CSS CON JS
 */
import { ref, watch, onMounted } from 'vue'
import { useElementBounding, useDebounceFn } from '@vueuse/core'

export function useHeaderOffset(options?: { selector?: string; debounceMs?: number }) {
  const selector = options?.selector ?? 'header'
  const debounceMs = options?.debounceMs ?? 100

  const headerEl = ref<HTMLElement | null>(null)

  // Usar useElementBounding de VueUse para obtener dimensiones reactivas
  const { height } = useElementBounding(headerEl)

  // Función para actualizar la variable CSS
  const setVar = (px: number) => {
    try {
      document.documentElement.style.setProperty('--header-offset', `${px}px`)
    } catch (e) {
      // sin operación (seguridad para SSR)
    }
  }

  // Debounce de la actualización usando useDebounceFn de VueUse
  const debouncedSetVar = useDebounceFn((h: number) => {
    setVar(Math.ceil(h || 62)) // valor por defecto si height es 0
  }, debounceMs)

  // Watch height y actualizar CSS variable
  watch(height, (h) => {
    debouncedSetVar(h)
  }, { immediate: true })

  onMounted(() => {
    // Obtener el elemento header del DOM
    headerEl.value = document.querySelector(selector) as HTMLElement | null

    // Si no se encuentra el elemento, establecer valor por defecto
    if (!headerEl.value) {
      setVar(62)
    }
  })

  // Retorna control opcional para recomputar manualmente
  return {
    recompute: () => setVar(height.value),
  }
}
