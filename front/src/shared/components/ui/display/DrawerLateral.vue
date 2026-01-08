<template>
  <transition name="drawer-lateral">
    <div v-if="modelValue" class="dl-overlay" @click.self="close">
      <div class="dl-panel" :style="panelStyle" @click.stop>
        <slot />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  width: { type: String, default: '40vw' },
  position: { type: String, default: 'right' },
  offsetTop: { type: Number, default: 0 },
})
const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}

const panelStyle = computed(() => {
  const top = props.offsetTop || 0
  return {
    width: `var(--drawer-width, ${props.width})`,
    height: `calc(100vh - ${top}px)`,
    top: `${top}px`,
    [props.position]: '0',
  }
})
</script>

<style scoped>
.dl-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.15);
  z-index: 3000;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}
.dl-panel {
  position: absolute;
  right: 0;
  top: 56px;
  height: calc(100% - 56px);
  background: #f8f8f8;
  box-shadow: -6px 0 24px rgba(0, 0, 0, 0.12);
  padding: 1rem;
  box-sizing: border-box;
  border-radius: 0 0 0 0;
  z-index: 3001;
}
.drawer-lateral-enter-active,
.drawer-lateral-leave-active {
  transition:
    transform 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.18s;
}
.drawer-lateral-enter-from,
.drawer-lateral-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@media (max-width: 767px) {
  .dl-panel {
    --drawer-width: 65vw;
  }
}
</style>
