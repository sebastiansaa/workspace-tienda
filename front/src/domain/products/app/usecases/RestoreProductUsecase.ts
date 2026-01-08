import { productsClient } from '../../api/productsApi'
import type { ProductResponse } from '../../types/backendShape'

export class RestoreProductUsecase {
    async execute(id: number): Promise<ProductResponse> {
        return productsClient.restoreProduct(id)
    }
}
