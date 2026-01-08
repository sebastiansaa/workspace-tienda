import type { User } from './User'

// Respuesta cruda del backend para login/refresh/register
export interface AuthTokensRaw {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
}

export interface AuthResponseRaw {
  user: Partial<User> & { id: string; email: string };
  tokens: AuthTokensRaw;
}

// Refresh responde con la misma forma que login/register
export type RefreshResponseRaw = AuthResponseRaw;

// Interfaz usada en la aplicación después de mapear los datos crudos.
export interface AuthTokens extends AuthTokensRaw { }

// Interfaz de la respuesta de autenticación usada en la app
export interface AuthResponse {
  tokens: AuthTokens;
  user: User;
}
