import { GetProductRatingSummaryQuery } from '../queries';
import { IReviewReadRepository, ProductsPort } from '../ports';
import { ReviewRatingSummary } from '../ports/review-read.repository';

export class GetProductRatingSummaryUseCase {
    constructor(
        private readonly readRepo: IReviewReadRepository,
        private readonly productsPort: ProductsPort,
    ) { }

    async execute(query: GetProductRatingSummaryQuery): Promise<ReviewRatingSummary> {
        await this.productsPort.ensureProductExists(query.productId);
        return this.readRepo.getProductRatingSummary(query.productId);
    }
}

export default GetProductRatingSummaryUseCase;
