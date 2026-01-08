// Controla qué mensajes se muestran en la consola dependiendo de si estás en modo desarrollo o producción.

const isDev = typeof import.meta !== 'undefined' ? Boolean((import.meta as { env?: { DEV?: boolean } }).env?.DEV) : false

function safeConsole(method: 'info' | 'warn' | 'error', ...args: unknown[]) {
  try {

    console[method](...args)
  } catch {
    // ignore
  }
}

export const logger = {
  debug: (...args: unknown[]) => {
    if (isDev) safeConsole('info', ...args)
  },
  info: (...args: unknown[]) => {
    if (isDev) safeConsole('info', ...args)
  },
  warn: (...args: unknown[]) => {
    if (isDev) safeConsole('warn', ...args)
  },
  error: (...args: unknown[]) => {
    safeConsole('error', ...args)
  },
}

export default logger
