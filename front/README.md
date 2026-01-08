# practicaeco

**Ecommerce moderno sin usuarios, solo comprar.**

Este proyecto es una tienda online construida con Vue 3, Pinia, Vite y TanStack Query, que permite explorar productos, navegar por categorías, agregar al carrito y simular el proceso de compra y pago, con autenticación . El objetivo es demostrar una arquitectura limpia, modular y profesional, enfocada en la experiencia de compra directa y el código mantenible.

## Características principales

- Navegación profesional y dinámica por categorías (consumidas desde API)
- Visualización de productos filtrados por categoría
- Carrito de compras funcional
- Simulación de proceso de pago
- Sin registro ni login: cualquier visitante puede comprar
- Arquitectura limpia, modular y DRY
- Uso de Vue 3, Pinia, Vue Router, TanStack Query, Axios, Vee-Validate, Zod, Toastification y Heroicons

## Arquitectura
- **api/**: Cliente HTTP para backend .
- **app/**: Lógica de negocio  y hooks .
- **stores/**: Estado global con Pinia.
- **types/**: Esquemas y tipos 
- **ui/**: Componentes y vistas Vue .

## Requisitos

- Node.js ^20.19.0 o >=22.12.0
- npm

## Instalación

```bash
npm install
```

## Scripts

- `npm run dev` — Inicia el servidor de desarrollo (Vite)
- `npm run build` — Compila el proyecto para producción
- `npm run preview` — Previsualiza el build de producción
- `npm run lint` — Linting con ESLint
- `npm run format` — Formatea el código con Prettier
- `npm run type-check` — Verifica tipos con TypeScript

## Estructura principal

```
src/
  components/
  views/
  router/
  stores/
  shared/
  App.vue
  main.ts
public/
```

## Tecnologías

- Vue 3
- Pinia
- jwt-decode
- Vue Router
- Vite
- **TypeScript** (tipado estricto en toda la app)
- Axios
- TanStack Vue Query
- Vee-Validate + Zod
- Heroicons
- Vue Toastification

## Uso de TypeScript

Todo el proyecto está desarrollado con TypeScript, incluyendo componentes, stores y composables. Se recomienda usar un editor con soporte para TS (como VS Code) para aprovechar el tipado y la autocompletación.

## Para decisiones de diseño y arquitectura consulta `DECISIONS.md`.

> Proyecto para práctica de arquitectura limpia, navegación y tipado estricto en Vue 3.

## Resumen operativo (front)
- Propósito: vitrina eCommerce con búsqueda, carrito, checkout y panel admin.
- Endpoints usados: auth (`/auth/*`), productos (`/products`, `/products/search`), categorías (`/categories`, `/admin/categories`), carrito (`/cart`), órdenes (`/orders`), pagos (`/payments/*`), admin (`/admin/*`).
- Roles requeridos: público para browse; usuario autenticado para carrito/checkout/órdenes; admin para `/admin/*` y low-stock.
- Estados posibles: autenticado/no, carrito vacío/lleno, orden `pending|paid|completed|cancelled`, pago `pending|succeeded|failed`.

## Checkout y Pagos (Mock)

Este proyecto incluye un **flujo completo de checkout con simulación (mock) de pagos**, preparado para migrar a Stripe cuando tengas un backend real.

STORE:

- Encapsulación: no exponer ref directamente; usar computed y funciones; mantener estado privado en defineStore.
- Acciones controladas: todas las mutaciones pasan por acciones (setX, resetX), nunca desde el componente.
- Tipado: definir interfaces claras (Customer, PaymentMethod), evitar any, usar Result<T> o unions discriminados.
- Modularidad: separar stores por dominio (checkoutStore, userStore), evitar monolíticos, responsabilidades claras.
- Naming: convenciones consistentes (onX, setX, resetX), evitar nombres ambiguos.
- Reset y limpieza: incluir funciones (resetStore, resetErrors, resetPaymentState) para volver al estado inicial.
- Testabilidad: acciones puras y predecibles, mock de dependencias externas, cubrir éxito, error y excepciones.
- Errores y logging: centralizar manejo con composables (useErrorHandler), usar logger, mensajes claros y diferenciados.
- Separación de dominio: helpers y constantes en carpetas propias, el store solo orquesta lógica de negocio.
- Compatibilidad SSR/persistencia: evitar acceso directo a window/document, usar plugins de persistencia si se requiere.
- Performance: usar computed para estado derivado, evitar watchers innecesarios.
- Documentación: comentarios concisos en acciones críticas, explicar convenciones en README del dominio.

composables:

- Encapsulación: no exponer ref crudos, usar computed y funciones; lógica interna privada, API pública mínima.
- Tipado: definir interfaces claras, evitar any, usar genéricos y tipos discriminados.
- Vue Query (si aplica): queryKey estable, configurar staleTime/cacheTime/retry, usar enabled condicional, centralizar mutationFn y manejar errores con onError.
- VueUse (si aplica): aprovechar composables existentes, evitar duplicar lógica, usar utilidades de performance (watchDebounced, useThrottleFn).
- Naming: prefijo useX, nombres semánticos y consistentes.
- Modularidad: separar composables por dominio, evitar monolíticos, reutilizar composables pequeños.
- Errores y logging: manejar errores con try/catch o onError, usar logger centralizado, feedback claro.
- Testabilidad: funciones puras, mock de dependencias externas, cubrir estados (loading, success, error).
- Compatibilidad SSR/persistencia: evitar acceso directo a window/document, usar useLocalStorage/useSessionStorage, validar en entornos SSR.
- Performance: usar computed/memoization, evitar watchers innecesarios, optimizar queries con suspense y prefetchQuery si se usa Vue Query.
- Documentación: comentarios concisos en funciones críticas, explicar convenciones en README de domain.

services:

- Responsabilidad única
- Cada service debe encargarse de un dominio específico (ej. PaymentService, UserService).
- Evitar que un mismo service maneje múltiples responsabilidades.
- Tipado estricto
- Definir DTOs e interfaces claras para entradas y salidas.
- Evitar any, preferir tipos discriminados o genéricos controlados (Result<T>).
- Encapsulación de lógica de negocio
- Los services deben contener la lógica de negocio, no los stores ni los componentes.
- Los stores/composables solo orquestan llamadas a los services.
- Errores y trazabilidad
- Manejar errores con excepciones claras (DomainError, ValidationError).
- Usar logging centralizado para registrar fallos y métricas.
- Testabilidad
- Services deben ser fácilmente testeables con mocks de dependencias externas (API, DB).
- Diseñar funciones puras cuando sea posible.
- Consistencia en naming
- Sufijo Service para clases o funciones de dominio (AuthService, CheckoutService).
- Métodos con nombres semánticos (processPayment, validateUser).
- Separación de infraestructura
- No mezclar lógica de negocio con detalles técnicos (HTTP, DB).
- Usar adaptadores/repositorios para acceso a datos.
- agregar unh pequeña documentacion e el readme del domain

✅ Buenas prácticas para Helpers

- Funciones pequeñas y puras
- Helpers deben ser funciones simples, sin efectos secundarios.
- Evitar dependencias innecesarias.
- Reutilización y modularidad
- Colocar helpers en carpetas por dominio (helpers/payment, helpers/validation).
- Evitar duplicar lógica en múltiples lugares.
- Tipado estricto
- Definir tipos de parámetros y retorno.
- Evitar any, preferir tipos concretos o genéricos bien definidos.
- Consistencia en naming
- Prefijo claro según acción (formatX, parseX, validateX).
- Evitar nombres ambiguos como doStuff.
- Testabilidad
- Helpers deben ser fácilmente testeables en aislamiento.
- Cubrir casos límite y entradas inválidas.
- Documentación mínima
- Comentarios concisos explicando propósito y uso.
- Ejemplos de entrada/salida en el README del domain
