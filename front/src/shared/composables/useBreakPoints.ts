// Composable para manejar breakpoints responsive: mobile y desktop/PC.
// Refactorizado para usar VueUse's useBreakpoints + useWindowSize.
import { computed } from 'vue'
import { useBreakpoints as vueUseBreakpoints, useWindowSize } from '@vueuse/core'
import { SHARED_CONFIG } from '../config/shared.config'

export function useBreakPoints() {
  // Usar useWindowSize de VueUse para obtener dimensiones de ventana reactivas
  const { width } = useWindowSize()

  // Configurar breakpoints personalizados basados en SHARED_CONFIG
  const breakpoints = vueUseBreakpoints({
    mobile: SHARED_CONFIG.breakpoints.mobile,
    desktop: SHARED_CONFIG.breakpoints.desktop,
  })

  // windowWidth ahora es reactivo y nunca null (VueUse es SSR-safe)
  const windowWidth = computed(() => width.value)

  // isReady siempre es true con VueUse (maneja SSR internamente)
  const isReady = computed(() => true)

  // Usar los helpers de VueUse para determinar breakpoints
  const isMobile = breakpoints.smallerOrEqual('mobile')
  const isDesktop = breakpoints.greaterOrEqual('desktop')

  return {
    windowWidth,
    isReady,
    isMobile,
    isDesktop,
  }
}
