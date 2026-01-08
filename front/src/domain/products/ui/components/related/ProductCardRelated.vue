<template>
  <div class="product-card-related" @click="handleClick">
    <img class="card-image" :src="primaryImage" :alt="product.title" />
    <h4 class="card-title">{{ truncatedTitle }}</h4>
    <p class="card-price">${{ product.price }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProductResponse } from '../../../types/backendShape'
import { getPrimaryProductImage } from '../../../app/helpers'

const props = defineProps<{ product: ProductResponse }>()
const emit = defineEmits(['select'])

const handleClick = () => {
  emit('select', props.product)
}

const truncatedTitle = computed(() => {
  const maxLength = 30
  return props.product.title.length > maxLength
    ? props.product.title.substring(0, maxLength) + '...'
    : props.product.title
})

const primaryImage = computed(() => getPrimaryProductImage(props.product.images))
</script>

<style scoped>
.product-card-related {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 100%;
  min-width: 200px;
  max-width: 300px;
}

.product-card-related:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.3;
}

.card-price {
  font-size: 1rem;
  font-weight: 700;
  color: #007bff;
  margin: 0;
}
</style>
