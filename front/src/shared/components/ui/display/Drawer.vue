<template>
  <transition name="drawer-slide">
    <div v-if="modelValue" class="drawer" :style="drawerStyle" @click.self="close">
      <div class="drawer__content">
        <slot />
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  offsetTop: { type: Number, default: 0 },
})
const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}

//Estilo computado para el drawer
const drawerStyle = computed(() => {
  const top = props.offsetTop || 0
  return {
    top: `${top}px`,
    left: '0',
    right: '0',
    height: `calc(100vh - ${top}px)`,
  }
})
</script>

<style scoped>
.drawer {
  position: fixed;
  left: 0;
  width: 100vw;
  background: rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.drawer__content {
  background: #f8f8f8;
  width: 100vw;
  max-width: 480px;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 2rem 1rem 1rem 1rem;
  position: relative;
  animation: drawerDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: opacity 0.2s;
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  opacity: 0;
}
@keyframes drawerDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
