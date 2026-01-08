# Inventory Context

Este contexto gestiona el stock de productos, permitiendo consultar la disponibilidad actual y registrar movimientos de inventario internos o generados por ventas.

## Estructura de Carpetas

- `api/`: Controladores y DTOs para acceso público.
- `app/`: Casos de uso de negocio (consultar, incrementar, reservar stock).
- `domain/`: Entidades de dominio, lógica de stock y errores específicos.
- `infra/`: Adaptadores de persistencia (Prisma) y puertos para integración con Admin.

## Casos de Uso y Endpoints

- `GET /inventory/:productId`: Consulta la cantidad de stock disponible para un producto.
- `GET /inventory/:productId/movements`: (Admin Only) Recupera el historial de movimientos de stock.
- `POST /inventory/:productId/increase`: (Admin Only) Incrementa stock con motivo.
- `POST /inventory/:productId/decrease`: (Admin Only) Disminuye stock con motivo.
- `POST /inventory/:productId/reserve`: (Admin Only) Reserva stock con motivo.
- `POST /inventory/:productId/release`: (Admin Only) Libera stock reservado con motivo.

## Ejemplo de Uso

```typescript
// Consulta de stock disponible
const stock = await getStockUseCase.execute({ productId: 101 });
console.log(`Stock actual: ${stock.quantity}`);
```

## Notas de Integración

- **Seguridad**: `GET /inventory/:productId` es público. El resto de operaciones están protegidas con `JwtAuthGuard` + `RolesGuard` y `@Roles('admin')`.
- **Respuesta API**: Todas las respuestas usan el formato `{ statusCode, message, data }`.
- **Relaciones**: Se integra con `ProductsContext` mediante `productId`.
- **Puertos Compartidos**: Expone `InventoryAvailabilityPort` y `InventoryReservationPort` para que otros contextos verifiquen stock o reserven unidades sin acceder a repositorios internos.
