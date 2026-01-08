import { productsClient } from '../../api/productsApi'
import type { ProductResponse } from '../../types/backendShape'

export class FindLowStockUsecase {
    async execute(threshold = 5): Promise<ProductResponse[]> {
        return productsClient.findLowStock(threshold)
    }
}
