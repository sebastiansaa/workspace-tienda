<template>
  <div class="product-description-mobile">
    <h2 class="product-title">{{ product?.title ?? '' }}</h2>
    <p class="product-price">
      <strong>{{ product?.price ?? '' }} USD</strong>
    </p>
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
function handleBuyNow() {
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
.product-description-mobile {
  padding: 1.25rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
}

.product-title {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
}

.product-price {
  font-size: 1.5rem;
  color: #007bff;
  margin-bottom: 1rem;
}

.product-price strong {
  font-weight: 700;
}

.product-description {
  color: #555;
  line-height: 1.6;
  font-size: 0.95rem;
}

.actions-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
}

.action-btn {
  width: 100%;
  box-sizing: border-box;
}

@media (min-width: 600px) and (max-width: 1023px) {
  .product-description-mobile {
    padding: 2rem;
  }

  .product-title {
    font-size: 1.75rem;
  }

  .product-price {
    font-size: 1.75rem;
  }

  .product-description {
    font-size: 1rem;
  }
}
</style>
