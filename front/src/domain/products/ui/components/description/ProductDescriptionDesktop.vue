<template>
  <div class="product-description-desktop">
    <div class="title-price-row">
      <h2 class="product-title">{{ product?.title ?? '' }}</h2>
      <p class="product-price">
        <strong>{{ product?.price ?? '' }} USD</strong>
      </p>
    </div>
    <p class="product-description">
      {{ product?.description || 'Sin descripción disponible' }}
    </p>
  </div>
  <div class="actions-section">
    <div class="action-btn">
      <BaseProductButton @click="handleAddToCart" :disabled="!product"
        >Añadir al carrito</BaseProductButton
      >
    </div>
    <div class="action-btn">
      <BaseProductButton customClass="buy-now" @click="handleBuyNow" :disabled="!product"
        >Comprar ahora</BaseProductButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '../../../stores'
import { CartStore } from '@/domain/cart/stores/cartStore'
import { useMiniCartStore } from '@/domain/cart/stores/useMiniCartStore'
import { usePaymentNavigation } from '@/domain/cart-summary/composables/usePaymentNavigation'
import BaseProductButton from '@/shared/components/ui/actions/buttons/BaseProductButton.vue'

const store = useProductsStore()
const product = store.selectedProduct
const cart = CartStore()
const { openMini } = useMiniCartStore()
const { setProductId, goToCheckout } = usePaymentNavigation()

const handleAddToCart = () => {
  if (!product) return
  cart.addToCart(product)
  openMini()
}

const handleBuyNow = () => {
  if (!product) return

  const isAlreadyInCart = cart.cartItems.some((item) => item.productId === product.id) // <- usar productId
  if (!isAlreadyInCart) {
    cart.addToCart(product)
  }

  setProductId(product.id)
  goToCheckout()
}
</script>

<style scoped>
.product-description-desktop {
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.title-price-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.product-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
  flex: 1;
  margin: 0;
}

.product-price {
  font-size: 1.75rem;
  color: #007bff;
  white-space: nowrap;
  margin: 0;
  flex-shrink: 0;
}

.product-price strong {
  font-weight: 700;
}

.product-description {
  color: #555;
  line-height: 1.7;
  font-size: 1rem;
  margin: 0;
}

.actions-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 0 2rem;
}

.action-btn {
  width: 100%;
}

@media (min-width: 1400px) {
  .product-description-desktop {
    padding: 3rem;
  }

  .product-title {
    font-size: 2rem;
  }

  .product-price {
    font-size: 2rem;
  }

  .product-description {
    font-size: 1.1rem;
    line-height: 1.8;
  }
}
</style>
