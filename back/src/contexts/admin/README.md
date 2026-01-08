# Admin Context (Dashboard & Cross-Context Orchestration)

## Propósito

El contexto `Admin` proporciona un **dashboard consolidado** con métricas agregadas de la plataforma. A diferencia de versiones anteriores, ya **NO centraliza endpoints de gestión** - cada contexto expone sus propios endpoints administrativos con la debida autorización.

### Principios Arquitectónicos:

- **Context Autonomy**: Cada bounded context (Products, Categories, User, Orders, Payment) gestiona sus propios endpoints admin.
- **Dashboard Only**: Admin se limita a mostrar estadísticas y métricas consolidadas.
- **No Orchestration**: Las operaciones CRUD de cada dominio residen en su controlador nativo con `@Roles('admin')`.

## Arquitectura Decentralizada

### Endpoints por Contexto:

- **Products** (`/products/*`): Gestión de productos con endpoints admin protegidos por roles.
- **Categories** (`/categories/*`): Gestión de categorías con endpoints admin protegidos.
- **Users** (`/users/*`): Gestión de usuarios con rutas `/admin/list`, `/admin/:id`, etc.
- **Orders** (`/orders/*`): Gestión de órdenes con rutas `/admin/list`, `/admin/:id`, etc.
- **Payments** (`/payments/*`): Auditoría de pagos con rutas `/admin/list`, `/admin/:id`.
- **Inventory** (`/inventory/*`): `GET /inventory/:productId` es público; ajustes de stock y movimientos requieren rol `admin`.

Consulta el README de cada contexto para los endpoints específicos.

## Endpoints

### Dashboard (Único Endpoint)

- `GET /admin/dashboard`: Estadísticas globales (ventas, usuarios activos, stock bajo).

## Seguridad

- **Autenticación**: JWT válido requerido (`JwtAuthGuard`).
- **Autorización**: Solo usuarios con rol `admin` (`RolesGuard` + `@Roles('admin')`).

## Formato de Respuesta

Todas las respuestas siguen: `{ "statusCode": number, "message": string, "data": any | null }`.
