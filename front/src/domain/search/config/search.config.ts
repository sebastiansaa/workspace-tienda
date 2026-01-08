/**
 * Configuración centralizada para el módulo de búsqueda
 */
export const SEARCH_CONFIG = {
    /** Tiempo de debounce en milisegundos antes de actualizar el término de búsqueda */
    DEBOUNCE_MS: 200,

    /** Mínimo de caracteres requeridos para iniciar una búsqueda */
    MIN_CHARS: 2,

    /** Número inicial de resultados mostrados en el dropdown */
    INITIAL_RESULTS_SHOWN: 5,

    /** Incremento de resultados al hacer clic en "ver más" */
    RESULTS_INCREMENT: 5,

    /** Tiempo de cache (staleTime) para la query de productos en milisegundos */
    QUERY_STALE_TIME: 1000 * 60 * 30, // 30 minutos
} as const

export type SearchConfig = typeof SEARCH_CONFIG
