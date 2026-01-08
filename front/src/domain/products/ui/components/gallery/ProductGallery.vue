<template>
  <div class="product-gallery">
    <ProductGalleryDesktop v-if="isReady && isDesktop" />
    <ProductGalleryMobile v-else-if="isReady && !isDesktop" />
    <Skeleton v-else height="160px" />
  </div>
</template>

<script setup lang="ts">
import ProductGalleryDesktop from './ProductGalleryDesktop.vue'
import ProductGalleryMobile from './ProductGalleryMobile.vue'
import { useBreakPoints } from '@/shared/composables'
import { Skeleton } from '@/shared/components/layout'
const { isDesktop, isReady } = useBreakPoints()
</script>

<style scoped>
.product-gallery {
  width: 100%;
}
</style>
