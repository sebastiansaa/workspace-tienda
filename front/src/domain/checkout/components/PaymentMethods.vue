<template>
  <div class="payment-methods">
    <h3>Método de pago</h3>
    <div class="method" v-for="m in methods" :key="m.id">
      <label class="method-toggle">
        <input type="radio" :value="m.id" v-model="selected" />
        <strong>{{ m.label }}</strong>
      </label>
      <div class="method-body">
        <p v-if="m.id === 'card'">Usa tu tarjeta de crédito. (Formulario detallado pendiente.)</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue'

const emit = defineEmits(['select'])

const methods = [{ id: 'card', label: 'Tarjeta de crédito' }]

const selected = ref<string | null>(methods[0]?.id ?? null)

watch(
  selected,
  (v) => {
    // Emitir selección; detalles se pueden añadir cuando se implemente PaymentCardForm
    emit('select', { method: v, details: null })
  },
  { immediate: true },
)
</script>

<style scoped>
.payment-methods {
  background: #fff;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #333;
}
.method {
  border: 1px solid #eee;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}
.method-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
.method-body {
  margin-top: 0.5rem;
  color: #555;
  font-size: 0.9rem;
}
</style>
