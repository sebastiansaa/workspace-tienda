<template>
  <div class="account-layout">
    <aside class="account-layout__nav">
      <h1 class="account-layout__brand">Mi cuenta</h1>
      <nav>
        <button
          v-for="item in items"
          :key="item.key"
          :class="['account-layout__nav-item', { 'is-active': item.key === active }]"
          @click="active = item.key"
        >
          <span class="account-layout__nav-title">{{ item.label }}</span>
          <small class="account-layout__nav-sub">{{ item.sub }}</small>
        </button>
      </nav>
    </aside>

    <main class="account-layout__content">
      <component :is="currentComponent" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ProfileCard from '../components/ProfileCard.vue'
import OrderHistory from '../components/OrderHistory.vue'
import Wishlist from '../components/Wishlist.vue'
import Settings from '../components/Settings.vue'

type SectionKey = 'profile' | 'orders' | 'wishlist' | 'settings'

const items: Array<{ key: SectionKey; label: string; sub: string }> = [
  { key: 'profile', label: 'Perfil', sub: 'Datos personales y direcciones' },
  { key: 'orders', label: 'Órdenes', sub: 'Historial de compras' },
  { key: 'wishlist', label: 'Lista de deseos', sub: 'Productos guardados' },
  { key: 'settings', label: 'Configuración', sub: 'Preferencias y seguridad' },
]

const active = ref<SectionKey>('profile')

const componentMap: Record<SectionKey, any> = {
  profile: ProfileCard,
  orders: OrderHistory,
  wishlist: Wishlist,
  settings: Settings,
}

const currentComponent = computed(() => componentMap[active.value])
</script>

<style scoped>
.account-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  min-height: calc(100vh - 80px);
  background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
  padding: 24px;
}
.account-layout__nav {
  position: sticky;
  top: 16px;
  height: fit-content;
  background: #0f172a;
  color: #e2e8f0;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.3);
}
.account-layout__brand {
  margin: 0 0 12px;
  font-size: 20px;
  letter-spacing: 0.01em;
}
.account-layout__nav-item {
  width: 100%;
  text-align: left;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 12px;
  margin: 6px 0;
  background: rgba(255, 255, 255, 0.04);
  color: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}
.account-layout__nav-item:hover {
  border-color: rgba(255, 255, 255, 0.2);
}
.account-layout__nav-title {
  display: block;
  font-weight: 700;
}
.account-layout__nav-sub {
  display: block;
  color: #cbd5e1;
  margin-top: 4px;
}
.is-active {
  background: #0ea5e9;
  color: #0b1224;
  border-color: #7dd3fc;
}
.account-layout__content {
  min-height: 70vh;
}
</style>
