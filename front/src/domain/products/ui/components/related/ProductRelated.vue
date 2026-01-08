<template>
  <div class="product-related">
    <ProductRelatedDesktop v-if="isReady && isDesktop" />
    <ProductRelatedMobile v-else-if="isReady && !isDesktop" />
    <Skeleton v-else height="140px" />
  </div>
</template>

<script setup lang="ts">
import ProductRelatedDesktop from './ProductRelatedDesktop.vue'
import ProductRelatedMobile from './ProductRelatedMobile.vue'
import { useBreakPoints } from '@/shared/composables'
import { Skeleton } from '@/shared/components/layout'
const { isDesktop, isReady } = useBreakPoints()
</script>

<style scoped>
.product-related {
  width: 100%;
}
</style>
