import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IReviewWriteRepository } from '../../app/ports/review-write.repository';
import ReviewEntity from '../../domain/entity/review.entity';
import { ReviewPrismaMapper } from '../mappers/review-prisma.mapper';

@Injectable()
export class ReviewPrismaWriteRepository implements IReviewWriteRepository {
    constructor(private readonly prisma: PrismaService) { }

    async save(review: ReviewEntity): Promise<ReviewEntity> {
        const createInput = ReviewPrismaMapper.toCreateInput(review);
        const updateInput = ReviewPrismaMapper.toUpdateInput(review);
        const saved = await this.prisma.review.upsert({
            where: { id: review.id },
            update: updateInput,
            create: createInput,
        });
        return ReviewPrismaMapper.toDomain(saved);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.review.delete({ where: { id } });
    }
}

export default ReviewPrismaWriteRepository;
