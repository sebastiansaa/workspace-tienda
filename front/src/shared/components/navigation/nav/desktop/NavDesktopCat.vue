<template>
  <div class="nav-desktop-cat">
    <BaseAccountButton
      v-for="cat in categories"
      :key="cat.id"
      class="base-btn-nav-desktop-cat"
      :class="{ active: cat.id === selectedCategory }"
      @click="selectCategory(cat.id)"
    >
      {{ getCategoryLabel(cat.name.toLowerCase()) }}
    </BaseAccountButton>
  </div>
</template>

<script setup lang="ts">
import { BaseAccountButton } from '@/shared/components/ui/actions/buttons'
import { useNavigation } from '@/shared/composables/useNavigation'
import { useCategories } from '@/domain/products/app/hooks/useCategories'
import { getCategoryLabel } from '@/shared/helpers'

const { categories } = useCategories()
const { handleCategory, navStore } = useNavigation()
const selectedCategory = navStore.selectedCategory

function selectCategory(categoryId: number) {
  handleCategory(categoryId)
}
</script>

<style scoped>
.nav-desktop-cat {
  display: none;
}

@media (min-width: 768px) {
  .nav-desktop-cat {
    display: flex;
    justify-content: space-between;
    gap: 3rem;
    background: #e0dacf;
    border-bottom: 1px solid #e0e7ef;
    border-radius: 18px;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    position: sticky;
    top: 62px;
    z-index: 1999;
    padding: 0.5rem 1rem;
    box-sizing: border-box;
  }
}
.base-btn-nav-desktop-cat {
  font-size: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  background: #e0dacf;
  color: #222;
  border: none;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}
.base-btn-nav-desktop-cat:hover,
.base-btn-nav-desktop-cat.active {
  background: #ececec;
  color: #181818;
}
</style>
