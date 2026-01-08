import { productsClient } from '../../api/productsApi'
import type { ListProductsQuery, ListProductResponse } from '../../types/backendShape'

export class ListProductsUsecase {
    async execute(query?: ListProductsQuery): Promise<ListProductResponse> {
        return productsClient.listProducts(query)
    }
}
