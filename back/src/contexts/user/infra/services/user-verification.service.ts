import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_READ_REPOSITORY } from '../../constants';
import type { IUserReadRepository } from '../../app/ports/user-read.repository';
import type UserVerificationPort from '../../../shared/ports/user-verification.port';
import type { UserStatus } from '../../domain/v-o/user-status.vo';

const BLOCKED_STATUSES: readonly UserStatus[] = ['SUSPENDED', 'DELETED'];

@Injectable()
export class UserVerificationService implements UserVerificationPort {
    constructor(
        @Inject(USER_READ_REPOSITORY)
        private readonly userReadRepo: IUserReadRepository,
    ) { }

    async ensureUserExists(userId: string): Promise<void> {
        const user = await this.userReadRepo.findById(userId);
        if (!user) throw new NotFoundException('User not found');
        if (BLOCKED_STATUSES.includes(user.status)) throw new NotFoundException('User not found');
    }
}

export default UserVerificationService;