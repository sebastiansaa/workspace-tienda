<template>
  <div class="payment-page">
    <section class="payment-body">
      <OrderSummary :items="items" :total="total" @remove="handleRemove" />

      <div class="right-col">
        <PaymentActions
          :disabled="!canBeginPayment"
          :productId="productIdString"
          @pay="goToCheckout"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cartStore } from '@/domain/cart/stores/cartStore'
import { usePaymentNavigation } from '../composables/usePaymentNavigation'

import OrderSummary from '../components/OrderSummary.vue'
import PaymentActions from '../components/PaymentActions.vue'

const cart = cartStore()
const { items, productId, productIdString, canBeginPayment, goToCheckout } = usePaymentNavigation()
const total = computed(() => cart.totalPrice)

function handleRemove(id: number) {
  cart.removeFromCart(id)
}
</script>

<style scoped>
.payment-page {
  padding: 1.25rem;
}
.payment-header h1 {
  margin: 0 0 1rem 0;
}
.payment-body {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
}
.order-summary {
  flex: 1;
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
.item {
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
.total {
  margin-top: 1rem;
}
.payment-actions {
  width: 220px;
}
.pay-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.pay-btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.success {
  margin-top: 0.75rem;
  color: #0a8a0a;
}
.empty {
  color: #666;
}

@media (max-width: 800px) {
  .payment-body {
    flex-direction: column;
  }
  .payment-actions {
    width: 100%;
  }
}
</style>
