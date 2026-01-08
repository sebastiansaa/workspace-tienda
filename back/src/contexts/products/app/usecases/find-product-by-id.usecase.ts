import { FindProductByIdQuery } from '../queries/find-product-by-id.query';
import { IProductReadRepository } from '../ports/product-read.repository';
import { ProductEntity } from '../../domain/entity/product.entity';

export class FindProductByIdUsecase {
    constructor(private readonly repo: IProductReadRepository) { }

    async execute(q: FindProductByIdQuery): Promise<ProductEntity | null> {
        return this.repo.findById(q.id);
    }
}
