import type { ProductDTO, ProductListDTO } from '@/client/interfacesBackend'

export type ProductResponse = ProductDTO

export type ListProductResponse = ProductListDTO

export type ListProductsQuery = {
  page?: number
  limit?: number
  categoryId?: number
}

export type SearchProductsQuery = {
  query: string
  page?: number
  limit?: number
}

export type SaveProductRequest = {
  id?: number
  title: string
  slug: string
  price: number
  description?: string
  stock?: number
  active?: boolean
  images: string[]
  categoryId: number
}

export type SaveProductDto = SaveProductRequest

export type UpdateStockRequest = {
  quantity: number
}

export type UpdateStockDto = UpdateStockRequest

