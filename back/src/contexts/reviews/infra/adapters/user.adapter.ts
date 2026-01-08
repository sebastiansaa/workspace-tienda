import { Inject, Injectable } from '@nestjs/common';
import { USER_VERIFICATION_PORT } from '../../../user/constants';
import type UserVerificationPort from '../../../shared/ports/user-verification.port';
import { UserPort } from '../../app/ports';

@Injectable()
export class ReviewsUserAdapter implements UserPort {
    constructor(
        @Inject(USER_VERIFICATION_PORT)
        private readonly userVerification: UserVerificationPort,
    ) { }

    async ensureUserExists(userId: string): Promise<void> {
        await this.userVerification.ensureUserExists(userId);
    }
}

export default ReviewsUserAdapter;
