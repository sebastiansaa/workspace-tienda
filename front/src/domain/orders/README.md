# Orders Domain

## Propósito

Historial de órdenes del usuario con detalle individual y acciones de estado (cancelar, marcar como pagado/completado).

## Vistas / Rutas

| Ruta      | Params/Props | Propósito                                  |
| --------- | ------------ | ------------------------------------------ |
| `/orders` | -            | Listado de órdenes del usuario autenticado |

**Nota**: Detalle de orden se muestra en modal/sidebar (no ruta separada actualmente)

## Guards / Políticas

- **authGuard**: Requiere usuario autenticado. Redirige a `/auth` si no logueado.

## Estados Clave

| Estado                    | Descripción        | Impacto Usuario/Módulos                                         |
| ------------------------- | ------------------ | --------------------------------------------------------------- |
| `loading: true`           | Cargando órdenes   | Muestra skeleton loader                                         |
| `orders: []`              | Sin órdenes        | Muestra "No tienes órdenes aún"                                 |
| `selectedOrder: Order`    | Orden seleccionada | Muestra detalle en modal con items, customer, payment, shipping |
| `order.status: 'PENDING'` | Orden pendiente    | Permite cancelación                                             |

## Integración

### Stores/Composables Exportados

- **ordersStore**: `fetchOrders()`, `fetchOrderById()`, `createOrder()`, `cancelOrder()`, `markAsPaid()`, `markAsComplete()`, getters `orders`, `selectedOrder`, `loading`, `error`
- **useOrders**: Composable que expone `ordersStore` con helpers reactivos

### Eventos Globales

- **Escucha checkout exitoso**: `checkoutStore` crea orden → redirige a `/orders/:id`
- **No dispara eventos**: Operaciones síncronas

### Variables de Entorno

- **No lee envs**: Usa configuración global de Axios

## Invariantes / Reglas UI

- **Sin Vue Query**: Store Pinia gestiona caché manualmente (no auto-refetch, requiere refresh manual)
- **Acciones admin opcionales**: `markAsPaid()` y `markAsComplete()` pueden requerir rol admin según implementación del backend (frontend no valida, delega al backend)
- **Estados inmutables**: COMPLETED y CANCELLED son finales, UI deshabilita acciones en estos estados
