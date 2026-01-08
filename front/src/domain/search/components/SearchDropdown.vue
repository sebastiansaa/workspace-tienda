<template>
  <div
    v-if="visible"
    class="search-dropdown"
    @mousedown.prevent
    role="listbox"
    id="search-dropdown-list"
    :aria-expanded="visible"
  >
    <!-- Live region para accesibilidad (lectores de pantalla) -->
    <div aria-live="polite" aria-atomic="true" class="sr-only">
      <span v-if="isLoading">Cargando resultados...</span>
      <span v-else-if="props.isError">Error al cargar productos</span>
      <span v-else-if="results.length > 0">{{ results.length }} resultados encontrados</span>
      <span v-else-if="results.length === 0 && props.visible">No se encontraron productos</span>
    </div>

    <div v-if="isLoading" class="dropdown-loading">
      <Skeleton v-for="n in 4" :key="n" height="48px" />
    </div>

    <div v-else-if="props.isError" class="dropdown-error">
      <p class="error-title">Error al cargar productos</p>
      <p class="error-message">{{ displayErrorMessage }}</p>
      <div class="error-actions">
        <button type="button" class="dropdown-retry" @click="handleRetry">Reintentar</button>
      </div>
    </div>

    <div v-else-if="results && results.length > 0">
      <div
        v-for="(product, idx) in displayed"
        :key="product.id"
        @click="selectProduct(product)"
        @mouseenter="$emit('hover', idx)"
        :id="`search-item-${idx}`"
        :class="['dropdown-item', { 'is-active': idx === (props.activeIndex ?? -1) }]"
        role="option"
        :aria-selected="idx === (props.activeIndex ?? -1)"
        tabindex="-1"
      >
        <img :src="product.images[0]" :alt="product.title" class="dropdown-image" />
        <div class="dropdown-content">
          <div class="dropdown-title">{{ product.title }}</div>
          <div class="dropdown-price">${{ product.price }}</div>
        </div>
      </div>

      <div v-if="results.length > shownCount" class="dropdown-footer">
        <button type="button" class="dropdown-seeall" @click="increaseShown">
          <span class="dropdown-count">{{ results.length - shownCount }} más resultados...</span>
        </button>
      </div>
    </div>

    <div v-else class="dropdown-empty">
      <p class="empty-message">No se encontraron productos</p>
      <p class="empty-hint">Intenta con otro término de búsqueda</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductInterface } from '../../products/types'
import { Skeleton } from '@/shared/components/layout'
import { computed, toRef } from 'vue'
import { useSearchDropdown } from '../../../shared/composables'
import { SEARCH_CONFIG } from '../config/search.config'

interface Props {
  visible: boolean
  results: ProductInterface[]
  isLoading?: boolean
  isError?: boolean
  error?: unknown
  retry?: () => Promise<unknown>
  activeIndex?: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [product: ProductInterface]
  hover: [index: number]
}>()

const selectProduct = (product: ProductInterface) => {
  emit('select', product)
}

const displayErrorMessage = computed(() => {
  if (!props.error) return 'Ocurrió un error. Por favor intenta de nuevo.'

  // Manejo tipado del error
  if (props.error instanceof Error) {
    return props.error.message
  }

  if (typeof props.error === 'object' && props.error !== null && 'message' in props.error) {
    return String((props.error as { message: unknown }).message)
  }

  return String(props.error)
})

const handleRetry = async () => {
  try {
    if (props.retry) await props.retry()
  } catch (err) {
    console.error('Retry failed', err)
  }
}

const results = computed(() => props.results ?? [])
const isLoading = computed(() => props.isLoading ?? false)

const { displayed, increaseShown, shownCount } = useSearchDropdown(results, {
  initial: SEARCH_CONFIG.INITIAL_RESULTS_SHOWN,
  increment: SEARCH_CONFIG.RESULTS_INCREMENT,
  resetOn: toRef(props, 'visible'),
})
</script>

<style scoped>
.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  margin-top: 0.25rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f3f4f6;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: #f8fafc;
}

.dropdown-item.is-active {
  background: #eef2ff;
}

.dropdown-image {
  width: 3rem;
  height: 3rem;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.dropdown-content {
  flex: 1;
  min-width: 0;
}

.dropdown-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-price {
  font-size: 0.75rem;
  font-weight: 600;
  color: #059669;
}

.dropdown-footer {
  padding: 0.5rem 1rem;
  border-top: 1px solid #f3f4f6;
  text-align: center;
}

.dropdown-count {
  font-size: 0.75rem;
  color: #6b7280;
}

.dropdown-empty {
  padding: 2rem 1rem;
  text-align: center;
}

.empty-message {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-hint {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 640px) {
  .search-dropdown {
    max-height: 300px;
  }

  .dropdown-item {
    padding: 0.5rem 0.75rem;
  }

  .dropdown-image {
    width: 2.5rem;
    height: 2.5rem;
  }
}

/* Error state styles */
.dropdown-error {
  padding: 2rem 1rem;
  text-align: center;
}

.error-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #dc2626;
  margin-bottom: 0.5rem;
}

.error-message {
  font-size: 0.8125rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.error-actions {
  display: flex;
  justify-content: center;
}

.dropdown-retry {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-retry:hover {
  background: #2563eb;
}

.dropdown-retry:active {
  background: #1d4ed8;
}

/* Screen reader only - para live region de accesibilidad */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
