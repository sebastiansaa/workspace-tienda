<template>
  <div class="checkout-page">
    <section class="checkout-body">
      <CheckoutSummary :items="items" :total="total" @remove="handleRemove" />

      <div class="right-col">
        <CheckoutSidebar
          :total="total"
          :items="items"
          @confirm="handleConfirm"
          @cancel="handleCancel"
        />
      </div>
      <div class="error" v-if="error">{{ error?.message ?? String(error) }}</div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { cartStore } from '@/domain/cart/stores/cartStore'
import CheckoutSummary from '../components/CheckoutSummary.vue'
import CheckoutSidebar from '../components/CheckoutSidebar.vue'
import { useCheckoutStore } from '../stores/checkoutStore'
import { prefetchStripe } from '../helpers/stripe'
import { STRIPE_PUBLISHABLE_KEY } from '@/shared/config'

const router = useRouter()
const cart = cartStore()
const checkoutStore = useCheckoutStore()

const items = computed(() => cart.cartItems)
const total = computed(() => cart.totalPrice)

const error = checkoutStore.errorMessage

// Resetear el estado del checkout al salir de la vista
// Esto limpia customer, payment, errorMessage, etc. para el próximo checkout
onBeforeUnmount(() => {
  checkoutStore.resetCheckout()
})

onMounted(() => {
  // Calentar Stripe para reducir latencia percibida cuando el usuario vaya a pagar
  if (STRIPE_PUBLISHABLE_KEY) prefetchStripe(STRIPE_PUBLISHABLE_KEY).catch(() => {})
})

function handleRemove(id: number) {
  if (typeof cart.removeFromCart === 'function') cart.removeFromCart(id)
}

function handleCancel() {
  router.back()
}

function handleConfirm(result: any) {
  if (!result?.ok) return
  void cart.clearCart()
  setTimeout(() => {
    router.push({ path: '/orders', query: { success: 'true' } })
  }, 800)
}
</script>

<style scoped>
.checkout-body {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  padding: 1.25rem;
}
.right-col {
  width: 320px;
}
.processing {
  margin-top: 0.75rem;
}
.success {
  margin-top: 0.75rem;
  color: #0a8a0a;
}

@media (max-width: 800px) {
  .checkout-body {
    flex-direction: column;
  }
  .right-col {
    width: 100%;
  }
}
</style>
