import { useAuthStore } from "@/domain/auth/stores/authStore";
import { useToast } from "vue-toastification";

/** Fuente única de verdad para rol admin en frontend. */
export const isAdmin = (): boolean => {
    const auth = useAuthStore();
    return !!auth.isAdmin;
};

/** Evalúa si un usuario (objeto) tiene rol admin sin depender del store. */
export const isAdminUser = (user: { roles?: string[]; role?: string; isAdmin?: boolean } | null | undefined): boolean => {
    if (!user) return false;
    if (user.isAdmin) return true;
    if (Array.isArray(user.roles) && user.roles.some((r) => r === "admin")) return true;
    if (user.role === "admin") return true;
    return false;
};

/** Lanza si no es admin y muestra feedback. */
export const requireAdmin = (): void => {
    if (!isAdmin()) {
        try { useToast().error("Acción requiere rol admin"); } catch { /* noop */ }
        const error = new Error("ADMIN_REQUIRED");
        error.name = "AdminRequiredError";
        throw error;
    }
};
