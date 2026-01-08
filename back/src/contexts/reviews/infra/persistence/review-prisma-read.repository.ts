import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IReviewReadRepository, ReviewPagination, ReviewRatingSummary } from '../../app/ports/review-read.repository';
import ReviewEntity from '../../domain/entity/review.entity';
import { ReviewPrismaMapper } from '../mappers/review-prisma.mapper';

@Injectable()
export class ReviewPrismaReadRepository implements IReviewReadRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<ReviewEntity | null> {
        const row = await this.prisma.review.findUnique({ where: { id } });
        return row ? ReviewPrismaMapper.toDomain(row) : null;
    }

    async findByProduct(productId: number, filters?: { offset?: number; limit?: number }): Promise<ReviewPagination> {
        const skip = filters?.offset ?? 0;
        const take = filters?.limit ?? 20;
        const [rows, total] = await Promise.all([
            this.prisma.review.findMany({
                where: { productId },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.review.count({ where: { productId } }),
        ]);
        return { reviews: rows.map((row) => ReviewPrismaMapper.toDomain(row)), total };
    }

    async findByUser(userId: string, filters?: { offset?: number; limit?: number }): Promise<ReviewPagination> {
        const skip = filters?.offset ?? 0;
        const take = filters?.limit ?? 20;
        const [rows, total] = await Promise.all([
            this.prisma.review.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.review.count({ where: { userId } }),
        ]);
        return { reviews: rows.map((row) => ReviewPrismaMapper.toDomain(row)), total };
    }

    async findByUserAndProduct(userId: string, productId: number): Promise<ReviewEntity | null> {
        const row = await this.prisma.review.findFirst({
            where: { userId, productId },
        });
        return row ? ReviewPrismaMapper.toDomain(row) : null;
    }

    async existsByUserAndProduct(userId: string, productId: number): Promise<boolean> {
        const review = await this.prisma.review.findFirst({
            where: { userId, productId },
            select: { id: true },
        });
        return Boolean(review);
    }

    async getProductRatingSummary(productId: number): Promise<ReviewRatingSummary> {
        const aggregate = await this.prisma.review.aggregate({
            where: { productId },
            _avg: { rating: true },
            _count: { _all: true },
        });

        return {
            averageRating: Number(aggregate._avg.rating ?? 0),
            totalReviews: aggregate._count._all ?? 0,
        };
    }
}

export default ReviewPrismaReadRepository;
