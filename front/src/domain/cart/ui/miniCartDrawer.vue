<template>
  <div
    class="mini-cart-drawer"
    :class="{
      'mini-cart-drawer--open': miniCart.isOpen,
      'mini-cart-drawer--mini': miniCart.isMini,
      'mini-cart-drawer--expanded': miniCart.isExpanded,
    }"
    role="dialog"
    aria-label="Mini carrito"
    @click="handlePanelClick"
  >
    <div class="mini-cart" @click.stop>
      <header class="mini-cart__header">
        <h3>Tu carrito</h3>
        <button class="mini-cart__close" @click="miniCart.close">✕</button>
      </header>

      <div class="mini-cart__body" v-if="items.length > 0">
        <ul class="mini-cart__list">
          <li v-for="item in items" :key="item.productId" class="mini-cart__item">
            <img
              :src="resolveThumb(item.product)"
              :alt="item.product?.title ?? 'Producto'"
              class="mini-cart__thumb"
            />
            <div class="mini-cart__meta">
              <div class="mini-cart__title">{{ item.product?.title ?? 'Producto' }}</div>
              <div class="mini-cart__qty">x{{ item.quantity }}</div>
              <div class="mini-cart__price">
                {{ formatPrice(item.price ?? item.product?.price ?? 0) }}
              </div>
            </div>
            <button class="mini-cart__remove" @click="remove(item.productId)" aria-label="Eliminar">
              ×
            </button>
          </li>
        </ul>

        <div class="mini-cart__summary">
          <div class="mini-cart__total">
            Total: <strong>{{ formatPrice(total) }}</strong>
          </div>
          <div class="mini-cart__actions">
            <button @click="openCheckout" class="primary">Ir a pagar</button>
          </div>
        </div>
      </div>

      <div class="mini-cart__empty" v-else>
        <p>Tu carrito está vacío.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { CartStore } from '../stores/cartStore'
import { useMiniCartStore } from '../stores/useMiniCartStore'
import type { ProductResponse } from '@/domain/products/types'
import { getPrimaryProductImage, PRODUCT_IMAGE_PLACEHOLDER } from '@/domain/products/app/helpers'

const cart = CartStore()
const miniCart = useMiniCartStore()
const router = useRouter()

const items = computed(() => cart.cartItems)
const total = computed(() => cart.totalPrice)

function handlePanelClick() {
  if (miniCart.isMini) {
    miniCart.expand()
  }
}

function openCheckout() {
  miniCart.close()
  router.push('/checkout')
}

function remove(id: number) {
  cart.removeItem(id)
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price)
}

function resolveThumb(product?: ProductResponse): string {
  if (!product) return PRODUCT_IMAGE_PLACEHOLDER
  return getPrimaryProductImage(product.images)
}
</script>

<style scoped>
.mini-cart-drawer {
  position: fixed;
  top: 56px;
  right: 0;
  height: calc(100vh - 56px);
  width: 0;
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transition: width 0.3s;
  z-index: 1000;
  overflow: hidden;
}
.mini-cart-drawer--open.mini-cart-drawer--mini {
  width: 20vw;
}
.mini-cart-drawer--open.mini-cart-drawer--expanded {
  width: 40vw;
}
.mini-cart {
  width: 100%;
  max-width: 720px;
  padding: 1rem;
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
}
.mini-cart__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.mini-cart__list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 50vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.mini-cart__item {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}
.mini-cart__thumb {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
}
.mini-cart__meta {
  flex: 1;
}
.mini-cart__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
.mini-cart__remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  margin-left: 0.5rem;
}
.mini-cart__empty {
  padding: 1rem;
  text-align: center;
  color: var(--vt-c-text-light-2);
}
.primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
