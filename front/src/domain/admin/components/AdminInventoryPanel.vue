<template>
  <section class="inv">
    <header class="inv__header">
      <div>
        <h2>Inventario</h2>
        <p class="inv__subtitle">
          Consulta stock y registra movimientos (aumentar, disminuir, reservar, liberar).
        </p>
      </div>
      <div class="inv__selectors">
        <label class="field">
          <span>Producto ID</span>
          <input type="number" v-model.number="productIdInput" min="1" placeholder="Ingresa ID" />
        </label>
        <button class="btn" type="button" @click="applyProductId">Cargar</button>
        <button
          class="btn btn--ghost"
          type="button"
          @click="applySelectedProduct"
          :disabled="!selectedProductId"
        >
          Usar producto seleccionado
        </button>
      </div>
    </header>

    <div class="inv__grid">
      <AdminInventoryStatsCard
        :product-id="productId"
        :inventory="inventory"
        :is-loading="isLoading"
      />

      <AdminInventoryMovementForm
        :form="form"
        :product-id="productId"
        :is-mutating="isMutating"
        @submit="submitMovement"
        @reset="resetForm"
      />
    </div>

    <AdminInventoryMovementsTable
      :movements="movements"
      :product-id="productId"
      :loading="movementsLoading"
    />
  </section>
</template>

<script setup lang="ts">
import {
  AdminInventoryMovementForm,
  AdminInventoryMovementsTable,
  AdminInventoryStatsCard,
} from './'
import { useAdminInventoryPanel } from '../composables'

const {
  productId,
  selectedProductId,
  productIdInput,
  inventory,
  movements,
  isLoading,
  movementsLoading,
  isMutating,
  form,
  applyProductId,
  applySelectedProduct,
  resetForm,
  submitMovement,
} = useAdminInventoryPanel()
</script>

<style scoped>
.inv {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.inv__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.inv__subtitle {
  margin: 4px 0 0;
  color: #475569;
}

.inv__selectors {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.inv__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
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
