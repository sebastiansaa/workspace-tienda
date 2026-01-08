<template>
  <div class="checkout-form">
    <h2>Datos del comprador</h2>
    <form @submit.prevent="noop">
      <div class="field">
        <label>Nombre completo</label>
        <input v-model="fullName" @blur="fullNameBlur" />
        <div class="error">{{ fullNameError || formErrors.fullName }}</div>
      </div>

      <div class="field">
        <label>Dirección de envío</label>
        <input v-model="address" @blur="addressBlur" />
        <div class="error">{{ addressError || formErrors.address }}</div>
      </div>

      <div class="field">
        <label>Teléfono</label>
        <input v-model="phone" inputmode="tel" @blur="phoneBlur" />
        <div class="error">{{ phoneError || formErrors.phone }}</div>
      </div>

      <div class="field">
        <label>Email</label>
        <input v-model="email" type="email" @blur="emailBlur" />
        <div class="error">{{ emailError || formErrors.email }}</div>
      </div>

      <div class="actions">
        <button type="button" class="btn secondary" @click="$emit('cancel')">Volver</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCheckoutForm } from '../composables/useCheckoutForm'

const emit = defineEmits(['confirm', 'cancel'])

const {
  fullName,
  fullNameError,
  fullNameBlur,
  address,
  addressError,
  addressBlur,
  phone,
  phoneError,
  phoneBlur,
  email,
  emailError,
  emailBlur,
  values,
  formErrors,
  onSubmit,
} = useCheckoutForm()

const noop = () => {}

// Auto-confirmación: cuando el formulario es válido, emitir 'confirm' automáticamente.
const autoConfirmed = ref(false)

watch(
  values,
  async () => {
    if (autoConfirmed.value) return
    // Intentar validar
    const result = await onSubmit()
    if (result) {
      autoConfirmed.value = true
      emit('confirm', result)
    }
  },
  { deep: true },
)
</script>

<style scoped>
.checkout-form {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #333;
}
.field {
  margin-bottom: 0.75rem;
}
.field label {
  display: block;
  font-size: 0.85rem;
  color: #333;
  margin-bottom: 0.25rem;
}
.field input {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #ddd;
}
.row {
  display: flex;
  gap: 0.5rem;
}
.small {
  flex: 1;
}
.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1rem;
}
.btn {
  padding: 0.6rem 0.9rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
.btn.primary {
  background: #007bff;
  color: #fff;
}
.btn.secondary {
  background: #f0f0f0;
}

@media (max-width: 800px) {
  .row {
    flex-direction: column;
  }
}
</style>
