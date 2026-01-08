# Cart Domain

## Propósito

Carrito de compras con modo dual (local para guests, remoto para autenticados) y sincronización automática tras login.

## Vistas / Rutas

**No tiene rutas propias**. Componentes integrados en:

- Header global (mini-cart dropdown)
- Sidebar (CartDrawer)

## Guards / Políticas

- **Sin guards**: Carrito accesible sin autenticación (modo local)
- **Sincronización automática**: `syncCart()` ejecutado tras login exitoso en `authStore`

## Estados Clave

| Estado                   | Descripción        | Impacto Usuario/Módulos                        |
| ------------------------ | ------------------ | ---------------------------------------------- |
| `count: 0`               | Carrito vacío      | Oculta badge de contador, deshabilita checkout |
| `count > 0`              | Carrito con items  | Muestra badge, habilita checkout               |
| `loading: true`          | Operación en curso | Deshabilita botones add/remove                 |
| `isAuthenticated: false` | Modo local (guest) | Datos en localStorage, sin sync con backend    |

## Integración

### Stores/Composables Exportados

- **cartStore**: `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`, `syncCart()`, getters `cartItems`, `totalPrice`, `count`, `loading`
- **useMiniCartStore**: Store auxiliar para visibilidad del mini-cart drawer (UI state)

### Eventos Globales

- **Escucha login**: `authStore.login()` exitoso → ejecuta `cartStore.syncCart()` automáticamente
- **No dispara eventos**: Operaciones síncronas

### Variables de Entorno

- **No lee envs**: Usa configuración global de Axios

## Invariantes / Reglas UI

- **Modo dual transparente**: Usuario guest usa localStorage, autenticado usa backend. Cambio de modo invisible para el usuario.
- **Sincronización fusiona items**: Al hacer login, items locales se agregan al carrito remoto (no reemplazan), luego limpia localStorage.
- **Hidratación de productos**: Store carga datos completos de productos (`productCache`) para mostrar nombre/imagen sin depender del backend del carrito.
