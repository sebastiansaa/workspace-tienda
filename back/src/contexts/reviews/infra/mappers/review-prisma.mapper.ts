import { Prisma, Review } from '@prisma/client';
import ReviewEntity from '../../domain/entity/review.entity';

export class ReviewPrismaMapper {
    static toDomain(row: Review): ReviewEntity {
        return ReviewEntity.rehydrate({
            id: row.id,
            productId: row.productId,
            rating: row.rating,
            comment: row.comment,
            createdAt: row.createdAt,
            userId: row.userId ?? undefined,
        });
    }

    static toCreateInput(entity: ReviewEntity): Prisma.ReviewUncheckedCreateInput {
        const userId = entity.userId;
        if (!userId) throw new Error('Review requires user context to persist');
        return {
            id: entity.id,
            productId: entity.productId,
            rating: entity.rating,
            comment: entity.comment,
            createdAt: entity.createdAt,
            userId,
        };
    }

    static toUpdateInput(entity: ReviewEntity): Prisma.ReviewUncheckedUpdateInput {
        return {
            rating: entity.rating,
            comment: entity.comment,
        };
    }
}

export default ReviewPrismaMapper;
