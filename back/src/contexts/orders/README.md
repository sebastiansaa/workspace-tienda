# Orders Context

Gestión del ciclo de vida de órdenes con endpoints de usuario y administrativos para supervisión global.

## Estructura de Carpetas

- `api/`: Controladores para órdenes de usuario y administración.
- `app/`: Casos de uso (crear desde carrito/items, cancelar, listar, completar).
- `domain/`: Entidades Order/OrderItem con constructores privados y factories `create/rehydrate`, reglas de transición y verificación del owner.
- `infra/`: Persistencia Prisma y adaptadores de integración.

## Endpoints

### Usuario (Requiere JWT)

- `POST /orders/from-cart`: Crear orden desde carrito.
- `POST /orders/from-items`: Crear orden desde items directos.
- `GET /orders`: Listar órdenes del usuario autenticado.
- `GET /orders/:id`: Detalle de orden propia.
- `PATCH /orders/:id/cancel`: Cancelar orden pendiente.
- `PATCH /orders/:id/pay`: Marcar orden propia como pagada.

### Administrativos (Requieren JWT + `@Roles('admin')`)

- `GET /orders/admin/list`: Listar todas las órdenes del sistema.
- `GET /orders/admin/:id`: Detalle de cualquier orden.
- `PATCH /orders/admin/:id/complete`: Marcar orden como completada.

## Integración con Inventory

- **Disponibilidad**: El adaptador de stock consulta el snapshot provisto por Products (campo `stock`) para rechazar órdenes sin inventario suficiente.
- **Reserva**: Una vez creada la orden, se reserva stock en Inventory (`ReserveStockUsecase`).
- **Fuente de Verdad**: Inventory sigue siendo la referencia oficial; considera mover la validación previa a Inventory para evitar desajustes.

## Casos de Uso

- `CreateOrderFromCartUsecase` y `CreateOrderFromItemsUsecase` requieren `OrderWriteRepository`, `CartReadRepository`/`ProductsReadRepository`, `OrderPricingService` y `ReserveStockPort` para que la orden solo se persista cuando el stock queda reservado.
- Al reconstruir desde la base de datos, la capa infra usa `OrderEntity.rehydrate` y `OrderItemEntity.rehydrate` para preservar timestamps y estados originales.

## Puertos Exportados

- `OrderPaymentReadPort` y `OrderPaymentWritePort`: permiten a `PaymentContext` validar y generar órdenes sin tocar Prisma directamente.
- `OrderPurchaseHistoryPort`: expone una consulta limitada para que `ReviewsContext` verifique compras previas.
- `OrderStockService` y `OrderReserveStock`: encapsulan la colaboración con Inventory apoyándose en `InventoryAvailabilityPort` y `InventoryReservationPort`.

## Seguridad

- **Usuario**: `@UseGuards(JwtAuthGuard)`.
- **Admin**: `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles('admin')`.

## Formato de Respuesta

`{ statusCode, message, data }`
