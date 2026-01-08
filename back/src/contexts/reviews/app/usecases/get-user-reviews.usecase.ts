import { normalizePagination } from '../../../shared/helpers/filter-utils';
import { GetUserReviewsQuery } from '../queries';
import { IReviewReadRepository, AuthPort, UserPort } from '../ports';
import { ReviewPagination } from '../ports/review-read.repository';

export class GetUserReviewsUseCase {
    constructor(
        private readonly readRepo: IReviewReadRepository,
        private readonly authPort: AuthPort,
        private readonly userPort: UserPort,
    ) { }

    async execute(query: GetUserReviewsQuery): Promise<ReviewPagination> {
        await this.authPort.ensureAuthenticated(query.userId);
        await this.userPort.ensureUserExists(query.userId);
        const { skip, take } = normalizePagination(query.filters.page, query.filters.limit);
        return this.readRepo.findByUser(query.userId, { offset: skip, limit: take });
    }
}

export default GetUserReviewsUseCase;
