import { productsClient } from '../../api/productsApi'
import type { ProductResponse } from '../../types/backendShape'

export class FindProductByIdUsecase {
    async execute(id: number): Promise<ProductResponse | null> {
        return productsClient.findById(id)
    }
}
