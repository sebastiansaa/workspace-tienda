import { ReviewEntity } from '../../domain/entity/review.entity';

export interface IReviewWriteRepository {
    save(review: ReviewEntity): Promise<ReviewEntity>;
    delete(id: string): Promise<void>;
}

export default IReviewWriteRepository;
