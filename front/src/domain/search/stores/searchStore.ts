import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { logger } from "@/shared/services/logger";

export const useSearchStore = defineStore('search', () => {
  // Estado interno (privado)
  const _searchTerm = ref<string>('');

  // Getters (computed)
  const searchTerm = computed(() => _searchTerm.value);
  const hasSearch = computed(() => _searchTerm.value.trim().length > 0);

  // Actions
  const setSearchTerm = (term: string) => {
    const normalized = term.trim();
    logger.debug(`[searchStore] setSearchTerm: ${normalized}`);
    _searchTerm.value = normalized;
  };

  const resetStore = () => {
    logger.debug('[searchStore] resetStore');
    _searchTerm.value = '';
  };

  return {
    // Getters (readonly computed)
    searchTerm,
    hasSearch,
    // Actions
    setSearchTerm,
    resetStore,
  };
});
