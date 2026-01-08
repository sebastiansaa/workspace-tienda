<template>
  <li class="cart-item-row">
    <img v-if="item.product?.images?.length" :src="item.product.images[0]" alt="" class="thumb" />
    <div class="meta">
      <div class="title">{{ item.product?.title ?? 'Producto' }}</div>
      <div class="qty">x{{ item.quantity }}</div>
    </div>
    <div class="price">{{ formatPrice(item.price ?? item.product?.price ?? 0) }}</div>
    <button
      class="remove"
      @click="$emit('remove', item.productId ?? item.product?.id)"
      aria-label="Eliminar"
    >
      ×
    </button>
  </li>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { CartItem } from '@/domain/cart/types'
import { formatPrice } from '@/shared/helpers/formatPrice'

const props = defineProps<{ item: CartItem }>()
</script>

<style scoped>
.cart-item-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}
.thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
}
.meta {
  flex: 1;
}
.title {
  font-size: 0.95rem;
}
.qty {
  font-size: 0.85rem;
  color: #666;
}
.price {
  white-space: nowrap;
  margin-left: 0.5rem;
}
.remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  margin-left: 0.5rem;
}
</style>
