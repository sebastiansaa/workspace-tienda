import { GetReviewByIdUseCase } from 'src/contexts/reviews/app/usecases';
import { GetReviewByIdQuery } from 'src/contexts/reviews/app/queries';
import { IReviewReadRepository } from 'src/contexts/reviews/app/ports/review-read.repository';
import { AuthPort } from 'src/contexts/reviews/app/ports';
import ReviewEntity from 'src/contexts/reviews/domain/entity/review.entity';
import { ReviewNotFoundError, ReviewOwnershipError } from 'src/contexts/reviews/domain/errors/review.errors';

describe('GetReviewByIdUseCase', () => {
    const reviewId = '61066a7b-1f58-4d69-a8f7-e0a4a598b6c9';
    const ownerId = 'c4bb0554-7507-4f72-9ce6-2da52d58a4b1';

    let readRepo: jest.Mocked<IReviewReadRepository>;
    let authPort: jest.Mocked<AuthPort>;
    let useCase: GetReviewByIdUseCase;

    beforeEach(() => {
        readRepo = {
            findById: jest.fn(),
            findByProduct: jest.fn(),
            findByUser: jest.fn(),
            findByUserAndProduct: jest.fn(),
            existsByUserAndProduct: jest.fn(),
            getProductRatingSummary: jest.fn(),
        } as unknown as jest.Mocked<IReviewReadRepository>;

        authPort = { ensureAuthenticated: jest.fn().mockResolvedValue(undefined) } as jest.Mocked<AuthPort>;

        useCase = new GetReviewByIdUseCase(readRepo, authPort);
    });

    it('retorna la reseña si pertenece al usuario', async () => {
        const review = ReviewEntity.rehydrate({
            id: reviewId,
            userId: ownerId,
            productId: 10,
            rating: 5,
            comment: 'Excelente',
            createdAt: new Date('2025-01-01'),
        });
        readRepo.findById.mockResolvedValue(review);

        const query = new GetReviewByIdQuery(reviewId, ownerId);
        const result = await useCase.execute(query);

        expect(authPort.ensureAuthenticated).toHaveBeenCalledWith(ownerId);
        expect(readRepo.findById).toHaveBeenCalledWith(reviewId);
        expect(result.id).toBe(reviewId);
    });

    it('lanza error si la reseña no existe', async () => {
        readRepo.findById.mockResolvedValue(null);
        const query = new GetReviewByIdQuery(reviewId, ownerId);
        await expect(useCase.execute(query)).rejects.toBeInstanceOf(ReviewNotFoundError);
    });

    it('lanza error si la reseña no pertenece al usuario', async () => {
        const review = ReviewEntity.rehydrate({
            id: reviewId,
            userId: '5e836899-4d7f-41d8-8cf3-59fa4b733df0',
            productId: 10,
            rating: 4,
            comment: 'Ajena',
            createdAt: new Date('2025-01-01'),
        });
        readRepo.findById.mockResolvedValue(review);
        const query = new GetReviewByIdQuery(reviewId, ownerId);
        await expect(useCase.execute(query)).rejects.toBeInstanceOf(ReviewOwnershipError);
    });
});
