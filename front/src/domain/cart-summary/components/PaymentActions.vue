<template>
  <aside class="payment-actions">
    <div class="product-query" v-if="productId">Producto : {{ productId }}</div>

    <div class="error" v-if="errorMessage" ref="errorRef" tabindex="-1" role="alert">
      {{ errorMessage }}
    </div>

    <button
      class="pay-btn"
      :disabled="disabled || processing"
      @click="$emit('pay')"
      :aria-disabled="disabled || processing"
    >
      <span v-if="processing" class="spinner" aria-hidden="true"></span>
      <span v-if="!processing"><slot>Pagar</slot></span>
      <span v-else class="visually-hidden">Procesando</span>
    </button>

    <div class="actions-retry" v-if="errorMessage && !processing">
      <button class="btn secondary" @click="$emit('retry')">Reintentar</button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  disabled?: boolean
  processing?: boolean
  success?: boolean
  productId?: string
  errorMessage?: string
}>()

const errorRef = ref<HTMLElement | null>(null)

watch(
  () => props.errorMessage,
  (val) => {
    if (val && errorRef.value) errorRef.value.focus()
  },
)
</script>

<style scoped>
.payment-actions {
  width: 220px;
}
.pay-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.pay-btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.success {
  margin-top: 0.75rem;
  color: #0a8a0a;
}

.error {
  margin-top: 0.5rem;
  color: #dc3545;
}

.error:focus {
  outline: 3px solid rgba(220, 53, 69, 0.9);
  box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.12);
}

.btn.secondary {
  background: #6c757d;
  color: #fff;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
}

.actions-retry {
  margin-top: 0.5rem;
}

.pay-btn .spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}

.visually-hidden {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 800px) {
  .payment-actions {
    width: 100%;
  }
}
</style>
