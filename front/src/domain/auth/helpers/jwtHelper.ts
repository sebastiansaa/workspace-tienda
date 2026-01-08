// Estructura del payload de un JWT estándar.
// Puedes extender esta interfaz según los campos que tu backend incluya.

export interface JwtPayload {
  // Subject (user ID)
  sub?: string
  // Issued at (timestamp)
  iat?: number
  // Expiration time (timestamp)
  exp?: number
  // Email del usuario
  email?: string
  // Rol del usuario
  role?: string
  // Cualquier otro campo personalizado
  [key: string]: unknown
}

// Decodifica un token JWT y retorna el payload.
// @param token - Token JWT a decodificar
// @returns Payload del token o null si es inválido
export function decodeJwt(token: string | null): JwtPayload | null {
  if (!token) return null

  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const base64Url = parts[1]
    if (!base64Url) return null

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )

    return JSON.parse(jsonPayload) as JwtPayload
  } catch {
    return null
  }
}

// Verifica si un token JWT está expirado.
// @param token - Token JWT a verificar
// @returns true si el token está expirado o es inválido
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true

  const payload = decodeJwt(token)
  if (!payload || !payload.exp) return true

  const now = Math.floor(Date.now() / 1000)
  return payload.exp < now
}
