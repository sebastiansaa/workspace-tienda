import { UpdateReviewCommand } from '../commands';
import { IReviewReadRepository, IReviewWriteRepository, AuthPort } from '../ports';
import { ReviewNotFoundError, ReviewOwnershipError } from '../../domain/errors/review.errors';
import { ReviewEntity } from '../../domain/entity/review.entity';

export class UpdateReviewUseCase {
    constructor(
        private readonly readRepo: IReviewReadRepository,
        private readonly writeRepo: IReviewWriteRepository,
        private readonly authPort: AuthPort,
    ) { }

    async execute(command: UpdateReviewCommand): Promise<ReviewEntity> {
        await this.authPort.ensureAuthenticated(command.userId);
        const review = await this.readRepo.findById(command.reviewId);
        if (!review) throw new ReviewNotFoundError();
        if (!review.belongsTo(command.userId)) throw new ReviewOwnershipError();

        review.updateRating(command.rating);
        review.updateComment(command.comment);

        return this.writeRepo.save(review);
    }
}

export default UpdateReviewUseCase;
