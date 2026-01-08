import { productsClient } from '../../api/productsApi'
import type { UpdateStockDto, ProductResponse } from '../../types/backendShape'
import { updateStockSchema } from '../../types/product.schemas'

export class UpdateStockUsecase {
  async execute(id: number, dto: UpdateStockDto): Promise<ProductResponse> {
    const validated = updateStockSchema.parse(dto)
    return productsClient.updateStock(id, validated)
  }
}
