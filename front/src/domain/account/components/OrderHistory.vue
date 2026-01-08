<template>
  <section class="orders">
    <header class="orders__header">
      <div>
        <p class="orders__kicker">Tus compras</p>
        <h2>Historial de órdenes</h2>
        <p class="orders__sub">Revisa tus pedidos y accede a sus detalles.</p>
      </div>
      <RouterLink class="orders__link" to="/orders">Ver todas</RouterLink>
    </header>

    <div v-if="isLoading" class="orders__empty">
      <p>Cargando órdenes...</p>
    </div>
    <div v-else-if="isError" class="orders__empty">
      <p>No se pudieron cargar tus órdenes.</p>
    </div>
    <div v-else-if="!orders.length" class="orders__empty">
      <p>No hay órdenes recientes.</p>
      <small>Cuando compres, verás el resumen aquí.</small>
    </div>
    <ul v-else class="orders__list">
      <li v-for="order in orders" :key="order.id" class="orders__item">
        <div>
          <strong>#{{ order.id }}</strong>
          <p class="orders__meta">{{ formatDate(order.createdAt) }} · {{ order.status }}</p>
        </div>
        <div class="orders__total">${{ order.totalAmount?.toFixed(2) ?? '0.00' }}</div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { useOrders } from '@/domain/orders/composables/useOrders'

const { orders, isLoading, isError } = useOrders()

const formatDate = (iso: string) => new Date(iso).toLocaleDateString()
</script>

<style scoped>
.orders {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
}
.orders__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.orders__kicker {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.orders__sub {
  margin: 4px 0 0;
  color: #475569;
}
.orders__link {
  color: #0f766e;
  font-weight: 600;
}
.orders__empty {
  padding: 16px;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  color: #475569;
  background: #f8fafc;
}
</style>
