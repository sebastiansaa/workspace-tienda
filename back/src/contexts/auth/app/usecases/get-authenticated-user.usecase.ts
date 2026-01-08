import { GetAuthenticatedUserInput } from '../inputs';
import { UserRepositoryPort } from '../ports/auth-user.repository.port';
import { UserEntity } from '../../domain/entity/user.entity';
import { UserNotFoundError } from '../../domain/errors/auth.errors';

export class GetAuthenticatedUserUseCase {
    constructor(private readonly userRepo: UserRepositoryPort) { }

    async execute(input: GetAuthenticatedUserInput): Promise<UserEntity> {
        const user = await this.userRepo.findById(input.userId);
        if (!user) {
            throw new UserNotFoundError();
        }
        return user;
    }
}
