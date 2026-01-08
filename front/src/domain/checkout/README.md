# Checkout Domain

## Propósito

Proceso completo de checkout (datos de envío, método de pago, integración Stripe) con creación de órdenes.

## Vistas / Rutas

| Ruta        | Params/Props | Propósito                                                |
| ----------- | ------------ | -------------------------------------------------------- |
| `/checkout` | -            | Formulario multi-step (customer info → payment → review) |

## Guards / Políticas

- **authGuard**: Requiere usuario autenticado. Redirige a `/auth` si no logueado.
- **Validación de carrito**: Verifica `cartStore.count > 0` antes de permitir checkout. Redirige a `/cart` si vacío.

## Estados Clave

| Estado                    | Descripción                  | Impacto Usuario/Módulos                       |
| ------------------------- | ---------------------------- | --------------------------------------------- |
| `currentStep: 'customer'` | Formulario de datos de envío | Muestra campos name, email, address           |
| `currentStep: 'payment'`  | Selección de método de pago  | Monta Stripe Elements si método = 'card'      |
| `loading: true`           | Procesando pago              | Bloquea UI, muestra spinner                   |
| `error: string`           | Pago fallido                 | Muestra toast con mensaje, permite reintentar |

## Integración

### Stores/Composables Exportados

- **checkoutStore**: `setCustomer()`, `setPaymentMethod()`, `processCheckout()`, `reset()`, getters `customer`, `paymentMethod`, `loading`, `error`
- **useCheckoutForm**: Vee-Validate + Zod para validación reactiva del formulario
- **usePaymentCard**: Gestiona ciclo de vida de Stripe Elements (mount/unmount)

### Eventos Globales

- **No dispara eventos**: Operaciones síncronas
- **Escucha cambios de carrito**: Lee `cartStore.cartItems` y `totalPrice` para crear orden

### Variables de Entorno

- `VITE_STRIPE_PUBLISHABLE_KEY`: Public key de Stripe para frontend (usado en `stripe.ts`)

## Invariantes / Reglas UI

- **Persistencia en sessionStorage**: Datos del formulario guardados para evitar pérdida en refresh (limpiados tras checkout exitoso)
- **Stripe Elements condicional**: Solo monta si método = 'card', desmonta al cambiar método o salir de la vista
- **Tokenización antes de confirmar**: `autoTokenizeCard()` ejecuta tokenización de Stripe → luego `confirmPayment()` con token (no envía datos de tarjeta al backend)
