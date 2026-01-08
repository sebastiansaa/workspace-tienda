<template>
  <form class="card form" @submit.prevent="$emit('submit')">
    <header class="card__header">
      <h3>{{ editingId ? 'Editar categoría' : 'Nueva categoría' }}</h3>
    </header>
    <div class="form__row">
      <label>Título</label>
      <input v-model="form.title" type="text" required />
    </div>
    <div class="form__row">
      <label>Slug</label>
      <input v-model="form.slug" type="text" required />
    </div>
    <div class="form__row">
      <label>Imagen (URL)</label>
      <input v-model="form.image" type="text" placeholder="https://..." />
    </div>
    <div class="form__row">
      <label>Descripción</label>
      <textarea v-model="form.description" rows="3" />
    </div>
    <div class="form__row form__row--inline">
      <label>Orden</label>
      <input v-model.number="form.sortOrder" type="number" min="0" />
      <label class="checkbox"> <input v-model="form.active" type="checkbox" /> Activa </label>
    </div>
    <div class="form__actions">
      <button class="btn" type="submit" :disabled="isSaving">
        {{ editingId ? 'Actualizar' : 'Crear' }}
      </button>
      <button class="btn btn--ghost" type="button" @click="$emit('reset')" :disabled="isSaving">
        Cancelar
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { CreateCategoryDto } from '../interfaces'

interface Props {
  form: CreateCategoryDto & { id?: number }
  editingId: number | null
  isSaving: boolean
}

const props = defineProps<Props>()
defineEmits<{ submit: []; reset: [] }>()
</script>

<style scoped>
.card {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  padding: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form__row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form__row--inline {
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.form__row input,
.form__row textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
}

.form__actions {
  display: flex;
  gap: 8px;
}

.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 6px;
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
</style>
