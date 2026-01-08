import { productsClient } from '../../api/productsApi'
import type { SearchProductsQuery, ListProductResponse } from '../../types/backendShape'

export class SearchProductsUsecase {
    async execute(query?: SearchProductsQuery): Promise<ListProductResponse> {
        return productsClient.searchProducts(query)
    }
}
