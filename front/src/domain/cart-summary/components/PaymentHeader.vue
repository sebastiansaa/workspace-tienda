<template>
  <header class="payment-header">
    <h1>{{ title }}</h1>
  </header>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{ title?: string }>()
const title = props.title ?? 'Pagar'
</script>

<style scoped>
.payment-header h1 {
  margin: 0 0 1rem 0;
}
</style>
