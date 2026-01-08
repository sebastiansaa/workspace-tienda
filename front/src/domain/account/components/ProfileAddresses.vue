<template>
  <section class="addresses">
    <header class="addresses__header">
      <h3>Direcciones</h3>
      <p class="addresses__hint">Gestiona tus ubicaciones de envío y facturación.</p>
    </header>

    <div v-if="!addresses?.length" class="addresses__empty">
      <p>No tienes direcciones guardadas.</p>
      <small>Agrega una dirección para acelerar tus próximas compras.</small>
    </div>

    <ul v-else class="addresses__list">
      <li v-for="address in addresses" :key="address.id" class="addresses__item">
        <div class="addresses__title">{{ address.street }}</div>
        <div class="addresses__meta">
          {{ address.city }}, {{ address.country }} · {{ address.zipCode }}
        </div>
        <div class="addresses__dates">Actualizado {{ formatDate(address.updatedAt) }}</div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { UserAddress } from '../interfaces'

const props = defineProps<{ addresses?: UserAddress[] }>()

const formatDate = (iso: string) => new Date(iso).toLocaleDateString()
</script>

<style scoped>
.addresses {
  margin-top: 24px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
}
.addresses__header h3 {
  margin: 0;
  font-size: 18px;
}
.addresses__hint {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 14px;
}
.addresses__empty {
  padding: 16px 0;
  color: #475569;
}
.addresses__list {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
  display: grid;
  gap: 12px;
}
.addresses__item {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
}
.addresses__title {
  font-weight: 600;
  margin-bottom: 4px;
}
.addresses__meta {
  color: #334155;
  font-size: 14px;
}
.addresses__dates {
  color: #94a3b8;
  font-size: 12px;
  margin-top: 6px;
}
</style>
