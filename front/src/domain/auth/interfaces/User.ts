import type { UserProfile, UserStatus, UserAddress } from '@/domain/account/interfaces';

// Interfaz de usuario autenticado (perfil + roles para guardas)
export interface User extends UserProfile {
  roles: string[];
}

export type { UserStatus, UserAddress };
