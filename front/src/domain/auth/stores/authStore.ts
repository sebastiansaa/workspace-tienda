import { defineStore } from 'pinia'
import type { User } from '../interfaces/User'
import { login as loginService, refreshToken as refreshService, register as registerService, logout as logoutService } from '../services/authService'
import { getAccountProfile } from '@/domain/account/services'

type Tokens = {
  accessToken: string
  refreshToken: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    accessToken: null as string | null,
    refreshToken: null as string | null,
  }),
  getters: {
    isLogged: (state) => !!state.accessToken,
    isAdmin: (state) => !!state.user?.roles?.includes('admin'),
  },
  actions: {
    setTokens(tokens: Tokens) {
      this.accessToken = tokens.accessToken
      this.refreshToken = tokens.refreshToken
      try {
        localStorage.setItem('accessToken', tokens.accessToken)
        localStorage.setItem('refreshToken', tokens.refreshToken)
      } catch {
        // Ignorar errores de localStorage
      }
    },

    clearAuth() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      try {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      } catch {
        // Ignorar errores de localStorage
      }
    },

    async login(email: string, password: string) {
      const auth = await loginService(email, password)
      this.setTokens(auth.tokens)
      this.user = auth.user
      return this.user
    },

    async register(email: string, password: string) {
      const auth = await registerService(email, password)
      this.setTokens(auth.tokens)
      this.user = auth.user
      return this.user
    },

    async logout() {
      try {
        await logoutService()
      } catch {
        // Ignorar errores del endpoint de logout
      }
      this.clearAuth()
    },

    // Cargar tokens almacenados (por ejemplo en main.ts al iniciar la app)
    async loadFromStorage() {
      try {
        const a = localStorage.getItem('accessToken')
        const r = localStorage.getItem('refreshToken')
        if (a && r) {
          this.accessToken = a
          this.refreshToken = r
          const refreshed = await this.refresh()
          if (!refreshed) {
            this.clearAuth()
          }
        }
      } catch {
        // Ignorar errores de acceso a localStorage
      }
    },

    // Intentar refrescar tokens usando refreshToken
    async refresh(): Promise<boolean> {
      if (!this.refreshToken) return false
      try {
        const auth = await refreshService(this.refreshToken)
        this.setTokens(auth.tokens)
        this.user = auth.user ?? this.user
        try {
          const profile = await getAccountProfile()
          this.user = {
            ...(this.user ?? profile),
            ...profile,
            roles: this.user?.roles ?? auth.user?.roles ?? [],
          }
        } catch {
          // Si el perfil falla, mantenemos el usuario de refresh
        }
        return true
      } catch {
        this.clearAuth()
        return false
      }
    },
  },
})

export default useAuthStore
