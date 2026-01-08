import { CreateReviewCommand } from '../commands';
import { IReviewReadRepository, IReviewWriteRepository, AuthPort, ProductsPort, OrdersPort, UserPort } from '../ports';
import { ReviewEntity } from '../../domain/entity/review.entity';
import { ReviewPurchaseRequiredError } from '../../domain/errors/review.errors';

export class CreateReviewUseCase {
    constructor(
        private readonly readRepo: IReviewReadRepository,
        private readonly writeRepo: IReviewWriteRepository,
        private readonly authPort: AuthPort,
        private readonly userPort: UserPort,
        private readonly productsPort: ProductsPort,
        private readonly ordersPort: OrdersPort,
    ) { }

    async execute(command: CreateReviewCommand): Promise<ReviewEntity> {
        await this.authPort.ensureAuthenticated(command.userId);
        await this.userPort.ensureUserExists(command.userId);
        await this.productsPort.ensureProductExists(command.productId);

        const hasPurchased = await this.ordersPort.hasUserPurchasedProduct(command.userId, command.productId);
        if (!hasPurchased) throw new ReviewPurchaseRequiredError();

        const currentReview = await this.readRepo.findByUserAndProduct(command.userId, command.productId);
        if (currentReview) {
            currentReview.updateRating(command.rating);
            currentReview.updateComment(command.comment);
            return this.writeRepo.save(currentReview);
        }

        const entity = ReviewEntity.create({
            userId: command.userId,
            productId: command.productId,
            rating: command.rating,
            comment: command.comment,
        });

        return this.writeRepo.save(entity);
    }
}

export default CreateReviewUseCase;
