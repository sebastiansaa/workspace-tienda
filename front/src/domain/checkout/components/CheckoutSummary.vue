<template>
  <div class="checkout-summary">
    <OrderSummary :items="items" :total="total" @remove="handleRemove" />
  </div>
</template>

<script setup lang="ts">
import OrderSummary from '@/domain/cart-summary/components/OrderSummary.vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{ items: any[]; total: number }>()
const emit = defineEmits(['remove'])

function handleRemove(id: number) {
  emit('remove', id)
}
</script>

<style scoped>
.checkout-summary {
  flex: 1;
}
</style>
