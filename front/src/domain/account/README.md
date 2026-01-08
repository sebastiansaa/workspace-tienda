# Account Domain

## Propósito

Gestión de perfil del usuario autenticado (datos personales, preferencias, direcciones de envío).

## Vistas / Rutas

| Ruta       | Params/Props | Propósito                                                                  |
| ---------- | ------------ | -------------------------------------------------------------------------- |
| `/account` | -            | Perfil completo con tabs (datos, direcciones, órdenes, wishlist, settings) |

## Guards / Políticas

- **authGuard**: Requiere usuario autenticado. Redirige a `/auth` si no logueado.

## Estados Clave

| Estado                 | Descripción              | Impacto Usuario/Módulos               |
| ---------------------- | ------------------------ | ------------------------------------- |
| `isLoading: true`      | Primera carga de perfil  | Muestra skeleton loader               |
| `data: UserProfile`    | Perfil cargado con éxito | Renderiza datos en componentes        |
| `error: Error`         | Fallo al cargar perfil   | Muestra mensaje de error, botón retry |
| `isPending (mutation)` | Guardando cambios        | Deshabilita botones, muestra spinner  |

## Integración

### Stores/Composables Exportados

- **useAccountProfile**: Query Vue Query con `staleTime: 5min`, `gcTime: 10min`
- **useAccountProfileMutations**: Mutations para update/add/delete con invalidación automática de caché
- **No usa Pinia store**: Estado efímero manejado por Vue Query

### Eventos Globales

- **No dispara eventos**: Operaciones síncronas
- **Escucha refresh de auth**: `authStore.refresh()` llama `getAccountProfile()` para sincronizar perfil tras renovar tokens

### Variables de Entorno

- **No lee envs**: Usa configuración global de Axios

## Invariantes / Reglas UI

- **Caché inteligente**: Datos frescos por 5min, no refetch innecesarios. Mutations invalidan caché → refetch automático.
- **Direcciones con validación**: Formulario valida campos obligatorios (street, city, country, zipCode) antes de submit.
- **Sincronización con Auth**: `authStore.refresh()` actualiza perfil completo para mantener datos consistentes entre módulos.
