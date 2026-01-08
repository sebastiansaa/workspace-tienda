// Detecta clicks/touches fuera de un elemento contenedor y ejecuta una callback.
// Refactorizado para usar VueUse's onClickOutside + useEventListener.
//
// Nota: VueUse's onClickOutside usa 'pointerdown' por defecto, que cubre tanto
// clicks de mouse como touch events en dispositivos móviles.
import type { Ref } from 'vue'
import { onClickOutside as vueUseClickOutside, useEventListener } from '@vueuse/core'
import { logger } from '../services/logger'

export function useClickOutside(
  containerRef: Ref<HTMLElement | null>,
  onOutside: () => void,
  opts: { listenToEscape?: boolean; events?: string[] } = {}
) {
  const listenToEscape = opts.listenToEscape ?? true

  // Usar onClickOutside de VueUse para detección de clicks fuera
  // VueUse maneja automáticamente pointerdown (mouse + touch)
  const stopClickOutside = vueUseClickOutside(containerRef, () => {
    logger.debug('[useClickOutside] Click outside detected')
    onOutside()
  })

  // Manejar Escape key si está habilitado
  let stopEscape: (() => void) | undefined
  if (listenToEscape) {
    stopEscape = useEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        logger.debug('[useClickOutside] Escape key detected')
        onOutside()
      }
    })
  }

  function stop() {
    stopClickOutside()
    stopEscape?.()
  }

  return { stop }
}
