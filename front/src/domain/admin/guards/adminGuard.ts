import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useAuthStore } from "@/domain/auth/stores/authStore";
import { requireAdmin } from "../helpers/permissions";

export function adminGuard(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) {
    const auth = useAuthStore();

    if (!auth.isLogged) return next("/auth");

    try {
        requireAdmin();
        next();
    } catch {
        next("/auth");
    }
}
