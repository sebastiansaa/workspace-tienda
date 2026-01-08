import { ReviewPrismaReadRepository } from 'src/contexts/reviews/infra/persistence/review-prisma-read.repository';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ReviewPrismaReadRepository - integration', () => {
    it('calcula el resumen de ratings con aggregate de Prisma', async () => {
        const prisma = {
            review: {
                aggregate: jest.fn().mockResolvedValue({ _avg: { rating: 4.25 }, _count: { _all: 16 } }),
                findMany: jest.fn(),
                count: jest.fn(),
                findUnique: jest.fn(),
                findFirst: jest.fn(),
            },
        } as unknown as PrismaService;
        const repository = new ReviewPrismaReadRepository(prisma);

        const summary = await repository.getProductRatingSummary(15);

        expect(prisma.review.aggregate).toHaveBeenCalledWith({
            where: { productId: 15 },
            _avg: { rating: true },
            _count: { _all: true },
        });
        expect(summary.averageRating).toBeCloseTo(4.25);
        expect(summary.totalReviews).toBe(16);
    });
});
