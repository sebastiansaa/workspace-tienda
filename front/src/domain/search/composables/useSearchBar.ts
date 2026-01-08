/** Composable que orquesta toda la lógica del SearchBar.
 * Encapsula: búsqueda, buffering, dropdown visibility, navegación, click outside, etc. */

import { ref, computed, onBeforeUnmount } from 'vue'
import { useSearch } from './useSearch'
import { useProductNavigation } from '../../products/app/hooks'
import type { ProductInterface } from '../../products/types'
import {
  useClickOutside,
  useBufferedInput,
  useDropdownNavigation,
} from '../../../shared/composables'
import { SEARCH_CONFIG } from '../config/search.config'
import { logger } from '../../../shared/services/logger'

export function useSearchBar() {
  // ===== Estado =====
  const containerRef = ref<HTMLElement | null>(null)
  const showDropdown = ref(false)

  // ===== Lógica de Búsqueda y Datos =====
  const {
    searchTerm: searchTermRef,
    setSearchTerm,
    clearSearch,
    results,
    isLoading,
    isError,
    error,
    retry,
  } = useSearch({ debounceMs: 0 }) // sin debounce aquí, delegado a useBufferedInput

  // ===== Navegación =====
  const { navigateToProduct } = useProductNavigation()

  // ===== Input con Buffer (debounce + IME) =====
  const buffered = useBufferedInput(searchTermRef, {
    debounceMs: SEARCH_CONFIG.DEBOUNCE_MS,
    onFlush: (term) => {
      logger.debug(`[useSearchBar] Flushing buffered input: ${term}`)
      setSearchTerm(term)
    },
    onClear: () => {
      logger.debug('[useSearchBar] Clearing buffered input')
      clearSearch()
    },
  })

  // ===== Detección de Click Fuera =====
  const clickOutside = useClickOutside(
    containerRef,
    () => {
      if (showDropdown.value) {
        logger.debug('[useSearchBar] Click outside detected, closing dropdown')
        showDropdown.value = false
      }
    },
    { listenToEscape: true },
  )

  // ===== Navegación por Teclado =====
  const dropdownNav = useDropdownNavigation(
    results,
    (item: ProductInterface) => {
      handleProductSelection(item)
    },
    { isOpen: showDropdown },
  )

  // ===== Propiedades Computadas =====
  const activeDescendant = computed(() => {
    const idx = dropdownNav.activeIndex?.value ?? -1
    return idx >= 0 ? `search-item-${idx}` : undefined
  })

  const activeIndex = computed(() => dropdownNav.activeIndex?.value ?? -1)

  const hasResults = computed(() => results.value.length > 0)
  const ariaExpanded = computed(() => showDropdown.value)

  // ===== Manejadores de Eventos =====
  const resetSearchBar = () => {
    logger.debug('[useSearchBar] Reseteando barra de búsqueda')
    showDropdown.value = false
    clearSearch()
    buffered.clear()
  }

  const handleFocus = (): void => {
    logger.debug('[useSearchBar] Input enfocado')
    showDropdown.value = true
  }

  const handleBlur = (): void => {
    buffered.flush()
  }

  const handleSubmit = (): void => {
    logger.debug('[useSearchBar] Submit disparado')
    if (isError.value) {
      logger.error('[useSearchBar] Intento de submit con error activo', error.value)
    }
    buffered.flush()
    showDropdown.value = true
  }

  const handleClear = (): void => {
    logger.debug('[useSearchBar] Clear disparado')
    buffered.clear()
  }

  const handleProductSelection = (product: ProductInterface): void => {
    logger.info(`[useSearchBar] Producto seleccionado: ${product.id} - ${product.title}`)
    navigateToProduct(product)
    resetSearchBar()
  }

  const handleHover = (index: number): void => {
    dropdownNav.setActive(index)
  }

  // Ciclo de Vida
  onBeforeUnmount(() => {
    clickOutside.stop()
    buffered.stop()
    // dropdownNav se limpia internamente
  })

  //  API Pública
  return {
    // Refs
    containerRef,
    showDropdown,

    // Input state
    localQuery: buffered.localValue,
    isComposing: buffered.isComposing,

    // Search state
    results,
    hasResults,
    isLoading,
    isError,
    error,
    retry,

    // Navigation state
    activeDescendant,
    activeIndex,
    ariaExpanded,

    // Event handlers
    handleFocus,
    handleBlur,
    handleSubmit,
    handleClear,
    handleProductSelection,
    handleHover,
    onCompositionStart: buffered.onCompositionStart,
    onCompositionEnd: buffered.onCompositionEnd,
  }
}
