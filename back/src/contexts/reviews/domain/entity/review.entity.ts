import { DateVO } from '../../../shared/v-o/date.vo';
import { ReviewIdVO, ReviewProductIdVO, RatingVO, ReviewCommentVO, ReviewerIdVO } from '../v-o';

export interface ReviewProps {
    id?: string | null;
    productId: number;
    rating: number;
    comment: string;
    createdAt?: Date;
    userId?: string | null;
}

export class ReviewEntity {
    private readonly idVO: ReviewIdVO;
    private readonly productIdVO: ReviewProductIdVO;
    private ratingVO: RatingVO;
    private commentVO: ReviewCommentVO;
    private readonly userIdVO?: ReviewerIdVO;
    private createdAtVO: DateVO;

    private constructor(props: ReviewProps) {
        this.idVO = ReviewIdVO.from(props.id ?? undefined);
        this.productIdVO = new ReviewProductIdVO(props.productId);
        this.ratingVO = new RatingVO(props.rating);
        this.commentVO = new ReviewCommentVO(props.comment);
        this.userIdVO = props.userId ? new ReviewerIdVO(props.userId) : undefined;
        this.createdAtVO = DateVO.from(props.createdAt);
    }

    static create(props: Omit<ReviewProps, 'createdAt'> & { createdAt?: Date }): ReviewEntity {
        const createdAt = props.createdAt ?? new Date();
        return new ReviewEntity({ ...props, createdAt });
    }

    static rehydrate(props: ReviewProps): ReviewEntity {
        return new ReviewEntity(props);
    }

    get id(): string {
        return this.idVO.value;
    }

    get productId(): number {
        return this.productIdVO.value;
    }

    get rating(): number {
        return this.ratingVO.value;
    }

    get comment(): string {
        return this.commentVO.value;
    }

    get userId(): string | undefined {
        return this.userIdVO?.value;
    }

    get createdAt(): Date {
        return this.createdAtVO.value;
    }

    belongsTo(userId: string): boolean {
        return this.userIdVO?.value === userId;
    }

    updateRating(rating: number): void {
        this.ratingVO = new RatingVO(rating);
    }

    updateComment(comment: string): void {
        this.commentVO = new ReviewCommentVO(comment);
    }

    toPublicView(): { rating: number; comment: string; createdAt: Date } {
        return {
            rating: this.rating,
            comment: this.comment,
            createdAt: this.createdAt,
        };
    }

    toPrivateView(): { id: string; productId: number; rating: number; comment: string; createdAt: Date; userId?: string } {
        return {
            id: this.id,
            productId: this.productId,
            rating: this.rating,
            comment: this.comment,
            createdAt: this.createdAt,
            userId: this.userId,
        };
    }
}

export default ReviewEntity;
