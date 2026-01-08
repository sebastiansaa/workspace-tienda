# Shared Context

Este contexto contiene componentes, tipos y utilidades que son compartidos a través de múltiples contextos del dominio.

## Estructura

- `filters/`: Filtros globales (ej. `DomainExceptionFilter`).
- `v-o/`: Objetos de Valor fundamentales (`EmailVO`, `NameVO`, `DateVO`, `Slug`, etc.).
- `interfaces/`: Definiciones de contratos compartidos (ej. `AuthUserPayload`).
- `errors/`: Excepciones base y compartidas.
- `ports/`: Puertos hexagonales neutrales (ej. `ProductReadOnlyPort`, `InventoryAvailabilityPort`, `OrderPaymentReadPort`).

## Principios

1. **Reutilización**: Solo el código que es verdaderamente ubicuo o duplicado en más de dos contextos debe residir aquí.
2. **Independencia**: Los componentes en `shared` no deben depender de otros contextos (auth, user, etc.).
3. **Invariantes**: Los VOs en `shared` deben encapsular validaciones estándar para asegurar la integridad de los datos en toda la aplicación.
4. **Contratos explícitos**: Los puertos expuestos aquí modelan la colaboración entre bounded contexts sin filtrar detalles de infraestructura.
