<template>
  <button :type="type || 'button'" :class="['base-product-btn', customClass]" @click="handleClick">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  type?: 'button' | 'submit' | 'reset'
  customClass?: string
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  emit('click', event)
}
</script>

<style scoped>
.base-product-btn {
  background: #2d6cdf;
  border: none;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
}
.base-product-btn:hover {
  background: #1e40af;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(45, 108, 223, 0.3);
}
.base-product-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(45, 108, 223, 0.2);
}
.base-product-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>
