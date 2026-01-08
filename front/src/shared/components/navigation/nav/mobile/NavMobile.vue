<template>
  <div class="nav-wrapper">
    <nav class="nav">
      <div class="nav__section nav__section--left">
        <LogoButton />
        <button class="nav__burger" @click="menuOpen = !menuOpen" aria-label="Abrir menú">
          <span v-if="!menuOpen">&#9776;</span>
          <span v-else>✕</span>
        </button>
      </div>
      <div class="nav__section nav__section--right">
        <div class="nav__right-icons">
          <button
            class="icon-btn-nav-movil"
            aria-label="Iniciar sesión"
            @click="handleLoginClick"
            role="button"
          >
            <UserCircleIcon class="nav-icon" />
          </button>
          <button
            class="icon-btn-nav-movil"
            aria-label="Carrito"
            @click="handleCartClick"
            role="button"
          >
            <ShoppingCartIcon class="nav-icon" />
            <span
              v-if="count > 0"
              class="cart-badge"
              :aria-label="`${count} artículos en carrito`"
              >{{ count }}</span
            >
          </button>
        </div>
      </div>
    </nav>

    <!-- SearchBar debajo del nav en móvil -->
    <div class="nav__searchbar-mobile">
      <SearchBar />
    </div>

    <NavMobileCat :isOpen="menuOpen" @update:isOpen="menuOpen = $event" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ShoppingCartIcon, UserCircleIcon } from '@heroicons/vue/24/outline'
import { LogoButton } from '@/shared/components/ui/actions/buttons'
import { useNavigation } from '@/shared/composables/useNavigation'
import { useCartStore } from '@/domain/cart/stores/cartStore'
import { useMiniCartStore } from '@/domain/cart/stores/useMiniCartStore'
import { useRouter } from 'vue-router'

import NavMobileCat from './NavMobileCat.vue'
import SearchBar from '@/domain/search/components/SearchBar.vue'

// menú móvil local
const menuOpen = ref(false)
const { handleSection } = useNavigation()
const router = useRouter()

const cart = useCartStore()
const count = computed(() => cart.count)
const { openExpanded } = useMiniCartStore()

function handleSectionMobile(section: string) {
  handleSection(section)
  menuOpen.value = false
}

function handleCartClick() {
  if (count.value > 0) {
    openExpanded()
  } else {
    handleSectionMobile('cart')
  }
}

function handleLoginClick() {
  router.push('/auth')
}
</script>

<style scoped>
.icon-btn-nav-movil {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #222;
  margin-right: 0;
  transition: background 0.2s;
  border-radius: 50%;
  padding: 0.5rem;
}
.icon-btn-nav-movil:hover {
  background: #ececec;
}

.icon-btn-nav-movil {
  position: relative;
}

.nav__section--right {
  position: absolute;
  right: 0.2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  z-index: 3;
}

.nav__right-icons {
  display: flex;
  gap: 0.05rem;
  margin-right: 0;
  align-items: center;
}
.nav-wrapper {
  position: relative;
}
.nav__searchbar-mobile {
  position: relative;
  padding: 0.5rem 1rem;
  z-index: 1;
}
.nav {
  min-height: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.5rem 1rem;
  background: #f8f8f8;
  border-bottom: 1px solid #eee;
  border-radius: 0;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2000;
}
.nav__section--left {
  flex: 1;
  justify-content: center;
  position: relative;
  min-height: 56px;
  height: 56px;
}
.nav__logo-btn {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  z-index: 1;
}
.nav__burger {
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  margin: 0;
  z-index: 2;
  display: block !important;
  color: #222;
}
.nav-icon {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #222; /* neutral stroke color for outline */
  fill: none;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ef4444;
  color: #fff;
  border-radius: 999px;
  padding: 0 6px;
  font-size: 12px;
  min-width: 18px;
  text-align: center;
  line-height: 18px;
}
</style>
