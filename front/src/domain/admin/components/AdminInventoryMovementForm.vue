<template>
  <form class="card form" @submit.prevent="$emit('submit')">
    <header class="card__header">
      <h3>Movimiento</h3>
    </header>
    <div class="form__row">
      <label>Cantidad</label>
      <input v-model.number="form.quantity" type="number" min="1" required />
    </div>
    <div class="form__row">
      <label>Razón</label>
      <input v-model="form.reason" type="text" required />
    </div>
    <div class="form__row">
      <label>Tipo</label>
      <select v-model="form.type">
        <option value="INCREASE">Aumentar</option>
        <option value="DECREASE">Disminuir</option>
        <option value="RESERVE">Reservar</option>
        <option value="RELEASE">Liberar</option>
      </select>
    </div>
    <div class="form__actions">
      <button class="btn" type="submit" :disabled="!productId || isMutating">Aplicar</button>
      <button class="btn btn--ghost" type="button" @click="$emit('reset')" :disabled="isMutating">
        Limpiar
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { AdjustStockDto } from '../interfaces'

defineProps<{
  form: AdjustStockDto
  productId: number | null
  isMutating: boolean
}>()

defineEmits<{
  submit: []
  reset: []
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

.form__row input,
.form__row select {
  padding: 8px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
}

.form__actions {
  display: flex;
  gap: 8px;
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
