<template>
  <section class="admin-dashboard">
    <div class="admin-dashboard__card">
      <h2>Usuarios</h2>
      <p>Gestiona usuarios, estados y roles.</p>
    </div>
    <div class="admin-dashboard__card">
      <h2>Productos</h2>
      <p>Actualiza precios, stock, imágenes y categorías.</p>
    </div>
    <div class="admin-dashboard__card">
      <h2>Órdenes</h2>
      <p>Revisa órdenes, pagos y estados de envío.</p>
    </div>
    <div class="admin-dashboard__card">
      <h2>Inventario</h2>
      <p>Ajusta stock y revisa disponibilidad.</p>
    </div>
  </section>

  <section class="admin-dashboard__panel">
    <AdminCategoriesPanel />
  </section>

  <section class="admin-dashboard__panel">
    <AdminInventoryPanel />
  </section>
</template>

<script setup lang="ts">
import { AdminCategoriesPanel, AdminInventoryPanel } from '../components'
</script>

<style scoped>
.admin-dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}
.admin-dashboard__card {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}
.admin-dashboard__card h2 {
  margin: 0 0 8px;
  font-size: 16px;
}
.admin-dashboard__card p {
  margin: 0;
  color: #475569;
}

.admin-dashboard__panel {
  margin-top: 16px;
}
</style>
