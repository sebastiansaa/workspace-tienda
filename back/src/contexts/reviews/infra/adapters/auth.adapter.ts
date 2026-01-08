import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPort } from '../../app/ports';

@Injectable()
export class ReviewsAuthAdapter implements AuthPort {
    async ensureAuthenticated(userId: string): Promise<void> {
        if (!userId) throw new UnauthorizedException('Authentication required');
    }
}

export default ReviewsAuthAdapter;
