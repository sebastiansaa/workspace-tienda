import { logger } from "@/shared/services/logger";
import type { Cart } from "../usecase";

const CART_SNAPSHOT_KEY = "cart:snapshot:v1";
const CART_META_KEY = "cart:meta:v1";

export interface CartMeta {
  cartId?: string;
  userId?: string;
}

export function loadCartSnapshot(): Cart | null {
  try {
    const raw = localStorage.getItem(CART_SNAPSHOT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Cart;
  } catch (error) {
    logger.error("[cartLocalAdapter] Error loading cart snapshot", error as Error);
    return null;
  }
}

export function saveCartSnapshot(cart: Cart | null) {
  if (!cart) return;
  try {
    localStorage.setItem(CART_SNAPSHOT_KEY, JSON.stringify(cart));
  } catch (error) {
    logger.error("[cartLocalAdapter] Error saving cart snapshot", error as Error);
  }
}

export function loadCartMeta(): CartMeta {
  try {
    const raw = localStorage.getItem(CART_META_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as CartMeta;
  } catch (error) {
    logger.error("[cartLocalAdapter] Error loading cart meta", error as Error);
    return {};
  }
}

export function saveCartMeta(cartId?: string, userId?: string) {
  try {
    const meta: CartMeta = { cartId, userId };
    localStorage.setItem(CART_META_KEY, JSON.stringify(meta));
  } catch (error) {
    logger.error("[cartLocalAdapter] Error saving cart meta", error as Error);
  }
}

export function clearCartStorage() {
  try {
    localStorage.removeItem(CART_SNAPSHOT_KEY);
    localStorage.removeItem(CART_META_KEY);
  } catch (error) {
    logger.error("[cartLocalAdapter] Error clearing cart storage", error as Error);
  }
}
