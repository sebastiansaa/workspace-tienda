# Products Domain

## Reseña
Módulo para catálogo de productos: búsqueda, detalles, CRUD admin. Usa Clean Architecture con capas separadas para mantenibilidad.

## Arquitectura
- **api/**: Cliente HTTP para backend (productsApi.ts).
- **app/**: Lógica de negocio (usecases con Zod) y hooks (api para datos, ui para navegación).
- **stores/**: Estado global con Pinia (selección de productos).
- **types/**: Esquemas y tipos 
- **ui/**: Componentes y vistas Vue (modulares, integran hooks).

## Componentes Clave
- Usecases: Validan y ejecutan operaciones.
- Hooks: Queries/mutations reactivas.
- Store: Estado tipado.
- UI: Componentes reutilizables.

## Integración
- Backend: API REST con Axios.
- Dependencias: Vue 3, Pinia, Vue Query, Zod.
- Rutas: Públicas; admin con guards.
- Estados: Loading, vacío, selección.

### Backend NestJS
- Los DTOs consumidos se alinean con `ProductDTO` y `ProductListDTO` definidos en `src/client/interfacesBackend.ts`.
- El cliente HTTP desanida la respuesta `{ statusCode, message, data }` del backend y expone directamente el payload.
- Helpers (`productImages.ts`) resuelven imágenes (`images[]`) y placeholders para mantener la UI coherente.


