<template>
  <section class="settings">
    <header>
      <p class="settings__kicker">Configuración</p>
      <h2>Preferencias y seguridad</h2>
      <p class="settings__sub">Administra idioma, notificaciones y seguridad básica.</p>
    </header>

    <div class="settings__grid">
      <div class="settings__card">
        <h3>Idioma</h3>
        <p class="settings__hint">Elige tu idioma preferido para la experiencia.</p>
        <select v-model="language">
          <option value="es">Español</option>
          <option value="en">Inglés</option>
        </select>
      </div>

      <div class="settings__card">
        <h3>Notificaciones</h3>
        <label class="settings__toggle">
          <input v-model="notificationsEmail" type="checkbox" />
          <span>Recibir emails de actualizaciones</span>
        </label>
        <label class="settings__toggle">
          <input v-model="notificationsPromos" type="checkbox" />
          <span>Alertas de promociones</span>
        </label>
      </div>

      <div class="settings__card">
        <h3>Seguridad</h3>
        <p class="settings__hint">Cambia tu contraseña o cierra sesión.</p>
        <button class="settings__button" @click="changePassword">Cambiar contraseña</button>
        <button class="settings__button settings__button--ghost" @click="logout">
          Cerrar sesión
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useAuthStore from '@/domain/auth/stores/authStore'

const language = ref('es')
const notificationsEmail = ref(true)
const notificationsPromos = ref(false)

const router = useRouter()
const authStore = useAuthStore()

const logout = async () => {
  await authStore.logout()
  router.push({ name: 'home' })
}

const changePassword = () => {
  // Placeholder para modal/flujo de cambio de contraseña
  alert('Flujo de cambio de contraseña pendiente de implementar')
}
</script>

<style scoped>
.settings {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
}
.settings__kicker {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.settings__sub {
  margin: 4px 0 0;
  color: #475569;
}
.settings__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.settings__card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  background: #f8fafc;
}
.settings__hint {
  margin: 4px 0 12px;
  color: #475569;
}
.settings__toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 0;
  color: #1f2937;
}
.settings__button {
  margin-top: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #0f766e;
  background: #0f766e;
  color: #fff;
  font-weight: 600;
}
.settings__button--ghost {
  background: #fff;
  color: #0f766e;
}
</style>
