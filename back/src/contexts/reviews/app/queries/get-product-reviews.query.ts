export interface ProductReviewsQueryFilters {
    page?: number;
    limit?: number;
}

export class GetProductReviewsQuery {
    constructor(
        public readonly productId: number,
        public readonly filters: ProductReviewsQueryFilters = {},
    ) { }
}

export default GetProductReviewsQuery;
