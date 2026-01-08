<template>
  <div class="product-gallery-desktop">
    <!-- Imagen principal -->
    <div class="gallery-main">
      <img :src="images[selected]" alt="Imagen principal del producto" class="main-image" />
    </div>

    <!-- Miniaturas -->
    <div class="gallery-thumbnails" v-if="images && images.length">
      <img
        v-for="(img, idx) in images"
        :key="idx"
        :src="img"
        :alt="'Miniatura ' + (idx + 1)"
        class="thumbnail"
        :class="{ active: idx === selected }"
        @click="selected = idx"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductsStore } from '../../../stores/productsStore'
import { resolveProductImages } from '../../../app/helpers'

const store = useProductsStore()
const selected = ref(0)

// images => [] reactivo
const images = computed(() => resolveProductImages(store.selectedProduct?.images))
</script>

<style scoped>
.product-gallery-desktop {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.gallery-main {
  margin-bottom: 1rem;
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
}

.wishlist-btn-wrapper {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
}

.main-image {
  width: 100%;
  max-width: 400px;
  object-fit: contain;
  border-radius: 8px; /* image */
}

.gallery-thumbnails {
  display: flex;
  flex-direction: row;
  gap: 0.5rem; /* small */
  overflow-x: auto;
  width: 100%;
  justify-content: center;
}

.thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  opacity: 0.7;
  border: 2px solid transparent;
  transition:
    border 0.2s ease,
    opacity 0.2s ease;
}
.thumbnail.active {
  border: 2px solid #007bff;
  opacity: 1;
}

@media (max-width: 1023px) {
  .main-image {
    max-width: 320px;
  }
  .thumbnail {
    width: 48px;
    height: 48px;
  }
}

@media (max-width: 767px) {
  .main-image {
    max-width: 100vw;
  }
  .gallery-thumbnails {
    gap: 0.25rem; /* xs */
  }
  .thumbnail {
    width: 40px;
    height: 40px;
  }
}
</style>
