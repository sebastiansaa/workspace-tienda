import { storeToRefs } from 'pinia'
import { usePasswordToggleStore } from '../../stores/passwordToggleStore'

/**
 * Composable para manejar la visibilidad de contraseñas usando Pinia.
 * El estado es global y persistente.
 */
export function usePasswordToggle() {
  const store = usePasswordToggleStore()
  const { isVisible } = storeToRefs(store)
  const { toggleVisibility, setVisibility } = store

  return {
    isVisible,
    toggleVisibility,
    setVisibility,
  }
}
