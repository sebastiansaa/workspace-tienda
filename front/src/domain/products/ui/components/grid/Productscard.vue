<template>
  <div class="product-card">
    <div class="product-card__content" @click="handleClick">
      <img
        class="product-image"
        @error="handleImageError"
        :src="coverImage"
        :alt="product?.title ?? 'producto'"
      />
      <h3>{{ truncatedTitle }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { handleImageError, truncate, getPrimaryProductImage } from '../../../app/helpers'
import { useProduct } from '../../../app/hooks'

const props = defineProps<{ productId: number }>()
const { data: product } = useProduct(props.productId)

const emit = defineEmits(['select'])

function handleClick() {
  if (product.value) emit('select', product.value)
}

const MAX_TITLE_LENGTH = 20
const truncatedTitle = computed(() => truncate(product.value?.title ?? '', MAX_TITLE_LENGTH))
const coverImage = computed(() => getPrimaryProductImage(product.value?.images))
</script>

<style scoped>
.product-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  transition: box-shadow 0.3s ease;
}

.product-card__wishlist-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
}

.product-card__content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.product-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.product-card h3 {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
  text-align: center;
  transition: color 0.3s ease;
}

.product-card:hover h3 {
  color: #007bff;
}

.product-image {
  width: 100%;
  max-width: clamp(180px, 80%, 300px);
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: translateY(-8px);
}

/* Solo aplicar hover en dispositivos con mouse */
@media (hover: none) {
  .product-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .product-card:hover .product-image {
    transform: translateY(0);
  }

  .product-card:hover h3 {
    color: inherit;
  }
}
</style>
