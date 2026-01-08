<template>
  <div class="checkout-sidebar" :aria-busy="isProcessing">
    <CheckoutForm @confirm="onCustomerConfirm" @cancel="$emit('cancel')" />

    <PaymentMethods @select="onPaymentSelect" />

    <!-- Mostrar formulario de tarjeta si el método seleccionado es tarjeta -->
    <PaymentCardForm ref="cardFormRef" />

    <div class="actions">
      <button
        class="btn primary"
        @click="onPayClick"
        :disabled="isProcessing || !canPay"
        :aria-disabled="isProcessing || !canPay"
      >
        <span v-if="isProcessing" class="spinner" aria-hidden="true"></span>
        <span v-if="!isProcessing">Pagar ahora</span>
        <span v-else class="visually-hidden">Procesando</span>
      </button>
    </div>

    <div class="processing" v-if="isProcessing">Procesando pago...</div>

    <div class="error" v-if="errorMessage" ref="errorRef" tabindex="-1" role="alert">
      {{ errorMessage }}
    </div>

    <div class="actions-retry" v-if="errorMessage && !isProcessing">
      <button class="btn secondary" @click="onRetry">Reintentar</button>
    </div>

    <div class="success" v-if="success">Pago realizado. Redirigiendo...</div>

    <!-- ARIA live region para lectores de pantalla -->
    <div class="sr-only" aria-live="polite">
      {{ errorMessage ? errorMessage : success ? 'Pago realizado. Redirigiendo...' : '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import CheckoutForm from './CheckoutForm.vue'
import PaymentMethods from './PaymentMethods.vue'
import PaymentCardForm from './PaymentCardForm.vue'
import { useCheckoutSidebar } from '../composables/useCheckoutSidebar'

const props = defineProps<{ total?: number; items?: any[] }>()
const emit = defineEmits(['confirm', 'cancel'])

import { ref, watch } from 'vue'

const {
  payment,
  errorMessage,
  isProcessing,
  success,
  cardFormRef,
  onCustomerConfirm,
  onPaymentSelect,
  handlePay,
  canPay,
} = useCheckoutSidebar()

const errorRef = ref<HTMLElement | null>(null)

// Cuando aparece un error, mover focus al mensaje para accesibilidad
watch(
  () => errorMessage?.value,
  (val) => {
    if (val && errorRef.value) {
      // Hacer focus para lectores de pantalla y teclado
      errorRef.value.focus()
    }
  },
)

async function onPayClick() {
  const result = await handlePay(props.total ?? 0, props.items)
  if (result) emit('confirm', result)
}

async function onRetry() {
  // Reutiliza el mismo flujo de pago
  const result = await handlePay(props.total ?? 0, props.items)
  if (result) emit('confirm', result)
}
</script>

<style scoped>
.checkout-sidebar {
  width: 100%;
}
.processing {
  margin-top: 0.75rem;
}
.success {
  margin-top: 0.75rem;
  color: #0a8a0a;
}

.btn .spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}

.sr-only {
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
</style>

/* Focus visible for error alerts */ .checkout-sidebar .error:focus { outline: 3px solid rgba(220,
53, 69, 0.9); box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.12); } .btn.secondary { background: #6c757d;
color: #fff; border: none; padding: 0.5rem 0.75rem; border-radius: 6px; cursor: pointer; }
.actions-retry { margin-top: 0.5rem; } .btn.secondary:focus { outline: 2px solid
rgba(108,117,125,0.9); }
