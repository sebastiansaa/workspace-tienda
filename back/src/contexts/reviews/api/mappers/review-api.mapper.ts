import { CreateReviewRequestDto } from '../dtos/request/create-review.request.dto';
import { ListProductReviewsRequestDto } from '../dtos/request/list-product-reviews.request.dto';
import { ListUserReviewsRequestDto } from '../dtos/request/list-user-reviews.request.dto';
import { ReviewPublicResponseDto } from '../dtos/response/review-public.response.dto';
import { ReviewPublicListResponseDto } from '../dtos/response/review-public-list.response.dto';
import { ReviewPrivateResponseDto } from '../dtos/response/review-private.response.dto';
import { ReviewPrivateListResponseDto } from '../dtos/response/review-private-list.response.dto';
import { ReviewProductSummaryResponseDto } from '../dtos/response/review-product-summary.response.dto';
import { CreateReviewCommand, UpdateReviewCommand } from '../../app/commands';
import { GetProductRatingSummaryQuery, GetProductReviewsQuery, GetReviewByIdQuery, GetUserReviewsQuery } from '../../app/queries';
import ReviewEntity from '../../domain/entity/review.entity';
import { ReviewPagination, ReviewRatingSummary } from '../../app/ports/review-read.repository';
import { UpdateReviewRequestDto } from '../dtos/request/update-review.request.dto';

export class ReviewApiMapper {
    static toCreateReviewCommand(dto: CreateReviewRequestDto, userId: string): CreateReviewCommand {
        return new CreateReviewCommand(userId, dto.productId, dto.rating, dto.comment);
    }

    static toProductReviewsQuery(productId: number, dto: ListProductReviewsRequestDto): GetProductReviewsQuery {
        return new GetProductReviewsQuery(productId, { page: dto.page, limit: dto.limit });
    }

    static toUserReviewsQuery(userId: string, dto: ListUserReviewsRequestDto): GetUserReviewsQuery {
        return new GetUserReviewsQuery(userId, { page: dto.page, limit: dto.limit });
    }

    static toReviewByIdQuery(reviewId: string, userId: string): GetReviewByIdQuery {
        return new GetReviewByIdQuery(reviewId, userId);
    }

    static toUpdateReviewCommand(reviewId: string, userId: string, dto: UpdateReviewRequestDto): UpdateReviewCommand {
        return new UpdateReviewCommand(reviewId, userId, dto.rating, dto.comment);
    }

    static toProductRatingSummaryQuery(productId: number): GetProductRatingSummaryQuery {
        return new GetProductRatingSummaryQuery(productId);
    }

    static toPublicDto(review: ReviewEntity): ReviewPublicResponseDto {
        return {
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
        };
    }

    static toPublicList(response: ReviewPagination): ReviewPublicListResponseDto {
        return {
            reviews: response.reviews.map((review) => this.toPublicDto(review)),
            total: response.total,
        };
    }

    static toPrivateDto(review: ReviewEntity): ReviewPrivateResponseDto {
        return {
            id: review.id,
            productId: review.productId,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
            userId: review.userId,
        };
    }

    static toPrivateList(response: ReviewPagination): ReviewPrivateListResponseDto {
        return {
            reviews: response.reviews.map((review) => this.toPrivateDto(review)),
            total: response.total,
        };
    }

    static toSummaryDto(summary: ReviewRatingSummary): ReviewProductSummaryResponseDto {
        return {
            averageRating: summary.averageRating,
            totalReviews: summary.totalReviews,
        };
    }
}

export default ReviewApiMapper;
