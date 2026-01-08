<template>
  <div class="card list">
    <header class="list__header">
      <h3>Listado</h3>
      <span class="pill" :class="{ 'pill--loading': isLoading || isFetching }">
        {{ categories.length }} items
      </span>
    </header>
    <div v-if="isLoading" class="list__empty">Cargando categorías...</div>
    <div v-else-if="categories.length === 0" class="list__empty">Sin categorías aún.</div>
    <ul v-else class="list__items">
      <li v-for="cat in categories" :key="cat.id" class="list__item">
        <div class="list__meta">
          <div class="list__title">{{ cat.title }}</div>
          <div class="list__subtitle">
            Slug: {{ cat.slug }} · Orden: {{ cat.sortOrder }} ·
            {{ cat.active ? 'Activa' : 'Inactiva' }}
          </div>
        </div>
        <div class="list__actions">
          <button class="btn btn--ghost" type="button" @click="$emit('edit', cat)">Editar</button>
          <button
            class="btn btn--danger"
            type="button"
            @click="$emit('delete', cat.id)"
            :disabled="isSaving"
          >
            Eliminar
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { AdminCategoryDTO } from '../interfaces'

interface Props {
  categories: AdminCategoryDTO[]
  isLoading: boolean
  isFetching: boolean
  isSaving: boolean
}

defineProps<Props>()
defineEmits<{ edit: [AdminCategoryDTO]; delete: [number] }>()
</script>

<style scoped>
.card {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  padding: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list__items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.list__title {
  font-weight: 600;
}

.list__subtitle {
  font-size: 13px;
  color: #475569;
}

.list__actions {
  display: flex;
  gap: 8px;
}

.list__empty {
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

.btn {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #0f172a;
  background: #0f172a;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--ghost {
  border-color: #cbd5e1;
  background: #fff;
  color: #0f172a;
}

.btn--danger {
  border-color: #dc2626;
  background: #ef4444;
  color: #fff;
}
</style>
