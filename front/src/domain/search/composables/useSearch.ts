// store para busqueda global de productos por título
// con debounce y min de char para realizar la búsqueda

import { computed, ref, unref, type Ref } from "vue";
import { watchDebounced } from '@vueuse/core'
import { useSearchStore } from "../stores/searchStore"
import { SEARCH_CONFIG } from "../config/search.config";
import { logger } from "../../../shared/services/logger";
import { productsApi } from "@/domain/products/api/productsApi";
import { mapProductListDTO } from "@/domain/products/app/usecases/mapperBackendShapeProduct";
import type { ProductInterface } from "@/domain/products/types";

//"{ debounceMs }" => el retardo antes de lanzar búsqueda
// minChars puede ser un number o un Ref<number> para permitir reactividad desde fuera
export const useSearch = ({
  debounceMs = SEARCH_CONFIG.DEBOUNCE_MS as number,
  minChars = SEARCH_CONFIG.MIN_CHARS as number | Ref<number>
} = {}) => {

  const searchStore = useSearchStore();

  // debouncedTerm evita lanzar filtros en cada pulsación
  const debouncedTerm = ref(unref(searchStore.searchTerm));

  const isLoading = ref(false);
  const isError = ref(false);
  const error = ref<string | null>(null);
  const resultsState = ref<ProductInterface[]>([]);
  const totalState = ref(0);

  // Actualiza debouncedTerm con retardo usando watchDebounced de VueUse
  watchDebounced(
    () => searchStore.searchTerm,
    (val) => {
      debouncedTerm.value = unref(val);
      logger.debug(`[useSearch] Debounced term updated: ${debouncedTerm.value}`);
      triggerSearch();
    },
    { debounce: debounceMs }
  );

  const normalizedTerm = computed(() => debouncedTerm.value?.trim() ?? '');
  const enabled = computed(() => normalizedTerm.value.length >= unref(minChars));

  const results = computed(() => resultsState.value.slice(0, SEARCH_CONFIG.INITIAL_RESULTS_SHOWN));
  const total = computed(() => totalState.value);

  const retry = () => {
    logger.info('[useSearch] Retry called');
    return triggerSearch();
  };

  const triggerSearch = async () => {
    if (!enabled.value) {
      resultsState.value = [];
      totalState.value = 0;
      isLoading.value = false;
      isError.value = false;
      error.value = null;
      return [] as ProductInterface[];
    }
    try {
      isLoading.value = true;
      isError.value = false;
      error.value = null;
      const resp = await productsApi.search(normalizedTerm.value);
      const { products, total } = mapProductListDTO(resp.data);
      resultsState.value = products;
      totalState.value = total;
      logger.debug('[useSearch] Search results fetched', { total });
      return products;
    } catch (err: unknown) {
      isError.value = true;
      const message = err instanceof Error ? err.message : 'Error al buscar productos';
      error.value = message;
      resultsState.value = [];
      totalState.value = 0;
      logger.error('[useSearch] Search failed', { error: message });
      return [] as ProductInterface[];
    } finally {
      isLoading.value = false;
    }
  };

  const setSearchTerm = (term: string) => {
    searchStore.setSearchTerm(term);
  };

  const clearSearch = () => {
    logger.debug('[useSearch] Clearing search');
    searchStore.resetStore();
  };

  return {
    results,
    total,
    isLoading: computed(() => isLoading.value),
    isError: computed(() => isError.value),
    error: computed(() => error.value),
    retry,
    searchTerm: computed(() => searchStore.searchTerm),
    setSearchTerm,
    clearSearch
  };
}
