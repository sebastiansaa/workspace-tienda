import type { AuthResponse } from "./AuthResponse"
import type { User } from "./User"

export interface AuthClient {
  login(
    email: string,
    password: string): Promise<AuthResponse>

  register(
    email: string,
    password: string,
  ): Promise<AuthResponse>

  loginWithGoogle(
    token: string
  ): Promise<AuthResponse>

  loginWithFacebook(
    token: string
  ): Promise<AuthResponse>
}
