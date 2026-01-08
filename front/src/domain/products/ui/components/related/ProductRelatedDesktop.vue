<template>
  <div class="product-related-desktop">
    <h3 class="related-title">Productos Relacionados</h3>
    <div class="carousel-wrapper">
      <BaseAccountButton class="carousel-arrow left" @click="prev" :disabled="currentIndex === 0">
        &#8592;
      </BaseAccountButton>

      <div class="carousel-container">
        <div class="carousel-items" :style="carouselTransform">
          <ProductCardRelated
            v-for="product in visibleProducts"
            :key="product.id"
            @select="navigateToProduct"
            class="related-card"
            :product="product"
          />
        </div>
      </div>

      <BaseAccountButton
        class="carousel-arrow right"
        @click="next"
        :disabled="currentIndex + visibleCount >= visibleProducts.length"
      >
        &#8594;
      </BaseAccountButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProductCardRelated from './ProductCardRelated.vue'
import { BaseAccountButton } from '@/shared/components/ui/actions/buttons'
import { useProductsStore } from '../../../stores/productsStore'
import { useProductNavigation, useProducts } from '../../../app/hooks'
import type { ProductResponse } from '../../../types/backendShape'

const { navigateToProduct } = useProductNavigation()
const store = useProductsStore()
const product = store.selectedProduct

const { data: relatedProducts } = useProducts()

const currentIndex = ref(0)
const visibleCount = 3 // tarjetas visibles en el carrusel

// Filtra los productos para el carousel, se excluye el producto actual
const visibleProducts = computed(() =>
  (relatedProducts.value?.products || []).filter((p: ProductResponse) => p.id !== product?.id),
)

// Funciones para navegar en el carrusel
const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}
const next = () => {
  const totalProducts = visibleProducts.value.length
  if (currentIndex.value + visibleCount < totalProducts) {
    currentIndex.value++
  }
}

// calcula el desplazamiento CSS del carousel
const carouselTransform = computed(() => {
  const cardWidthPercentage = 100 / visibleCount
  return { transform: `translateX(-${currentIndex.value * cardWidthPercentage}%)` }
})
</script>

<style scoped>
.product-related-desktop {
  margin-top: 0;
  padding: 0 1.25rem 1.25rem;
  position: relative;
}

.related-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.carousel-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.carousel-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.carousel-items {
  display: flex;
  gap: 1rem;
  transition: transform 0.5s ease-in-out;
}

.related-card {
  flex: 0 0 calc(33.333% - 0.67rem);
  min-width: 0;
}

.carousel-arrow {
  background: #fff !important;
  border: 1px solid #ccc !important;
  border-radius: 50% !important;
  width: 2.5rem !important;
  height: 2.5rem !important;
  min-width: 2.5rem !important;
  max-width: 2.5rem !important;
  font-size: 1.5rem !important;
  cursor: pointer;
  transition: all 0.2s ease !important;
  flex-shrink: 0;
  padding: 0 !important;
  color: #333 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.carousel-arrow:hover:not(:disabled) {
  background: #f0f0f0 !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
  transform: scale(1.05) !important;
}

.carousel-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  background: #f9f9f9 !important;
}

@media (max-width: 1200px) {
  .related-card {
    flex: 0 0 calc(50% - 0.5rem);
  }
}
</style>
