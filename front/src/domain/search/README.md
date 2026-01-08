# Search Domain

## Propósito

Búsqueda global de productos con debounce, historial de búsquedas recientes y resultados en tiempo real.

## Vistas / Rutas

**No tiene rutas propias**. Componentes integrados en:

- Header global (SearchBar)
- Dropdown de resultados (SearchResults)

## Guards / Políticas

- **Sin guards**: Búsqueda accesible sin autenticación

## Estados Clave

| Estado                     | Descripción              | Impacto Usuario/Módulos                     |
| -------------------------- | ------------------------ | ------------------------------------------- |
| `query: ''`                | Input vacío              | Muestra historial de búsquedas recientes    |
| `loading: true`            | Buscando (tras debounce) | Muestra spinner en dropdown                 |
| `results: []`              | Sin coincidencias        | Muestra "No se encontraron productos"       |
| `recentSearches: string[]` | Historial (max 5)        | Muestra en dropdown, click ejecuta búsqueda |

## Integración

### Stores/Composables Exportados

- **searchStore**: `search()`, `clearSearch()`, `addToHistory()`, `clearHistory()`, getters `query`, `results`, `recentSearches`, `loading`
- **useSearch**: Expone store con helpers reactivos
- **useSearchBar**: Gestiona input con debounce (300ms), validación y submit

### Eventos Globales

- **No dispara eventos**: Operaciones síncronas
- **Delega a Products**: Usa `searchProducts()` del dominio Products (no tiene endpoints propios)

### Variables de Entorno

- **No lee envs**: Usa configuración global de Axios

## Invariantes / Reglas UI

- **Debounce de 300ms**: No ejecuta búsqueda hasta 300ms tras último keystroke (evita requests innecesarios)
- **Historial en localStorage**: Búsquedas recientes persisten entre sesiones (max 5, FIFO)
- **Sin caché de resultados**: Cada búsqueda ejecuta request fresco (no reutiliza resultados previos)
