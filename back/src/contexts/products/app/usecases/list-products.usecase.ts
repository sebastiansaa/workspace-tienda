import { ListProductsQuery } from '../queries/list-products.query';
import { IProductReadRepository } from '../ports/product-read.repository';
import { ProductEntity } from '../../domain/entity/product.entity';

export class ListProductsUsecase {
    constructor(private readonly repo: IProductReadRepository) { }

    async execute(q?: ListProductsQuery): Promise<{ products: ProductEntity[]; total: number }> {
        return this.repo.findAll(q?.params);
    }
}
