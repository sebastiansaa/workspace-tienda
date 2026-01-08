import { axiosAdapter } from "@/shared/api/axiosAdapter";
import type { AuthResponseRaw, AuthResponse } from "../interfaces/AuthResponse";
import type { AuthUserProfile } from "../interfaces/AuthProfile";
import type { User } from "../interfaces/User";

function mapTokens(raw: AuthResponseRaw["tokens"]) {
  return {
    accessToken: raw.accessToken,
    refreshToken: raw.refreshToken,
    tokenType: raw.tokenType,
  } satisfies AuthResponse["tokens"];
}

function mapUser(raw: AuthResponseRaw["user"]): User {
  return {
    id: raw.id,
    email: raw.email,
    name: raw.name ?? null,
    phone: raw.phone ?? null,
    roles: raw.roles ?? [],
    status: raw.status ?? "ACTIVE",
    preferences: raw.preferences ?? null,
    addresses: raw.addresses ?? [],
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
  } satisfies User;
}

function mapAuthResponse(raw: AuthResponseRaw): AuthResponse {
  return {
    tokens: mapTokens(raw.tokens),
    user: mapUser(raw.user),
  };
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await axiosAdapter.post<AuthResponseRaw>("/auth/login", { email, password });
  return mapAuthResponse(response.data);
}

export async function register(email: string, password: string): Promise<AuthResponse> {
  const response = await axiosAdapter.post<AuthResponseRaw>("/auth/register", { email, password });
  return mapAuthResponse(response.data);
}

// Obtener el perfil del usuario autenticado
export async function profile(): Promise<User | null> {
  const response = await axiosAdapter.get<AuthUserProfile | null>("/auth/me");
  if (!response.data) return null;
  return mapUser(response.data as AuthResponseRaw["user"]);
}

// Refrescar tokens
export async function refreshToken(refreshToken: string): Promise<AuthResponse> {
  const response = await axiosAdapter.post<AuthResponseRaw>("/auth/refresh", { refreshToken });
  return mapAuthResponse(response.data);
}

export async function logout(): Promise<void> {
  await axiosAdapter.post("/auth/logout");
}
