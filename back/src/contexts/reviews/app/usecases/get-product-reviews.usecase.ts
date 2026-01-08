import { normalizePagination } from '../../../shared/helpers/filter-utils';
import { GetProductReviewsQuery } from '../queries';
import { IReviewReadRepository, ProductsPort } from '../ports';
import { ReviewPagination } from '../ports/review-read.repository';

export class GetProductReviewsUseCase {
    constructor(
        private readonly readRepo: IReviewReadRepository,
        private readonly productsPort: ProductsPort,
    ) { }

    async execute(query: GetProductReviewsQuery): Promise<ReviewPagination> {
        await this.productsPort.ensureProductExists(query.productId);
        const { skip, take } = normalizePagination(query.filters.page, query.filters.limit);
        return this.readRepo.findByProduct(query.productId, { offset: skip, limit: take });
    }
}

export default GetProductReviewsUseCase;
