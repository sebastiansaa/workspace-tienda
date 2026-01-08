# Tienda Lite Backend

> NestJS · DDD · Hexagonal Architecture · CQRS · Prisma · PostgreSQL

Backend modular con arquitectura hexagonal estricta y domain-driven design. Cada contexto es autónomo y se comunica solo mediante puertos definidos.

---

## 🏗️ Stack & Principios

- **NestJS** + TypeScript estricto (sin `any`)
- **PostgreSQL** + Prisma ORM
- **DDD**: Entidades ricas, Value Objects, errores de dominio
- **Hexagonal**: Domain sin frameworks | Infra reemplazable | API adapta HTTP
- **CQRS**: Commands (write) | Queries (readonly), adaptadores separados
- **Dependency Injection**: Tokens en `constants.ts` para intercambio de adaptadores

---

## 📁 Estructura por Contexto

```
src/contexts/<context>/
  ├── domain/       # Rich entities, VOs, errores, invariantes
  ├── app/          # UseCases, Commands/Queries, Puertos (read + write)
  ├── infra/        # Adaptadores (Prisma, servicios externos), Mappers
  ├── api/          # Controllers (Validacion de entradas y consistencia en respuestas), DTOs, Mappers HTTP, Guards
  ├── constants.ts  # Tokens DI
  └── <context>.module.ts
```

**Contextos activos:** Auth, User, Products, Categories, Cart, Orders, Payment, Inventory, Reviews, Admin

---

## 🔐 Seguridad & Roles

| Nivel           | Rutas                                                         | Acceso            |
| --------------- | ------------------------------------------------------------- | ----------------- |
| **Público**     | `/products`, `/categories`, `/reviews/product/:productId`     | Sin autenticación |
| **Usuario JWT** | `/cart`, `/orders`, `/users`, `/reviews`                       | Token JWT válido  |
| **Admin**       | Endpoints `/admin/*` en cada contexto (`/products/admin`, `/payments/admin`, etc.) | Rol `admin`       |

**Arquitectura Descentralizada**: Cada contexto (Products, Categories, Users, Orders, Payments) expone sus propios endpoints administrativos protegidos con `@Roles('admin')`.

**Inventory**: `GET /inventory/:productId` es público. Endpoints de mutación (`increase`, `decrease`, `reserve`, `release`, `movements`) requieren rol `admin`.

**Guards**: `JwtAuthGuard` + `RolesGuard` con decorador `@Roles('admin')`

---

## 🔄 Estados Clave

| Entidad     | Estados                                        | Notas                              |
| ----------- | ---------------------------------------------- | ---------------------------------- |
| **Orden**   | `pending` → `paid` → `completed` / `cancelled` | Máquina de estados estricta        |
| **Pago**    | `pending` → `succeeded` / `failed`             | Estados finales inmutables         |
| **Usuario** | `ACTIVE` / `INACTIVE` / `BANNED`               | Login bloqueado en INACTIVE/BANNED |
| **Stock**   | `onHand` + `reserved`                          | Disponible = onHand - reserved     |

---

## 🧪 Testing

| Tipo            | Alcance                         | Base de Datos         | Velocidad |
| --------------- | ------------------------------- | --------------------- | --------- |
| **Unit**        | Dominio + UseCases (mocks)      | —                     | ⚡⚡⚡    |
| **Integration** | Nest + Prisma + módulos reales  | Test DB (puerto 5433) | ⚡⚡      |
| **E2E**         | App completa, flujos de negocio | Test DB (puerto 5433) | ⚡        |

**Limpieza**: Truncado de tablas + teardown Prisma tras cada suite  
**Comandos**:

```bash
npm run test              # Unit + Integration
npm run test:e2e          # End-to-end
npm run test:cov          # Cobertura
npm run type              # Verificación de tipos estricta
```

---

## 🐘 PostgreSQL: Local vs Contenedor

**Contenedor mapeado a `localhost:5433`** para evitar colisión con PostgreSQL local en `5432`.

```bash
# Ver contenedores activos
docker ps

# Verificar tablas en contenedor
docker compose exec postgres psql -U postgres -d eccomerce -c "\dt"
```

Si prefieres `5432 → 5432`, detén PostgreSQL local y remapea puerto en `docker-compose.yml`.

---

## 🚀 Comandos Rápidos

### Instalación

```bash
npm install
npx prisma generate
```

### Migraciones

```bash
npx prisma migrate dev --name <migration-name>
npx prisma studio  # UI para explorar DB
```

### Desarrollo

```bash
docker compose up -d        # Levantar PostgreSQL
npm run start:dev           # Modo watch (hot-reload)
```

### Producción

```bash
npm run build
npm run start:prod
```

---

## 📖 Swagger & Documentación

- Swagger UI disponible en `/api` (development)
- Cada contexto tiene `README.md` con endpoints, guards, invariantes
- Decoradores OpenAPI en Controllers/DTOs mantienen contratos sincronizados

---

## ✅ Checklist de Desarrollo

1. Define entidad + VOs + errores en `domain/`
2. Crea puertos (read/write si aplica CQRS) en `app/`
3. Implementa adaptadores en `infra/` con mappers ORM↔Entidad
4. Expone API: Controller → DTO → Mapper → Command/Query → UseCase
5. Añade guards/roles y documenta en Swagger
6. Escribe tests: unit → integration → e2e

---

## 🧭 Comunicación entre Contextos

- Solo mediante **puertos readonly** definidos en `Application`
- Ejemplos: `OrderReadOnlyPort`, `ProductReadOnlyPort`
- **Nunca** importar entidades/VOs de otro dominio (anti-corruption layer)

---

## 📚 Recursos

- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [DDD Patterns](https://martinfowler.com/bliki/DomainDrivenDesign.html)
