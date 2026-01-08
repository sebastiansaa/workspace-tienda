export interface UserReviewsQueryFilters {
    page?: number;
    limit?: number;
}

export class GetUserReviewsQuery {
    constructor(
        public readonly userId: string,
        public readonly filters: UserReviewsQueryFilters = {},
    ) { }
}

export default GetUserReviewsQuery;
