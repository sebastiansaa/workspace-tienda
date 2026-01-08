import type { CartItem } from "@/domain/cart/types";
import { logger } from "@/shared/services/logger";

// asegura que el carrito pueda guardarse y restaurarse de forma segura y tipada, con manejo de errores centralizado y sin comprometer la estabilidad de la aplicación.

const STORAGE_KEY = 'myapp_cart_v1';

export function loadCartFromStorage(): CartItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed as CartItem[];
    }
  } catch (error) {
    logger.error("[cartPersistence] Error loading cart from storage", { error });
  }
  return [];
}

export function saveCartToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    logger.error("[cartPersistence] Error saving cart to storage", { error });
  }
}
