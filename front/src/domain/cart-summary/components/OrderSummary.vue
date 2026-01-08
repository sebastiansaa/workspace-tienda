<template>
  <div class="order-summary">
    <h2>Resumen del pedido</h2>
    <div v-if="!items || items.length === 0" class="empty">Tu carrito está vacío.</div>
    <ul v-else class="items-list">
      <CartItemRow
        v-for="it in items"
        :key="it.product?.id ?? it.productId"
        :item="it"
        @remove="$emit('remove', $event)"
      />
    </ul>
    <div class="total">
      Total: <strong>{{ formatPrice(total) }}</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { CartItem } from '@/domain/cart/types'
import CartItemRow from './CartItemRow.vue'
import { formatPrice } from '@/shared/helpers/formatPrice'

const props = defineProps<{ items: CartItem[]; total: number }>()
</script>

<style scoped>
.order-summary {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.items-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.total {
  margin-top: 1rem;
}
.empty {
  color: #666;
}
</style>
