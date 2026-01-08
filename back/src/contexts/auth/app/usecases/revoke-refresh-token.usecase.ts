import { RevokeRefreshTokenInput } from '../inputs';
import { RefreshTokenRepositoryPort } from '../ports/refresh-token.repository.port';

export class RevokeRefreshTokenUseCase {
    constructor(private readonly refreshTokenRepo: RefreshTokenRepositoryPort) { }

    async execute(input: RevokeRefreshTokenInput): Promise<void> {
        await this.refreshTokenRepo.revokeByUserId(input.userId);
    }
}
