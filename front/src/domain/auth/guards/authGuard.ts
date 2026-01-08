import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

// Guard de autenticación: protege rutas que requieren usuario autenticado.
// Si el usuario no está autenticado, redirige a /auth
export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()

  if (authStore.isLogged) {
    next()
  } else {
    next('/auth')
  }
}
