<template>
  <div class="orders-list">
    <h1>Tus órdenes</h1>

    <div class="success-message" v-if="showSuccess">
      <div class="icon">✓</div>
      <div>
        <h2>¡Pago realizado con éxito!</h2>
        <p>Tu orden ha sido confirmada. Pronto recibirás un email con los detalles.</p>
      </div>
    </div>

    <div class="orders-container">
      <div v-if="orders && orders.length === 0" class="empty-state">
        <p>No tienes órdenes todavía.</p>
        <router-link to="/" class="btn primary">Ir a comprar</router-link>
      </div>

      <div v-else>
        <OrderCard v-for="order in orders" :key="order.id" :order="order" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Order } from '../interfaces/types'
import OrderCard from './OrderCard.vue'

defineProps({
  orders: { type: Array as PropType<Order[]>, required: true },
  showSuccess: { type: Boolean, required: false },
})
</script>

<style scoped>
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 100%;
  padding: 0.5rem 0;
  box-sizing: border-box;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f0f9f0;
  border: 1px solid #0a8a0a;
  border-radius: 12px;
  padding: 1.25rem;
  margin: 0 1.25rem 1rem 1.25rem; /* Margin to align with cards if they have margin, or just padding */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.orders-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin: 0 1.25rem;
}

h1 {
  margin: 0 1.25rem;
  font-size: 1.5rem;
  color: #333;
}

/* Tablet vertical: más espacio */
@media (min-width: 600px) and (max-width: 1023px) {
  .orders-list {
    gap: 1.5rem;
    padding: 1rem 0;
  }
}
</style>
