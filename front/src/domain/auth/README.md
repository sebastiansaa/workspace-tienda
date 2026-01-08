# Auth Domain

## Propósito

Autenticación de usuarios con JWT, refresh automático de tokens y control de acceso basado en roles.

## Vistas / Rutas

| Ruta    | Params/Props | Propósito                    |
| ------- | ------------ | ---------------------------- |
| `/auth` | -            | Login y registro de usuarios |

## Guards / Políticas

- **authGuard**: Protege rutas autenticadas (`/checkout`, `/orders`, `/account`). Redirige a `/auth` si no logueado.
- **adminGuard**: Protege rutas admin (`/admin`). Verifica `isLogged` + `isAdmin`. Redirige a `/auth` si falla.

## Estados Clave

| Estado                | Descripción               | Impacto Usuario/Módulos                             |
| --------------------- | ------------------------- | --------------------------------------------------- |
| `isLogged: false`     | Sin access token válido   | Redirige a `/auth`, oculta opciones autenticadas    |
| `isLogged: true`      | Access token vigente      | Acceso a rutas protegidas, muestra perfil en header |
| `isAdmin: true`       | Usuario con rol `admin`   | Acceso a panel admin, opciones CRUD visibles        |
| `refreshToken válido` | Refresh token no expirado | Renueva access token sin re-login                   |

## Integración

### Stores/Composables Exportados

- **authStore**: `login()`, `register()`, `logout()`, `refresh()`, `loadFromStorage()`, getters `isLogged`, `isAdmin`, `user`
- **useLoginForm**: Validación reactiva de formulario login (Vee-Validate + Zod)
- **useRegisterForm**: Validación reactiva de formulario registro

### Eventos Globales

- **No dispara eventos**: Operaciones síncronas
- **No escucha eventos**: Autónomo

### Variables de Entorno

- **No lee envs**: Tokens almacenados en localStorage

## Invariantes / Reglas UI

- **Refresh automático**: Interceptor Axios detecta 401 → ejecuta `refresh()` → reintenta request original (cola de reintentos)
- **Logout limpia todo**: Revoca tokens en backend + limpia localStorage + resetea store (no redirige, responsabilidad del componente)
- **Sincronización al inicio**: `main.ts` ejecuta `loadFromStorage()` → restaura tokens → intenta `refresh()` → si falla, limpia sesión
