<template>
  <button
    :type="type || 'button'"
    :class="['base-payment-btn', customClass]"
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
.base-payment-btn {
  background: #1e293b;
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
.base-payment-btn:hover {
  background: #334155;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 41, 59, 0.3);
}
.base-payment-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(30, 41, 59, 0.2);
}
.base-payment-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>
