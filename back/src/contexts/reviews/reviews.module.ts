import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/order.module';
import { ReviewsController } from './api/controller/reviews.controller';
import { CreateReviewUseCase, DeleteReviewUseCase, GetProductRatingSummaryUseCase, GetProductReviewsUseCase, GetReviewByIdUseCase, GetUserReviewsUseCase, UpdateReviewUseCase } from './app/usecases';
import { ReviewPrismaReadRepository } from './infra/persistence/review-prisma-read.repository';
import { ReviewPrismaWriteRepository } from './infra/persistence/review-prisma-write.repository';
import { ReviewsAuthAdapter } from './infra/adapters/auth.adapter';
import { ReviewsUserAdapter } from './infra/adapters/user.adapter';
import { ReviewsProductsAdapter } from './infra/adapters/products.adapter';
import { ReviewsOrdersAdapter } from './infra/adapters/orders.adapter';
import { REVIEW_READ_PORT, REVIEW_WRITE_PORT, AUTH_PORT, USER_PORT, PRODUCTS_PORT, ORDERS_PORT } from './constants';
import { IReviewReadRepository } from './app/ports/review-read.repository';
import { IReviewWriteRepository } from './app/ports/review-write.repository';
import { AuthPort, ProductsPort, OrdersPort, UserPort } from './app/ports';

@Module({
    imports: [PrismaModule, AuthModule, UserModule, ProductsModule, OrdersModule],
    controllers: [ReviewsController],
    providers: [
        { provide: REVIEW_READ_PORT, useClass: ReviewPrismaReadRepository },
        { provide: REVIEW_WRITE_PORT, useClass: ReviewPrismaWriteRepository },
        { provide: AUTH_PORT, useClass: ReviewsAuthAdapter },
        { provide: USER_PORT, useClass: ReviewsUserAdapter },
        { provide: PRODUCTS_PORT, useClass: ReviewsProductsAdapter },
        { provide: ORDERS_PORT, useClass: ReviewsOrdersAdapter },
        {
            provide: CreateReviewUseCase,
            useFactory: (
                readRepo: IReviewReadRepository,
                writeRepo: IReviewWriteRepository,
                auth: AuthPort,
                user: UserPort,
                products: ProductsPort,
                orders: OrdersPort,
            ) => new CreateReviewUseCase(readRepo, writeRepo, auth, user, products, orders),
            inject: [REVIEW_READ_PORT, REVIEW_WRITE_PORT, AUTH_PORT, USER_PORT, PRODUCTS_PORT, ORDERS_PORT],
        },
        {
            provide: DeleteReviewUseCase,
            useFactory: (
                readRepo: IReviewReadRepository,
                writeRepo: IReviewWriteRepository,
                auth: AuthPort,
            ) => new DeleteReviewUseCase(readRepo, writeRepo, auth),
            inject: [REVIEW_READ_PORT, REVIEW_WRITE_PORT, AUTH_PORT],
        },
        {
            provide: GetProductReviewsUseCase,
            useFactory: (
                readRepo: IReviewReadRepository,
                products: ProductsPort,
            ) => new GetProductReviewsUseCase(readRepo, products),
            inject: [REVIEW_READ_PORT, PRODUCTS_PORT],
        },
        {
            provide: GetUserReviewsUseCase,
            useFactory: (
                readRepo: IReviewReadRepository,
                auth: AuthPort,
                user: UserPort,
            ) => new GetUserReviewsUseCase(readRepo, auth, user),
            inject: [REVIEW_READ_PORT, AUTH_PORT, USER_PORT],
        },
        {
            provide: GetReviewByIdUseCase,
            useFactory: (
                readRepo: IReviewReadRepository,
                auth: AuthPort,
            ) => new GetReviewByIdUseCase(readRepo, auth),
            inject: [REVIEW_READ_PORT, AUTH_PORT],
        },
        {
            provide: UpdateReviewUseCase,
            useFactory: (
                readRepo: IReviewReadRepository,
                writeRepo: IReviewWriteRepository,
                auth: AuthPort,
            ) => new UpdateReviewUseCase(readRepo, writeRepo, auth),
            inject: [REVIEW_READ_PORT, REVIEW_WRITE_PORT, AUTH_PORT],
        },
        {
            provide: GetProductRatingSummaryUseCase,
            useFactory: (
                readRepo: IReviewReadRepository,
                products: ProductsPort,
            ) => new GetProductRatingSummaryUseCase(readRepo, products),
            inject: [REVIEW_READ_PORT, PRODUCTS_PORT],
        },
    ],
})
export class ReviewsModule { }
