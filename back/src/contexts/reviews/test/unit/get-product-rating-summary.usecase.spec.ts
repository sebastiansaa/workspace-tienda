import { GetProductRatingSummaryUseCase } from 'src/contexts/reviews/app/usecases';
import { GetProductRatingSummaryQuery } from 'src/contexts/reviews/app/queries';
import { IReviewReadRepository } from 'src/contexts/reviews/app/ports/review-read.repository';
import { ProductsPort } from 'src/contexts/reviews/app/ports';

describe('GetProductRatingSummaryUseCase', () => {
    const productId = 888;

    let readRepo: jest.Mocked<IReviewReadRepository>;
    let productsPort: jest.Mocked<ProductsPort>;
    let useCase: GetProductRatingSummaryUseCase;

    beforeEach(() => {
        readRepo = {
            findById: jest.fn(),
            findByProduct: jest.fn(),
            findByUser: jest.fn(),
            findByUserAndProduct: jest.fn(),
            existsByUserAndProduct: jest.fn(),
            getProductRatingSummary: jest.fn().mockResolvedValue({ averageRating: 4.2, totalReviews: 10 }),
        } as unknown as jest.Mocked<IReviewReadRepository>;

        productsPort = { ensureProductExists: jest.fn().mockResolvedValue(undefined) } as jest.Mocked<ProductsPort>;

        useCase = new GetProductRatingSummaryUseCase(readRepo, productsPort);
    });

    it('retorna el resumen de ratings tras validar el producto', async () => {
        const query = new GetProductRatingSummaryQuery(productId);
        const result = await useCase.execute(query);

        expect(productsPort.ensureProductExists).toHaveBeenCalledWith(productId);
        expect(readRepo.getProductRatingSummary).toHaveBeenCalledWith(productId);
        expect(result.totalReviews).toBe(10);
        expect(result.averageRating).toBeCloseTo(4.2);
    });
});
