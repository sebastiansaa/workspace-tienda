import 'reflect-metadata';
import request from 'supertest';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ReviewsController } from 'src/contexts/reviews/api/controller/reviews.controller';
import { ResponseMappingInterceptor } from 'src/contexts/shared/interceptors/response-mapping.interceptor';
import { JwtAuthGuard } from 'src/contexts/auth/infra/guards/jwt-auth.guard';
import {
    CreateReviewUseCase,
    DeleteReviewUseCase,
    GetProductRatingSummaryUseCase,
    GetProductReviewsUseCase,
    GetReviewByIdUseCase,
    GetUserReviewsUseCase,
    UpdateReviewUseCase,
} from 'src/contexts/reviews/app/usecases';
import ReviewEntity from 'src/contexts/reviews/domain/entity/review.entity';

class MockJwtAuthGuard {
    canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        req.user = { sub: '5b9f4856-2d2e-4c9f-87d1-7b31f0c8f7fb' };
        return true;
    }
}

describe('ReviewsController (integration)', () => {
    let app: INestApplication;
    const createReview = { execute: jest.fn() } as jest.Mocked<CreateReviewUseCase>;
    const deleteReview = { execute: jest.fn() } as jest.Mocked<DeleteReviewUseCase>;
    const productReviews = { execute: jest.fn() } as jest.Mocked<GetProductReviewsUseCase>;
    const userReviews = { execute: jest.fn() } as jest.Mocked<GetUserReviewsUseCase>;
    const reviewById = { execute: jest.fn() } as jest.Mocked<GetReviewByIdUseCase>;
    const updateReview = { execute: jest.fn() } as jest.Mocked<UpdateReviewUseCase>;
    const summary = { execute: jest.fn() } as jest.Mocked<GetProductRatingSummaryUseCase>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReviewsController],
            providers: [
                Reflector,
                { provide: CreateReviewUseCase, useValue: createReview },
                { provide: DeleteReviewUseCase, useValue: deleteReview },
                { provide: GetProductReviewsUseCase, useValue: productReviews },
                { provide: GetUserReviewsUseCase, useValue: userReviews },
                { provide: GetReviewByIdUseCase, useValue: reviewById },
                { provide: UpdateReviewUseCase, useValue: updateReview },
                { provide: GetProductRatingSummaryUseCase, useValue: summary },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useClass(MockJwtAuthGuard)
            .compile();

        app = module.createNestApplication();
        app.useGlobalInterceptors(new ResponseMappingInterceptor(app.get(Reflector)));
        await app.init();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await app.close();
    });

    it('retorna el resumen de reviews públicas', async () => {
        summary.execute.mockResolvedValue({ averageRating: 4.5, totalReviews: 12 });

        const res = await request(app.getHttpServer())
            .get('/reviews/product/42/summary')
            .expect(200);

        expect(summary.execute).toHaveBeenCalled();
        expect(res.body.data.averageRating).toBeCloseTo(4.5);
        expect(res.body.message).toContain('summary');
    });

    it('permite actualizar reseña propia', async () => {
        const updated = ReviewEntity.rehydrate({
            id: '8dcf7c2f-2353-4ab6-8b07-f5fd2cf0b4b0',
            userId: '5b9f4856-2d2e-4c9f-87d1-7b31f0c8f7fb',
            productId: 11,
            rating: 4,
            comment: 'Comentario actualizado',
            createdAt: new Date('2025-01-01T00:00:00.000Z'),
        });
        updateReview.execute.mockResolvedValue(updated);

        const res = await request(app.getHttpServer())
            .put(`/reviews/${updated.id}`)
            .send({ rating: 4, comment: 'Comentario actualizado' })
            .expect(200);

        expect(updateReview.execute).toHaveBeenCalled();
        expect(res.body.data.id).toBe(updated.id);
        expect(res.body.data.rating).toBe(4);
    });

    it('aplica validaciones en update', async () => {
        const res = await request(app.getHttpServer())
            .put('/reviews/8dcf7c2f-2353-4ab6-8b07-f5fd2cf0b4b0')
            .send({ rating: 10, comment: '' })
            .expect(400);

        expect(res.body.message).toContain('rating must not be greater than 5');
        expect(updateReview.execute).not.toHaveBeenCalled();
    });
});
