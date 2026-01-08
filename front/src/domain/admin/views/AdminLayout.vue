<template>
  <AdminAccessGuard>
    <main class="admin-layout">
      <header class="admin-layout__header">
        <h1 class="admin-layout__title">Panel de administración</h1>
      </header>
      <section class="admin-layout__content">
        <router-view />
      </section>
    </main>
  </AdminAccessGuard>
</template>

<script setup lang="ts">
import AdminAccessGuard from '../components/AdminAccessGuard.vue'
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}
.admin-layout__header {
  border-bottom: 1px solid #e5e7eb;
}
.admin-layout__title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}
.admin-layout__content {
  min-height: 60vh;
}
</style>
