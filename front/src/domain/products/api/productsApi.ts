import type { HttpClient } from '../../../shared/api/HttpClient'
import { axiosAdapter } from '../../../shared/api/axiosAdapter'

import type {
  ProductResponse,
  ListProductResponse,
  SaveProductRequest,
  UpdateStockRequest,
  ListProductsQuery,
  SearchProductsQuery,
} from '../types/backendShape'

export function createProductsClient(http?: HttpClient) {
  const client = http ?? axiosAdapter

  return {
    // 1. Crear o actualizar producto
    async saveProduct(dto: SaveProductRequest): Promise<ProductResponse> {
      const { data } = await client.post<ProductResponse>('/products', dto)
      return data
    },

    // 2. Listar productos con paginación
    async listProducts(query?: ListProductsQuery): Promise<ListProductResponse> {
      const { data } = await client.get<ListProductResponse>('/products', { params: query })
      return data
    },

    // 3. Buscar productos por nombre
    async searchProducts(query?: SearchProductsQuery): Promise<ListProductResponse> {
      const { data } = await client.get<ListProductResponse>('/products/search', { params: query })
      return data
    },

    // 4. Productos con bajo stock
    async findLowStock(threshold = 5): Promise<ProductResponse[]> {
      const { data } = await client.get<ProductResponse[]>('/products/admin/low-stock', { params: { threshold } })
      return data
    },

    // 5. Buscar producto por ID
    async findById(id: number): Promise<ProductResponse | null> {
      try {
        const { data } = await client.get<ProductResponse | null>(`/products/${id}`)
        return data
      } catch (err: Error | any) {
        // si el backend responde 404, devolver null; re-lanzar otros errores
        if (err?.response?.status === 404) return null
        throw err
      }
    },

    // 6. Actualizar stock
    async updateStock(id: number, dto: UpdateStockRequest): Promise<ProductResponse> {
      const { data } = await client.put<ProductResponse>(`/products/${id}/stock`, dto)
      return data
    },

    // 7. Eliminar producto (soft por defecto, hard opcional)
    async deleteProduct(id: number, hard = false): Promise<void> {
      await client.delete<void>(`/products/${id}`, { params: { hard: hard ? 'true' : undefined } })
    },

    // 8. Restaurar producto eliminado
    async restoreProduct(id: number): Promise<ProductResponse> {
      const { data } = await client.post<ProductResponse>(`/products/${id}/restore`)
      return data
    },

    // 9. Subir imagen de producto
    async uploadProductImage(
      id: number,
      formData: FormData
    ): Promise<{ productId: number; filename: string; path: string }> {
      const { data } = await client.post<{ productId: number; filename: string; path: string }>(
        `/products/${id}/upload-image`,
        formData
      )
      return data
    },
  }
}

export const productsClient = createProductsClient()
