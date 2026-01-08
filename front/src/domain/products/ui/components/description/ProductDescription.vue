<template>
  <div class="product-description">
    <ProductDescriptionDesktop v-if="isReady && isDesktop" />
    <ProductDescriptionMobile v-else-if="isReady && !isDesktop" />
    <Skeleton v-else height="120px" />
  </div>
</template>

<script setup lang="ts">
import ProductDescriptionDesktop from './ProductDescriptionDesktop.vue'
import ProductDescriptionMobile from './ProductDescriptionMobile.vue'
import { useBreakPoints } from '@/shared/composables'
import { Skeleton } from '@/shared/components/layout'

const { isDesktop, isReady } = useBreakPoints()
</script>

<style scoped></style>
