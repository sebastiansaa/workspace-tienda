<template>
  <div class="product-related-mobile">
    <h3 class="related-title">Productos Relacionados</h3>
    <div v-if="visibleProducts.length > 0" class="products-scroll">
      <div class="scroll-container">
        <ProductCardRelated
          v-for="product in visibleProducts"
          :key="product.id"
          @select="navigateToProduct"
          class="related-card"
          :product="product"
        />
      </div>
    </div>
    <p v-else class="no-products">No hay productos relacionados</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProductCardRelated from './ProductCardRelated.vue'
import { useProductsStore } from '../../../stores/productsStore'
import { useProductNavigation, useProducts } from '../../../app/hooks'
import type { ProductResponse } from '../../../types/backendShape'

const { navigateToProduct } = useProductNavigation()

const store = useProductsStore()
const product = store.selectedProduct

const { data: relatedProducts } = useProducts()

const visibleProducts = computed(() =>
  (relatedProducts.value?.products || []).filter((p: ProductResponse) => p.id !== product?.id),
)
</script>

<style scoped>
.product-related-mobile {
  margin-top: 0;
  padding: 0 0 1.25rem 0;
  position: relative;
}

.related-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
  padding: 0 1.25rem;
  text-align: center;
}

.no-products {
  text-align: center;
  color: #666;
  padding: 2rem 1.25rem;
  font-size: 0.95rem;
}

.products-scroll {
  overflow: hidden;
  width: 100%;
}

.scroll-container {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding: 0 1.25rem;
  -webkit-overflow-scrolling: touch;
}

.scroll-container::-webkit-scrollbar {
  display: none;
}

.scroll-container {
  scrollbar-width: none;
}

.related-card {
  flex: 0 0 70%;
  min-width: 70%;
  max-width: 280px;
  scroll-snap-align: start;
}

/* Tablet vertical: mostrar más productos */
@media (min-width: 600px) and (max-width: 1023px) {
  .related-card {
    flex: 0 0 45%;
    min-width: 45%;
    max-width: 320px;
  }

  .related-title {
    font-size: 1.5rem;
  }
}

/* Mobile pequeño */
@media (max-width: 599px) {
  .related-card {
    flex: 0 0 75%;
    min-width: 75%;
    max-width: 260px;
  }
}
</style>
