export interface CartItemResponse {
  productId: number;
  quantity: number;
  price: number;
  lineTotal: number;
}

export interface CartResponse {
  id: string;
  userId: string;
  items: CartItemResponse[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddItemRequest {
  productId: number;
  quantity: number;
}

export interface UpdateItemRequest {
  quantity: number;
}
