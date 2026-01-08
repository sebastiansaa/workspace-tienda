import { GetReviewByIdQuery } from '../queries';
import { IReviewReadRepository, AuthPort } from '../ports';
import { ReviewEntity } from '../../domain/entity/review.entity';
import { ReviewNotFoundError, ReviewOwnershipError } from '../../domain/errors/review.errors';

export class GetReviewByIdUseCase {
    constructor(
        private readonly readRepo: IReviewReadRepository,
        private readonly authPort: AuthPort,
    ) { }

    async execute(query: GetReviewByIdQuery): Promise<ReviewEntity> {
        await this.authPort.ensureAuthenticated(query.userId);
        const review = await this.readRepo.findById(query.reviewId);
        if (!review) throw new ReviewNotFoundError();
        if (!review.belongsTo(query.userId)) throw new ReviewOwnershipError();
        return review;
    }
}

export default GetReviewByIdUseCase;
