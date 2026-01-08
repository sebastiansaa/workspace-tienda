<template>
  <div class="product-main">
    <ProductMainDesktop v-if="isReady && isDesktop" />
    <ProductMainMobile v-else-if="isReady && !isDesktop" />
    <Skeleton v-else height="220px" />
  </div>
</template>

<script setup lang="ts">
import ProductMainMobile from './ProductMainMobile.vue'
import ProductMainDesktop from './ProductMainDesktop.vue'

import { useBreakPoints } from '@/shared/composables'
import { Skeleton } from '@/shared/components/layout'

const { isDesktop, isReady } = useBreakPoints()
</script>

<style scoped>
.product-main {
  width: 100%;
}
</style>
