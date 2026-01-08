# Admin Domain

## Propósito

Panel de administración completo con CRUD de usuarios, productos, órdenes, pagos, inventario y categorías.

## Vistas / Rutas

| Ruta       | Params/Props | Propósito                                                                                |
| ---------- | ------------ | ---------------------------------------------------------------------------------------- |
| `/admin`   | -            | Dashboard con estadísticas generales                                                     |
| `/admin/*` | -            | Rutas hijas para cada sección (users, products, orders, payments, inventory, categories) |

## Guards / Políticas

- **adminGuard**: Requiere usuario autenticado + rol `admin`. Verifica `authStore.isLogged` → `requireAdmin()`. Redirige a `/auth` si falla.

## Estados Clave

| Estado                 | Descripción         | Impacto Usuario/Módulos              |
| ---------------------- | ------------------- | ------------------------------------ |
| `activeTab: 'users'`   | Tab activo en panel | Renderiza componente correspondiente |
| `isLoading: true`      | Cargando datos      | Muestra skeleton loader              |
| `error: Error`         | Fallo en operación  | Muestra toast con mensaje            |
| `isPending (mutation)` | Guardando cambios   | Deshabilita botones, muestra spinner |

## Integración

### Stores/Composables Exportados

- **adminStore**: `setActiveTab()`, `selectEntity()`, `resetFilters()`, getters `activeTab`, `selectedEntity`, `filters`, `loading`
- **21 composables Vue Query**: Queries y mutations especializadas por entidad (useAdminUsers, useAdminProducts, useAdminOrders, etc.)
- **Helpers de autorización**: `isAdmin()`, `isAdminUser()`, `requireAdmin()` (exportados desde `helpers/permissions.ts`)

### Eventos Globales

- **No dispara eventos**: Operaciones síncronas
- **Escucha cambios de auth**: `authStore.isAdmin` reactivo determina acceso

### Variables de Entorno

- **No lee envs**: Usa configuración global de Axios

## Invariantes / Reglas UI

- **Validación de rol en cada operación**: Composables admin verifican `isAdmin()` antes de ejecutar mutations (doble validación: frontend + backend)
- **Invalidación automática de caché**: Mutations invalidan queries relacionadas → refetch automático (ej: crear producto invalida `['admin', 'products']`)
- **Upload de imágenes con FormData**: `useAdminUploadProductImage()` crea FormData con `Content-Type: multipart/form-data` para subir archivos
