<template>
  <div class="card">
    <header class="card__header">
      <h3>Stock actual</h3>
      <span class="pill" :class="{ 'pill--loading': isLoading }">
        {{ productId ? `ID ${productId}` : 'Sin selección' }}
      </span>
    </header>
    <div v-if="isLoading" class="card__empty">Cargando...</div>
    <div v-else-if="!productId || !inventory" class="card__empty">Selecciona un producto.</div>
    <div v-else class="stats">
      <div class="stat">
        <p class="stat__label">On hand</p>
        <p class="stat__value">{{ inventory.onHand }}</p>
      </div>
      <div class="stat">
        <p class="stat__label">Reservado</p>
        <p class="stat__value">{{ inventory.reserved }}</p>
      </div>
      <div class="stat">
        <p class="stat__label">Disponible</p>
        <p class="stat__value">{{ inventory.available }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminInventoryDTO } from '../interfaces'

defineProps<{
  productId: number | null
  inventory: AdminInventoryDTO | null
  isLoading: boolean
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

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
}

.stat {
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.stat__label {
  margin: 0 0 4px;
  color: #64748b;
  font-size: 13px;
}

.stat__value {
  margin: 0;
  font-weight: 700;
  font-size: 18px;
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
</style>
