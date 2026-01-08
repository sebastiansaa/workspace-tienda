import { FindLowStockQuery } from '../queries/find-low-stock.query';
import { IProductReadRepository } from '../ports/product-read.repository';
import { ProductEntity } from '../../domain/entity/product.entity';

export class FindLowStockUsecase {
    constructor(private readonly repo: IProductReadRepository) { }

    async execute(q: FindLowStockQuery): Promise<ProductEntity[]> {
        return this.repo.findLowStock(q.threshold);
    }
}
