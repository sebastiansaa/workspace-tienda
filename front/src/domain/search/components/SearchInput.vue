<template>
  <div class="search-input-container" role="search">
    <slot name="icon">
      <MagnifyingGlassIcon class="search-icon" />
    </slot>

    <input
      ref="inputRef"
      :value="modelValue"
      @input="onInput"
      @compositionstart="onCompositionStart"
      @compositionend="onCompositionEnd"
      type="text"
      class="search-input"
      :placeholder="placeholder"
      @keyup.enter="onSubmit"
      @focus="onFocus"
      @blur="onBlur"
      v-bind="$attrs"
    />

    <button
      v-if="modelValue"
      @click="onClear"
      class="clear-button"
      type="button"
      aria-label="Borrar búsqueda"
    >
      ✕
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, defineExpose } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Buscar productos...' },
})

const emit = defineEmits([
  'update:modelValue',
  'submit',
  'clear',
  'focus',
  'blur',
  'compositionstart',
  'compositionend',
])

const inputRef = ref<HTMLInputElement | null>(null)

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  emit('update:modelValue', val)
}

function onSubmit() {
  emit('submit')
}

function onClear() {
  emit('update:modelValue', '')
  emit('clear')

  inputRef.value?.focus()
}

function onFocus() {
  emit('focus')
}

function onBlur() {
  emit('blur')
}

function onCompositionStart() {
  emit('compositionstart')
}

function onCompositionEnd() {
  emit('compositionend')
}

defineExpose({ focus: () => inputRef.value?.focus() })
</script>

<style scoped>
.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-input-container:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.875rem;
  color: #374151;
}

.search-input::placeholder {
  color: #9ca3af;
}

.clear-button {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.clear-button:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Responsive */
@media (max-width: 640px) {
  .search-input-container {
    padding: 0.5rem;
  }

  .search-icon {
    width: 1rem;
    height: 1rem;
  }
}
</style>
