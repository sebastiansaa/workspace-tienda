import { IProductWriteRepository } from '../ports/product-write.repository';
import { ProductEntity } from '../../domain/entity/product.entity';

export class DecreaseStockUsecase {
    constructor(private readonly repo: IProductWriteRepository) { }
    async execute(productId: number, quantity: number): Promise<ProductEntity> {
        return this.repo.decrementStock(productId, quantity);
    }
}
