<template>
  <div class="card">
    <header class="card__header">
      <h3>Movimientos</h3>
      <span class="pill" :class="{ 'pill--loading': loading }"
        >{{ movements.length }} registros</span
      >
    </header>
    <div v-if="loading" class="card__empty">Cargando movimientos...</div>
    <div v-else-if="!productId" class="card__empty">Selecciona un producto.</div>
    <div v-else-if="movements.length === 0" class="card__empty">Sin movimientos.</div>
    <table v-else class="table">
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Razón</th>
          <th>Cant.</th>
          <th>On hand</th>
          <th>Reservado</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in movements" :key="m.id">
          <td>{{ m.type }}</td>
          <td>{{ m.reason }}</td>
          <td>{{ m.quantity }}</td>
          <td>{{ m.onHandAfter }}</td>
          <td>{{ m.reservedAfter }}</td>
          <td>{{ new Date(m.createdAt).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { AdminInventoryMovementDTO } from '../interfaces'

defineProps<{
  movements: AdminInventoryMovementDTO[]
  productId: number | null
  loading: boolean
}>()
</script>

<style scoped>
.card {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  padding: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.card__empty {
  padding: 12px;
  color: #475569;
}

.pill {
  padding: 4px 8px;
  border-radius: 999px;
  background: #e2e8f0;
  color: #0f172a;
  font-size: 12px;
}

.pill--loading {
  background: #cbd5e1;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table th,
.table td {
  padding: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.table th {
  text-align: left;
  color: #475569;
}
</style>
