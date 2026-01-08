<template>
  <form class="profile-form" @submit.prevent="onSubmit">
    <div class="profile-form__grid">
      <label class="profile-form__field">
        <span>Nombre</span>
        <input v-model="form.name" type="text" placeholder="Tu nombre" />
      </label>
      <label class="profile-form__field">
        <span>Teléfono</span>
        <input v-model="form.phone" type="tel" placeholder="+34 600 000 000" />
      </label>
      <label class="profile-form__field">
        <span>Idioma</span>
        <select v-model="form.language">
          <option value="es">Español</option>
          <option value="en">Inglés</option>
        </select>
      </label>
      <label class="profile-form__field">
        <span>Notificaciones</span>
        <select v-model="form.notifications">
          <option value="all">Todas</option>
          <option value="important">Solo importantes</option>
          <option value="none">Ninguna</option>
        </select>
      </label>
    </div>
    <div class="profile-form__actions">
      <button type="submit" :disabled="isPending">Guardar cambios</button>
      <span v-if="isPending" class="profile-form__status">Guardando...</span>
      <span v-else-if="isSuccess" class="profile-form__status is-success">Guardado</span>
      <span v-else-if="error" class="profile-form__status is-error">Error al guardar</span>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { UserProfile } from '../interfaces'
import { useUpdateAccountProfile } from '../composables'

const props = defineProps<{ profile: UserProfile | null }>()

const form = reactive({
  name: '',
  phone: '',
  language: 'es',
  notifications: 'all',
})

watch(
  () => props.profile,
  (value) => {
    if (!value) return
    form.name = value.name ?? ''
    form.phone = value.phone ?? ''
    form.language = (value.preferences as any)?.language ?? 'es'
    form.notifications = (value.preferences as any)?.notifications ?? 'all'
  },
  { immediate: true },
)

const { mutateAsync, isPending, isSuccess, error } = useUpdateAccountProfile()

const onSubmit = async () => {
  await mutateAsync({
    name: form.name || undefined,
    phone: form.phone || undefined,
    preferences: {
      language: form.language,
      notifications: form.notifications,
    },
  })
}
</script>

<style scoped>
.profile-form {
  margin-top: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  background: #f8fafc;
}
.profile-form__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}
.profile-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #1f2937;
}
.profile-form__field input,
.profile-form__field select {
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #fff;
}
.profile-form__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}
.profile-form__actions button {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #0f766e;
  background: #0f766e;
  color: #fff;
  font-weight: 600;
}
.profile-form__status {
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
