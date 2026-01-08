<template>
  <button
    :type="type || 'button'"
    :class="['base-account-btn', customClass]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  type?: 'button' | 'submit' | 'reset'
  customClass?: string
}>()
</script>

<style scoped>
.base-account-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #222;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.base-account-btn:hover {
  background: #e2e8f0;
  color: #2d6cdf;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}
.base-account-btn:active {
  transform: translateY(0);
}
</style>
