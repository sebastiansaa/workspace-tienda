import { DeleteReviewUseCase } from 'src/contexts/reviews/app/usecases';
import { DeleteReviewCommand } from 'src/contexts/reviews/app/commands';
import { IReviewReadRepository } from 'src/contexts/reviews/app/ports/review-read.repository';
import { IReviewWriteRepository } from 'src/contexts/reviews/app/ports/review-write.repository';
import { AuthPort } from 'src/contexts/reviews/app/ports';
import ReviewEntity from 'src/contexts/reviews/domain/entity/review.entity';
import { ReviewOwnershipError, ReviewNotFoundError } from 'src/contexts/reviews/domain/errors/review.errors';

describe('DeleteReviewUseCase', () => {
    const userId = '02883e44-4a9e-40bc-96e2-2778a8d617df';
    const reviewId = '0b9dc5f2-0e04-4755-a99f-08bc9b8fde14';

    let readRepo: jest.Mocked<IReviewReadRepository>;
    let writeRepo: jest.Mocked<IReviewWriteRepository>;
    let authPort: jest.Mocked<AuthPort>;
    let useCase: DeleteReviewUseCase;

    beforeEach(() => {
        readRepo = {
            findById: jest.fn(),
            findByProduct: jest.fn(),
            findByUser: jest.fn(),
            findByUserAndProduct: jest.fn(),
            existsByUserAndProduct: jest.fn(),
        } as unknown as jest.Mocked<IReviewReadRepository>;

        writeRepo = {
            save: jest.fn(),
            delete: jest.fn().mockResolvedValue(undefined),
        } as jest.Mocked<IReviewWriteRepository>;

        authPort = { ensureAuthenticated: jest.fn().mockResolvedValue(undefined) } as jest.Mocked<AuthPort>;

        useCase = new DeleteReviewUseCase(readRepo, writeRepo, authPort);
    });

    it('elimina la reseña propia del usuario', async () => {
        const review = ReviewEntity.rehydrate({
            id: reviewId,
            userId,
            productId: 50,
            rating: 4,
            comment: 'Buen producto',
            createdAt: new Date('2025-01-01'),
        });
        readRepo.findById.mockResolvedValue(review);

        const command = new DeleteReviewCommand(reviewId, userId);
        await useCase.execute(command);

        expect(authPort.ensureAuthenticated).toHaveBeenCalledWith(userId);
        expect(readRepo.findById).toHaveBeenCalledWith(reviewId);
        expect(writeRepo.delete).toHaveBeenCalledWith(reviewId);
    });

    it('lanza error si la reseña existe pero pertenece a otro usuario', async () => {
        const review = ReviewEntity.rehydrate({
            id: reviewId,
            userId: '268b7625-4611-4fb9-9a6f-f4bd1d0d0c4d',
            productId: 50,
            rating: 3,
            comment: 'Comentario ajeno',
            createdAt: new Date('2025-01-01'),
        });
        readRepo.findById.mockResolvedValue(review);

        const command = new DeleteReviewCommand(reviewId, userId);

        await expect(useCase.execute(command)).rejects.toBeInstanceOf(ReviewOwnershipError);
        expect(writeRepo.delete).not.toHaveBeenCalled();
    });

    it('lanza error si la reseña no existe', async () => {
        readRepo.findById.mockResolvedValue(null);

        const command = new DeleteReviewCommand(reviewId, userId);

        await expect(useCase.execute(command)).rejects.toBeInstanceOf(ReviewNotFoundError);
        expect(writeRepo.delete).not.toHaveBeenCalled();
    });
});
