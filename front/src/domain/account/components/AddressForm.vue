<template>
  <form class="address-form" @submit.prevent="onSubmit">
    <div class="address-form__grid">
      <input v-model="form.street" type="text" placeholder="Calle" required />
      <input v-model="form.city" type="text" placeholder="Ciudad" required />
      <input v-model="form.country" type="text" placeholder="País" required />
      <input v-model="form.zipCode" type="text" placeholder="Código postal" required />
    </div>
    <div class="address-form__actions">
      <button type="submit" :disabled="isPending">Agregar dirección</button>
      <span v-if="isPending" class="address-form__status">Guardando...</span>
      <span v-else-if="isSuccess" class="address-form__status is-success">Guardado</span>
      <span v-else-if="error" class="address-form__status is-error">Error al guardar</span>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useAddAccountAddress } from '../composables'

const form = reactive({ street: '', city: '', country: '', zipCode: '' })

const { mutateAsync, isPending, isSuccess, error } = useAddAccountAddress()

const onSubmit = async () => {
  await mutateAsync({ ...form })
  form.street = ''
  form.city = ''
  form.country = ''
  form.zipCode = ''
}
</script>

<style scoped>
.address-form {
  margin-top: 12px;
}
.address-form__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}
.address-form__grid input {
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
}
.address-form__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}
.address-form__actions button {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #0f766e;
  background: #0f766e;
  color: #fff;
  font-weight: 600;
}
.address-form__status {
  font-size: 13px;
  color: #475569;
}
.is-success {
  color: #0f9157;
}
.is-error {
  color: #c81e1e;
}
</style>
