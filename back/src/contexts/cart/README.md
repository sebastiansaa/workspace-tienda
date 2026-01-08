# Cart Context

Gestión del carrito de compras persistente para usuarios autenticados, integrando validación de productos y cálculo automático de totales.

## Estructura de Carpetas

- `api/`: Controladores, DTOs y mappers para la gestión del carrito por el usuario.
- `app/`: Casos de uso de mutación (agregar, actualizar, eliminar) y consulta.
- `domain/`: Entidades Cart/CartItem con constructores privados y factories `create/rehydrate`, validaciones de cantidad y errores específicos.
- `infra/`: Persistencia Prisma y adaptadores para consultar stock de productos.

## Casos de Uso y Endpoints

- `GET /cart`: Recupera el carrito actual del usuario (lo crea si no existe).
- `POST /cart/items`: Agrega un producto al carrito previa validación de stock con Inventory.
- `PUT /cart/items/:productId`: Actualiza la cantidad de un ítem existente.
- `DELETE /cart/items/:productId`: Remueve un producto específico del carrito.
- `DELETE /cart`: Vacía completamente el contenido del carrito.

## Ejemplo de Uso

- `AddItemToCartUseCase` demanda los puertos `CartReadRepository`, `CartWriteRepository`, `CartPricingService` y `StockAvailabilityPort`. El stock se valida siempre antes de persistir cambios.

```typescript
// Agregar ítem al carrito
const cart = await addItemUseCase.execute({
  userId: 'user-123',
  productId: 501,
  quantity: 2,
});
// CartEntity expone solo getters; las mutaciones internas usan factories y métodos ricos.
console.log(`Total carrito: ${cart.totalPrice}`);
```

## Notas de Integración

- **Seguridad**: Requiere `JwtAuthGuard`.
- **Respuesta API**: Todas las respuestas usan el formato `{ statusCode, message, data }`.
- **Relaciones**: Consulta `ProductsContext` para validar existencia/precio del producto y `InventoryContext` para verificar disponibilidad antes de agregar items. Las entidades se rehidratan a través de `CartEntity.rehydrate` al leer desde Prisma.
- **Puertos Compartidos**: Exporta `CartSnapshotPort`, `CartPricingService` y `CartStockService` para que otros bounded contexts consulten información del carrito sin acceder a la infraestructura.
