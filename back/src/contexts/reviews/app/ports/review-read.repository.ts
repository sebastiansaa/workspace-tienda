import { ReviewEntity } from '../../domain/entity/review.entity';

export interface ReviewPagination {
    reviews: ReviewEntity[];
    total: number;
}

export interface ReviewRatingSummary {
    averageRating: number;
    totalReviews: number;
}

export interface IReviewReadRepository {
    findById(id: string): Promise<ReviewEntity | null>;
    findByProduct(productId: number, filters?: { offset?: number; limit?: number }): Promise<ReviewPagination>;
    findByUser(userId: string, filters?: { offset?: number; limit?: number }): Promise<ReviewPagination>;
    findByUserAndProduct(userId: string, productId: number): Promise<ReviewEntity | null>;
    existsByUserAndProduct(userId: string, productId: number): Promise<boolean>;
    getProductRatingSummary(productId: number): Promise<ReviewRatingSummary>;
}

export default IReviewReadRepository;
