# Products Context

Catálogo central de productos con endpoints públicos de consulta y endpoints administrativos protegidos para mutaciones.

## Estructura de Carpetas

- `api/`: Controladores para búsqueda pública y gestión administrativa.
- `app/`: Casos de uso (listar, buscar, crear/actualizar, eliminar, restaurar).
- `domain/`: Entidades ricas, Value Objects (Slug, Price, Stock) y reglas de negocio.
- `infra/`: Persistencia Prisma, mappers de datos y repositorios optimizados.

## Endpoints

### Públicos (Sin Autenticación)

- `GET /products`: Listado paginado de productos activos.
- `GET /products/search`: Búsqueda por texto en título/descripción.
- `GET /products/:id`: Detalle de producto por ID.

### Administrativos (Requieren JWT + `@Roles('admin')`)

- `POST /products`: Crear o actualizar producto (upsert basado en `id`).
- `GET /products/admin/low-stock?threshold=5`: Listar productos con stock bajo.
- `DELETE /products/:id?hard=true`: Eliminación lógica (default) o física.
- `POST /products/:id/restore`: Restaurar producto eliminado lógicamente.
- `POST /products/:id/upload-image`: Subir imagen de producto.

## Seguridad

- **Públicos**: Acceso sin restricciones.
- **Admin**: `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles('admin')`.

## Notas de Integración

- **Stock**: El campo `Product.stock` persiste pero la fuente de verdad es **Inventory Context** (`onHand - reserved`).
- **Formato de Respuesta**: `{ statusCode, message, data }`.
- **Puertos**: Expone `ProductReadOnlyPort` y `ProductValidationPort` para lecturas externas controladas y validación de productos reseñables.
