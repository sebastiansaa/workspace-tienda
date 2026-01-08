<template>
  <button
    :type="type || 'button'"
    :class="['icon-btn', customClass]"
    @click="onClick"
    :aria-label="ariaLabel"
  >
    <slot />
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  type: { type: String, default: 'button' },
  customClass: { type: String, default: '' },
  ariaLabel: { type: String, default: '' },
})
const emit = defineEmits(['click'])

function onClick(event) {
  emit('click', event)
}
</script>

<style scoped>
.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.2rem;
  color: #222;
  transition: background 0.2s;
  border-radius: 50%;
}
.icon-btn:hover {
  background: #f0f0f0;
}
</style>
