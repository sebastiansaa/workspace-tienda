import { UpdateReviewUseCase } from 'src/contexts/reviews/app/usecases';
import { UpdateReviewCommand } from 'src/contexts/reviews/app/commands';
import { IReviewReadRepository } from 'src/contexts/reviews/app/ports/review-read.repository';
import { IReviewWriteRepository } from 'src/contexts/reviews/app/ports/review-write.repository';
import { AuthPort } from 'src/contexts/reviews/app/ports';
import ReviewEntity from 'src/contexts/reviews/domain/entity/review.entity';
import { ReviewNotFoundError, ReviewOwnershipError } from 'src/contexts/reviews/domain/errors/review.errors';

describe('UpdateReviewUseCase', () => {
    const userId = 'ba9ce53a-10dc-4b7c-8b9c-93871e2636a8';
    const reviewId = '1d114056-33ce-4fe1-8eff-10aea9fb2718';

    let readRepo: jest.Mocked<IReviewReadRepository>;
    let writeRepo: jest.Mocked<IReviewWriteRepository>;
    let authPort: jest.Mocked<AuthPort>;
    let useCase: UpdateReviewUseCase;

    beforeEach(() => {
        readRepo = {
            findById: jest.fn(),
            findByProduct: jest.fn(),
            findByUser: jest.fn(),
            findByUserAndProduct: jest.fn(),
            existsByUserAndProduct: jest.fn(),
            getProductRatingSummary: jest.fn(),
        } as unknown as jest.Mocked<IReviewReadRepository>;

        writeRepo = {
            save: jest.fn(async (review) => review),
            delete: jest.fn(),
        } as jest.Mocked<IReviewWriteRepository>;

        authPort = { ensureAuthenticated: jest.fn().mockResolvedValue(undefined) } as jest.Mocked<AuthPort>;

        useCase = new UpdateReviewUseCase(readRepo, writeRepo, authPort);
    });

    it('actualiza la reseña cuando pertenece al usuario', async () => {
        const existing = ReviewEntity.rehydrate({
            id: reviewId,
            userId,
            productId: 65,
            rating: 3,
            comment: 'Regular',
            createdAt: new Date('2025-01-01'),
        });
        readRepo.findById.mockResolvedValue(existing);

        const command = new UpdateReviewCommand(reviewId, userId, 5, '  Excelente tras la garantía  ');
        const result = await useCase.execute(command);

        expect(readRepo.findById).toHaveBeenCalledWith(reviewId);
        expect(writeRepo.save).toHaveBeenCalledTimes(1);
        expect(result.rating).toBe(5);
        expect(result.comment).toBe('Excelente tras la garantía');
    });

    it('lanza error si la reseña no existe', async () => {
        readRepo.findById.mockResolvedValue(null);
        const command = new UpdateReviewCommand(reviewId, userId, 4, 'Nuevo');
        await expect(useCase.execute(command)).rejects.toBeInstanceOf(ReviewNotFoundError);
    });

    it('lanza error si no pertenece al usuario', async () => {
        const existing = ReviewEntity.rehydrate({
            id: reviewId,
            userId: 'd7df3f27-3480-46f5-af55-3a603e6d6bd3',
            productId: 65,
            rating: 3,
            comment: 'Otro',
            createdAt: new Date('2025-01-01'),
        });
        readRepo.findById.mockResolvedValue(existing);
        const command = new UpdateReviewCommand(reviewId, userId, 4, 'Nuevo');
        await expect(useCase.execute(command)).rejects.toBeInstanceOf(ReviewOwnershipError);
    });
});
