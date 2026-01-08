import type { ProductResponse } from "@/domain/products/types"
import type { CartItemDTO } from "./BackendShapeCart"

export type MiniCartState = 'closed' | 'mini' | 'expanded'

export type CartItem = CartItemDTO & { product?: ProductResponse }
