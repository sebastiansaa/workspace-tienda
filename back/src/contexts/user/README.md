# User Context

Gestión de perfiles de usuario con endpoints de autoservicio y administrativos para gestión global.

## Estructura de Carpetas

- `api/`: Controladores, DTOs y mappers para perfiles y administración.
- `app/`: Casos de uso (perfil, direcciones, listado admin, cambio de estado).
- `domain/`: Entidades User/Address con constructores privados, factories `create/rehydrate`, Value Objects (Email, Name, Phone, Preferences, Status) y validaciones de ownership.
- `infra/`: Adaptadores de persistencia Prisma y repositorios.

## Endpoints

### Autoservicio (Requiere JWT)

- `GET /users/me`: Perfil del usuario autenticado.
- `PATCH /users/me`: Actualizar nombre, teléfono y preferencias.
- `POST /users/me/addresses`: Registrar nueva dirección de envío.
- `PATCH /users/me/addresses/:id`: Editar dirección existente.
- `DELETE /users/me/addresses/:id`: Eliminar dirección.

### Administrativos (Requieren JWT + `@Roles('admin')`)

- `GET /users/admin/list`: Listado completo de usuarios.
- `GET /users/admin/:id`: Perfil detallado de usuario por ID.
- `PATCH /users/admin/:id/status`: Activar/Inactivar usuario.

## Seguridad

- **Autoservicio**: `@UseGuards(JwtAuthGuard)`.
- **Admin**: `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles('admin')`.

## Formato de Respuesta

`{ statusCode, message, data }`

## Notas de Dominio

- `UserEntity` encapsula `PhoneVO` y `PreferencesVO`, normaliza timestamps con `DateVO` y evita direcciones duplicadas mediante `InvalidAddressError`.
- La capa infra rehidrata entidades con `UserEntity.rehydrate` y `AddressEntity.rehydrate`, por lo que ningún constructor público queda expuesto fuera del dominio.
- Se expone el `UserVerificationPort` para que otros bounded contexts validen la existencia del usuario sin depender de repositorios Prisma.
