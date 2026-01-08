<template>
  <div>
    <NavMobile v-if="isReady && isMobile" />
    <NavDesktop v-else-if="isReady && !isMobile" />
    <Skeleton v-else />
    <div class="nav-content">
      <slot />
    </div>
    <!-- Mini cart drawer global -->
    <MiniCartDrawer />
  </div>
</template>

<script setup lang="ts">
import NavDesktop from './desktop/NavDesktop.vue'
import NavMobile from './mobile/NavMobile.vue'
import { useBreakPoints } from '@/shared/composables'
import { Skeleton } from '@/shared/components/layout'
import MiniCartDrawer from '@/domain/cart/components/miniCartDrawer.vue'

const { isMobile, isReady } = useBreakPoints()
</script>

<style scoped></style>
