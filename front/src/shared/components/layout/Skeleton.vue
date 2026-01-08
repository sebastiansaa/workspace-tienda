<template>
  <div
    :class="['shared-skeleton', customClass]"
    :style="{
      height: height,
      width: width,
      borderRadius: radius,
    }"
    aria-busy="true"
  />
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  height: { type: String, default: '16px' },
  width: { type: String, default: '100%' },
  radius: { type: String, default: '8px' },
  customClass: { type: String, default: '' },
})

const { height, width, radius, customClass } = props
</script>

<style scoped>
.shared-skeleton {
  display: block;
  background: linear-gradient(90deg, #eeeeee 25%, #f5f5f5 50%, #eeeeee 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s linear infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
