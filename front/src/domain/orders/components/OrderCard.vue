<template>
  <div class="order-card">
    <div class="order-header">
      <div class="order-info">
        <h3>Orden #{{ order.id }}</h3>
        <span class="order-date">{{ formatDate(order.createdAt) }}</span>
      </div>
      <div class="order-status" :class="order.status">{{ getStatusLabel(order.status) }}</div>
    </div>

    <div class="order-items">
      <div v-for="item in order.items" :key="item.productId" class="order-item">
        <div class="item-details">
          <p class="item-title">Producto #{{ item.productId }}</p>
          <p class="item-quantity">Cantidad: {{ item.quantity }}</p>
        </div>
        <div class="item-price">{{ formatPrice(item.lineTotal) }}</div>
      </div>
    </div>

    <div class="order-footer">
      <div class="order-total"><strong>Total:</strong> {{ formatPrice(order.totalAmount) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Order } from '../interfaces/types'
import { formatDate, getStatusLabel } from '../helpers/formatters'
import { formatPrice } from '@/shared/helpers/formatPrice'

defineProps({
  order: { type: Object as PropType<Order>, required: true },
})
</script>

<style scoped>
.order-card {
  padding: 1.25rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  /* Margin to simulate the spacing in mobile view if not handled by parent gap */
}
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}
.order-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}
.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #eee;
}
.item-details {
  flex: 1;
}
.item-title {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-weight: 500;
}
.item-quantity {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
}
.item-price {
  font-weight: 600;
}
.order-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}
</style>
