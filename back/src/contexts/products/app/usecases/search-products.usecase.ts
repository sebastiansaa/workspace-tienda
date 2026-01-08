import { SearchProductsQuery } from '../queries/search-products.query';
import { IProductReadRepository } from '../ports/product-read.repository';
import { ProductEntity } from '../../domain/entity/product.entity';

export class SearchProductsUsecase {
    constructor(private readonly repo: IProductReadRepository) { }

    async execute(q: SearchProductsQuery): Promise<{ products: ProductEntity[]; total: number }> {
        return this.repo.searchByName(q.term, q.params);
    }
}
