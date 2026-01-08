<template>
  <div class="search-bar" :ref="(el) => (searchBar.containerRef.value = el as HTMLElement | null)">
    <SearchInput
      v-model="searchBar.localQuery.value"
      placeholder="Buscar productos..."
      @submit="searchBar.handleSubmit"
      @focus="searchBar.handleFocus"
      @blur="searchBar.handleBlur"
      @clear="searchBar.handleClear"
      @compositionstart="searchBar.onCompositionStart"
      @compositionend="searchBar.onCompositionEnd"
      :aria-activedescendant="searchBar.activeDescendant.value"
    />

    <SearchDropdown
      :visible="searchBar.showDropdown.value"
      :results="searchBar.results.value || []"
      :isLoading="searchBar.isLoading.value"
      :isError="searchBar.isError.value"
      :error="searchBar.error.value"
      :retry="searchBar.retry"
      @select="searchBar.handleProductSelection"
      @hover="searchBar.handleHover"
      :activeIndex="searchBar.activeIndex.value"
    />
  </div>
</template>

<script setup lang="ts">
import SearchDropdown from './SearchDropdown.vue'
import SearchInput from './SearchInput.vue'
import { useSearchBar } from '../composables/useSearchBar'

const searchBar = useSearchBar()
</script>

<style scoped>
.search-bar {
  position: relative;
  width: 100%;
  max-width: 400px;
}

/* Responsive */
@media (max-width: 640px) {
  .search-bar {
    max-width: 100%;
  }
}
</style>
