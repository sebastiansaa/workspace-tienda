<template>
  <nav class="nav">
    <div class="nav__section nav__section--left">
      <LogoButton />
    </div>

    <div class="nav__section nav__section--center">
      <SearchBar />
    </div>

    <div class="nav__section nav__section--right">
      <IconButton
        class="icon-btn-nav-desktop"
        aria-label="Iniciar sesión"
        @click="handleLoginClick"
        role="button"
      >
        <UserCircleIcon class="nav-icon" />
      </IconButton>
      <IconButton
        class="icon-btn-nav-desktop"
        aria-label="Carrito"
        @click="handleCartClick"
        role="button"
      >
        <ShoppingCartIcon class="nav-icon" />
        <span v-if="count > 0" class="cart-badge" :aria-label="`${count} artículos en carrito`">{{
          count
        }}</span>
      </IconButton>
    </div>
  </nav>
  <NavDesktopCat />
</template>

<script setup lang="ts">
import { ShoppingCartIcon, UserCircleIcon } from '@heroicons/vue/24/outline'
import { IconButton, LogoButton } from '@/shared/components/ui/actions/buttons'
import SearchBar from '@/domain/search/components/SearchBar.vue'
import NavDesktopCat from './NavDesktopCat.vue'
import { cartStore } from '@/domain/cart/stores/cartStore'
import { useMiniCartStore } from '@/domain/cart/stores/useMiniCartStore'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const cart = cartStore()
const count = computed(() => cart.count)
const { openExpanded } = useMiniCartStore()
const router = useRouter()

const handleCartClick = () => {
  if (count.value > 0) {
    openExpanded()
  } else {
    router.push('/cart')
  }
}

const handleLoginClick = () => {
  router.push('/auth')
}
</script>

<style scoped>
.nav-icon {
  width: 24px;
  height: 24px;
  color: #222;
  fill: none;
}

.icon-btn-nav-desktop {
  padding: 0.5rem;
  border-radius: 50%;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.icon-btn-nav-desktop:hover {
  background: #f0f0f0;
}

.nav__section--center {
  flex: 2;
  display: flex;
  justify-content: center;
}
.nav__section--left {
  flex: 1;
  display: flex;
  align-items: center;
}
.nav__section--right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* nav ahora es sticky */
.nav {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 62px;
  padding: 0.5rem 1rem;
  background: #f8f8f8;
  border-bottom: 1px solid #eee;
}

.icon-btn-nav-desktop {
  position: relative;
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
  min-width: 20px;
  text-align: center;
  line-height: 20px;
}
</style>
