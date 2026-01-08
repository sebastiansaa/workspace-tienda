<template>
  <section class="profile-card">
    <header class="profile-card__header">
      <div>
        <p class="profile-card__kicker">Tu cuenta</p>
        <h2>Perfil y seguridad</h2>
        <p class="profile-card__sub">Revisa tus datos, estado y direcciones.</p>
      </div>
      <span class="profile-card__badge" :class="statusClass">{{ statusLabel }}</span>
    </header>

    <div v-if="isLoading" class="profile-card__loading">Cargando perfil...</div>
    <div v-else-if="error" class="profile-card__error">No se pudo cargar el perfil.</div>
    <div v-else-if="!profile" class="profile-card__error">Sin datos de perfil.</div>
    <div v-else class="profile-card__grid">
      <div class="profile-card__block">
        <h3>Datos personales</h3>
        <p class="profile-card__field"><strong>Nombre:</strong> {{ profile.name ?? '—' }}</p>
        <p class="profile-card__field"><strong>Email:</strong> {{ profile.email }}</p>
        <p class="profile-card__field"><strong>Teléfono:</strong> {{ profile.phone ?? '—' }}</p>
        <p class="profile-card__field"><strong>Roles:</strong> {{ rolesLabel }}</p>
      </div>
      <div class="profile-card__block">
        <h3>Preferencias</h3>
        <p class="profile-card__field">
          Idioma preferido: {{ profile.preferences?.language ?? 'No configurado' }}
        </p>
        <p class="profile-card__field">
          Notificaciones: {{ profile.preferences?.notifications ?? 'No configurado' }}
        </p>
      </div>
    </div>

    <ProfileForm :profile="profile" />
    <ProfileAddresses :addresses="profile?.addresses" />
    <AddressForm />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAccountProfile } from '../composables'
import ProfileAddresses from './ProfileAddresses.vue'
import ProfileForm from './ProfileForm.vue'
import AddressForm from './AddressForm.vue'

const { data, isLoading, error } = useAccountProfile()

const profile = computed(() => data.value ?? null)

const statusClass = computed(() => {
  const status = profile.value?.status?.toLowerCase()
  if (status === 'active') return 'is-active'
  if (status === 'suspended') return 'is-suspended'
  if (status === 'deleted') return 'is-deleted'
  return 'is-neutral'
})

const statusLabel = computed(() => profile.value?.status ?? 'Desconocido')
const rolesLabel = computed(() => (profile.value?.roles ?? []).join(', ') || 'Usuario')
</script>

<style scoped>
.profile-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
}
.profile-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}
.profile-card__kicker {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.profile-card__sub {
  margin: 4px 0 0;
  color: #475569;
}
.profile-card__badge {
  align-self: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  border: 1px solid #e2e8f0;
}
.is-active {
  background: #e6f9ed;
  color: #0f9157;
  border-color: #b3eacb;
}
.is-suspended {
  background: #fff7e6;
  color: #c77d00;
  border-color: #ffe0a3;
}
.is-deleted {
  background: #fde8e8;
  color: #c81e1e;
  border-color: #f9c2c2;
}
.is-neutral {
  background: #f1f5f9;
  color: #334155;
  border-color: #e2e8f0;
}
.profile-card__loading,
.profile-card__error {
  padding: 12px;
  color: #475569;
}
.profile-card__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
.profile-card__block {
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
}
.profile-card__field {
  margin: 6px 0;
  color: #1f2937;
}
</style>
