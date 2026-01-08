// Configuración compartida entre todos los dominios
export const SHARED_CONFIG = {
  // Breakpoints compartidos para responsive design
  breakpoints: {
    mobile: 1023,        // max-width para mobile
    desktop: 1024,      // min-width para desktop/tablet horizontal
  },

  // Cache compartido para todos los queries
  cache: {
    staleTime: 1000 * 60 * 5,    // 5 minutos - tiempo antes de refetch
    gcTime: 1000 * 60 * 30,      // 30 minutos - garbage collection
    retry: 3,                    // intentos de reintento en error
  },

  // Timeouts compartidos
  api: {
    timeout: 10000,              // 10 segundos timeout por defecto
  },

}
