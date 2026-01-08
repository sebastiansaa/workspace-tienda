import { axiosAdapter } from "@/shared/api/axiosAdapter";
import type { AxiosResponse } from "axios";
import type { CartDTO } from "../types/BackendShapeCart";

export const cartApi = {
  get: (): Promise<AxiosResponse<CartDTO>> => axiosAdapter.get('/cart'),

  addItem: (body: { productId: number; quantity: number }): Promise<AxiosResponse<CartDTO>> =>
    axiosAdapter.post('/cart/items', body),

  updateQuantity: (productId: number, quantity: number): Promise<AxiosResponse<CartDTO>> =>
    axiosAdapter.put(`/cart/items/${productId}`, { quantity }),

  removeItem: (productId: number): Promise<AxiosResponse<CartDTO>> =>
    axiosAdapter.delete(`/cart/items/${productId}`),

  clearCart: (): Promise<AxiosResponse<void>> => axiosAdapter.delete('/cart'),
};
