# Cart-Summary Domain

## Propósito

Vista de resumen del carrito en el flujo de pago (componentes de presentación pura sin lógica de negocio).

## Vistas / Rutas

| Ruta       | Params/Props | Propósito                                             |
| ---------- | ------------ | ----------------------------------------------------- |
| `/payment` | -            | Resumen de carrito read-only + acciones de navegación |

## Guards / Políticas

- **authGuard**: Requiere usuario autenticado (heredado de ruta `/payment`). Redirige a `/auth` si no logueado.
- **Validación de carrito**: Verifica `cartStore.count > 0` antes de mostrar resumen. Redirige a `/cart` si vacío.

## Estados Clave

| Estado                    | Descripción    | Impacto Usuario/Módulos                  |
| ------------------------- | -------------- | ---------------------------------------- |
| `cartStore.count === 0`   | Carrito vacío  | Redirige a `/cart` con toast             |
| `cartStore.loading: true` | Cargando datos | Muestra skeleton loader                  |
| `cartItems: CartItem[]`   | Items cargados | Renderiza filas de productos con totales |

## Integración

### Stores/Composables Exportados

- **usePaymentNavigation**: Helper para navegación entre pasos (`router.push('/checkout')`, `router.push('/cart')`)
- **No tiene store propio**: Lee datos directamente de `cartStore`

### Eventos Globales

- **No dispara eventos**: Operaciones síncronas
- **Escucha cambios de carrito**: Reactivo a `cartStore.cartItems`, `totalPrice`, `count`

### Variables de Entorno

- **No lee envs**: Usa configuración global de Axios

## Invariantes / Reglas UI

- **Solo presentación**: No modifica carrito, solo muestra resumen (componentes read-only)
- **Navegación delegada**: Botones "Continue" y "Cancel" usan `usePaymentNavigation()` para redirigir
- **Resumen en sidebar opcional**: Puede renderizarse en sidebar de checkout según diseño (no implementado actualmente)
