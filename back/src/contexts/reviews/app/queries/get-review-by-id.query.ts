export class GetReviewByIdQuery {
    constructor(
        public readonly reviewId: string,
        public readonly userId: string,
    ) { }
}

export default GetReviewByIdQuery;
