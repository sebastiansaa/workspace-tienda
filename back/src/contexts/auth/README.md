# Auth Context

Gestión de autenticación basada en JWT, proporcionando registro, login, rotación de tokens (refresh tokens) y revocación de acceso.

## Estructura de Carpetas

- `api/`: Controladores, DTOs y decoradores para exponer autenticación.
- `app/`: Casos de uso de autenticación, lógica de tokens y validaciones.
- `domain/`: Entidades User/RefreshToken con constructores privados, factories `create/rehydrate`, Value Objects (Email, PasswordHash, Role, Timestamp) y reglas de roles/timestamps.
- `infra/`: Estrategias de Passport (JWT), guards y repositorios Prisma.

## Casos de Uso y Endpoints

- `POST /auth/register`: Registro de nuevos usuarios con email único.
- `POST /auth/login`: Autenticación y emisión de par de tokens (Access/Refresh).
- `POST /auth/refresh`: Renovación de Access Token usando Refresh Token.
- `POST /auth/logout`: Revocación total de tokens del usuario.
- `GET /auth/me`: Verificación de identidad y obtención de perfil básico.

## Ejemplo de Uso

- Los casos de uso (`register`, `login`, `refresh`) crean o rehidratan entidades exclusivamente mediante factories para garantizar consistencia en los VO y timestamps.

```typescript
// Login de usuario
const { accessToken, user } = await loginUseCase.execute({
  email: 'user@example.com',
  password: 'securePassword123',
});
// RefreshTokenEntity se genera con `create` al rotar las sesiones.
console.log(`Bienvenido ${user.email}`);
```

## Notas de Integración

- **Seguridad**: Implementa `JwtAuthGuard` y `RolesGuard` para uso global.
- **Validación**: Passwords hasheados con bcrypt.
- **Respuesta API**: Todas las respuestas usan el formato `{ statusCode, message, data }`.
- **Persistencia**: Prisma mapea filas a dominio mediante `UserEntity.rehydrate` y `RefreshTokenEntity.rehydrate`, evitando exponer constructores públicos.
