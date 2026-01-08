<template>
  <div>
    <Productsgrid v-if="!isLoading" />
    <GridComponent v-else class="product-grid">
      <Skeleton v-for="n in 6" :key="n" height="260px" customClass="card-skeleton" />
    </GridComponent>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Productsgrid from '../components/Productsgrid.vue'
import { useProducts } from '../../app/hooks'
import { useNavStore } from '@/stores'
import GridComponent from '@/shared/components/layout/GridComponent.vue'
import { Skeleton } from '@/shared/components/layout'

const route = useRoute()
const categoryId = computed(() => Number(route.params.categoryId))
const { data: productsResponse, isLoading } = useProducts()
const navStore = useNavStore()

watch(
  categoryId,
  (newCategoryId) => {
    navStore.setCategory(newCategoryId)
  },
  { immediate: true },
)
</script>

<style scoped></style>
