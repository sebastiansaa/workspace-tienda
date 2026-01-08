<!--
  Componente PaymentCardForm

  TOKENIZACIÓN AUTOMÁTICA:
  - La tokenización de la tarjeta se realiza AUTOMÁTICAMENTE al hacer clic en "Pagar ahora"
  - NO requiere un botón "Tokenizar" manual
  - El checkoutStore llama a `tokenizePayload()` antes de procesar el pago

  MODOS DE OPERACIÓN:
  - Stripe Mode: Si `FORCE_MOCK_PAYMENTS=false` y `VITE_STRIPE_PK` está configurado
    * Usa Stripe Elements para capturar la tarjeta
    * Tokeniza usando la API real de Stripe
    * Soporta 3D Secure (3DS) automáticamente

  - Mock Mode (ACTUAL): Si `FORCE_MOCK_PAYMENTS=true`
    * Muestra inputs HTML nativos para tarjeta
    * Genera tokens simulados (tok_mock_xxxxx)
    * No valida formato de tarjeta (acepta cualquier número)
    * Simula delay de red (600ms)

  NOTA: La tokenización es transparente para el usuario - simplemente llena los campos y paga.
-->
<template>
  <div class="payment-card-form">
    <h4>Datos de la tarjeta</h4>

    <div class="field">
      <label>Titular</label>
      <input v-model="cardholder" placeholder="Nombre en la tarjeta" />
    </div>

    <!-- Contenedor para Stripe Elements (si está disponible) -->
    <div v-if="mode === 'stripe'" ref="containerRef" class="stripe-card" />

    <!-- Inputs fallback (mock mode) -->
    <div v-else>
      <div class="field">
        <label>Número de tarjeta</label>
        <input v-model="numberFormatted" placeholder="4242 4242 4242 4242" inputmode="numeric" />
      </div>

      <div class="row">
        <div class="field small">
          <label>Expiración (MM/AA)</label>
          <input v-model="expFormatted" placeholder="04/28" />
        </div>
        <div class="field small">
          <label>CVC</label>
          <input v-model="cvc" placeholder="123" inputmode="numeric" />
        </div>
      </div>
    </div>

    <div class="status">
      <div class="info" v-if="mode === 'mock'">✓ Modo simulación activo</div>
      <div class="error" v-if="error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { FORCE_MOCK_PAYMENTS as forceMock } from '@/shared/config'
import usePaymentCard from '../composables/usePaymentCard'
import type { CardTokenPayload } from '@/domain/checkout/interfaces/types'

const props = defineProps<{ publishableKey?: string }>()
const emit = defineEmits(['tokenized'])

// Contenedor donde el composable montará Stripe Elements (si aplica)
const containerRef = ref<HTMLElement | null>(null)

const {
  cardholder,
  number,
  exp,
  cvc,
  processing,
  error,
  mode,
  tokenizingLabel,
  stripeRef,
  elementsRef,
  cardElementRef,
  isFilled,
  tokenize,
  tokenizePayload,
  confirmPayment,
} = usePaymentCard(props.publishableKey, containerRef)

// Auto-prefill en desarrolllo cuando estamos en modo mock para acelerar pruebas
onMounted(() => {
  try {
    if (mode.value === 'mock' && forceMock) {
      if (!cardholder.value) cardholder.value = 'Dev Tester'
      if (!number.value) number.value = '4242 4242 4242 4242'
      if (!exp.value) exp.value = '04/28'
      if (!cvc.value) cvc.value = '123'
    }
  } catch (_) {
    /* noop */
  }
})

// Formateo del número de tarjeta: insertar espacio cada 4 dígitos
const numberFormatted = computed({
  get: () => {
    const digits = (number.value || '').replace(/\D+/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  },
  set: (val: string) => {
    const digits = (val || '').replace(/\D+/g, '').slice(0, 16)
    number.value = digits.replace(/(.{4})/g, '$1 ').trim()
  },
})

// Formateo de expiración: MM/YY con slash automático
const expFormatted = computed({
  get: () => {
    const digits = (exp.value || '').replace(/\D+/g, '').slice(0, 4)
    if (digits.length <= 2) return digits
    return digits.slice(0, 2) + '/' + digits.slice(2)
  },
  set: (val: string) => {
    const digits = (val || '').replace(/\D+/g, '').slice(0, 4)
    exp.value = digits.length <= 2 ? digits : digits.slice(0, 2) + '/' + digits.slice(2)
  },
})

async function handleTokenizeClick() {
  const res = await tokenizePayload()
  if (!res) return
  if ('error' in res) return
  // res ya tiene la forma de `TokenizePayload` exportado
  emit('tokenized', res)
}

defineExpose({ confirmPayment, tokenizePayload, stripeRef, elementsRef, isFilled })
</script>

<style scoped>
.payment-card-form {
  background: #fff;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #333;
}
.field {
  margin-bottom: 0.75rem;
}
.field label {
  display: block;
  font-size: 0.85rem;
  color: #333;
  margin-bottom: 0.25rem;
}
.field input {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #ddd;
}
.row {
  display: flex;
  gap: 0.5rem;
}
.small {
  flex: 1;
}
.status {
  margin-top: 1rem;
}
.info {
  color: #0a8a0a;
  font-size: 0.85rem;
  padding: 0.5rem;
  background: #f0f9f0;
  border-radius: 4px;
}
.error {
  color: #d32f2f;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}
.stripe-card {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.625rem;
  margin-top: 0.5rem;
}

@media (max-width: 800px) {
  .row {
    flex-direction: column;
  }
}
</style>
