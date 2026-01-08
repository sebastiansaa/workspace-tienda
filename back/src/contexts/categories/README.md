# Categories Context

Clasificación y agrupación lógica de productos con endpoints públicos de consulta y administrativos de gestión.

## Estructura de Carpetas

- `api/`: Controladores, DTOs y mappers para consulta y administración.
- `app/`: Casos de uso para listar, obtener, crear, actualizar y eliminar categorías.
- `domain/`: Entidad Category, Value Objects y errores de unicidad/formato.
- `infra/`: Adaptadores Prisma para persistencia y lectura.

## Endpoints

### Públicos (Sin Autenticación)

- `GET /categories`: Listado completo de categorías activas.
- `GET /categories/:id`: Detalle de categoría específica.

### Administrativos (Requieren JWT + `@Roles('admin')`)

- `POST /categories`: Crear nueva categoría.
- `PATCH /categories/:id`: Actualizar metadatos de categoría.
- `DELETE /categories/:id`: Eliminar categoría.

## Seguridad

- **Públicos**: Acceso sin restricciones.
- **Admin**: `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles('admin')`.

## Formato de Respuesta

`{ statusCode, message, data }`
