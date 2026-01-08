<template>
  <div v-if="allowed">
    <slot />
  </div>
  <div v-else class="admin-access-guard">
    <p class="admin-access-guard__title">Acceso restringido</p>
    <p class="admin-access-guard__message">
      Necesitas permisos de administrador para ver este contenido.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/domain/auth/stores/authStore'
import { isAdminUser } from '../helpers/permissions'

const auth = useAuthStore()
const allowed = computed(() => auth.isLogged && isAdminUser(auth.user))
</script>

<style scoped>
.admin-access-guard {
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 16px;
  background: linear-gradient(135deg, #f7f9fb 0%, #ffffff 100%);
  color: #1f2933;
}
.admin-access-guard__title {
  font-weight: 700;
  margin: 0 0 4px;
}
.admin-access-guard__message {
  margin: 0;
  color: #5f6c72;
}
</style>
