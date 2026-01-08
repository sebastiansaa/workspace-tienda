import { DeleteReviewCommand } from '../commands';
import { IReviewReadRepository, IReviewWriteRepository, AuthPort } from '../ports';
import { ReviewNotFoundError, ReviewOwnershipError } from '../../domain/errors/review.errors';

export class DeleteReviewUseCase {
    constructor(
        private readonly readRepo: IReviewReadRepository,
        private readonly writeRepo: IReviewWriteRepository,
        private readonly authPort: AuthPort,
    ) { }

    async execute(command: DeleteReviewCommand): Promise<void> {
        await this.authPort.ensureAuthenticated(command.userId);
        const review = await this.readRepo.findById(command.reviewId);
        if (!review) throw new ReviewNotFoundError();
        if (!review.belongsTo(command.userId)) throw new ReviewOwnershipError();
        await this.writeRepo.delete(review.id);
    }
}

export default DeleteReviewUseCase;
