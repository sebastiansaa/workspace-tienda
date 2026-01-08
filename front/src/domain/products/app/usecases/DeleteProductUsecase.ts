import { productsClient } from '../../api/productsApi'

export class DeleteProductUsecase {
  async execute(id: number, hard = false): Promise<void> {
    return productsClient.deleteProduct(id, hard)
  }
}
