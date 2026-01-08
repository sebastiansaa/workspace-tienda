import { productsClient } from '../../api/productsApi'
import type { SaveProductDto, ProductResponse } from '../../types/backendShape'
import { saveProductSchema } from '../../types/product.schemas'

export class SaveProductUsecase {
  async execute(dto: SaveProductDto): Promise<ProductResponse> {
    const validated = saveProductSchema.parse(dto)
    return productsClient.saveProduct(validated)
  }
}
