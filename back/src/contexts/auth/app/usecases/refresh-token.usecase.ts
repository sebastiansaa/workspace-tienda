import { RefreshTokenInput } from '../inputs';
import { UserRepositoryPort } from '../ports/auth-user.repository.port';
import { RefreshTokenRepositoryPort } from '../ports/refresh-token.repository.port';
import { TokenServicePort } from '../ports/token.service.port';
import { RefreshTokenEntity } from '../../domain/entity/refresh-token.entity';
import { AuthResult } from './types';
import { RefreshTokenNotFoundError, RefreshTokenExpiredError, UserNotFoundError } from '../../domain/errors/auth.errors';

export class RefreshTokenUseCase {
    constructor(
        private readonly userRepo: UserRepositoryPort,
        private readonly refreshTokenRepo: RefreshTokenRepositoryPort,
        private readonly tokenService: TokenServicePort,
    ) { }

    async execute(input: RefreshTokenInput): Promise<AuthResult> {
        const payload = await this.tokenService.verifyRefreshToken(input.refreshToken);

        const hash = await this.tokenService.hashToken(input.refreshToken);
        const stored = await this.refreshTokenRepo.findByHash(hash);
        if (!stored) {
            throw new RefreshTokenNotFoundError();
        }
        if (stored.isExpired()) {
            throw new RefreshTokenExpiredError();
        }

        const user = await this.userRepo.findById(payload.sub);
        if (!user) {
            throw new UserNotFoundError();
        }

        const tokens = await this.generateTokens(user.id, user.roles);
        await this.persistRefreshToken(user.id, tokens.refreshToken);
        return { user, tokens };
    }

    private async generateTokens(userId: string, roles: string[]) {
        const payload = { sub: userId, roles };
        const accessToken = await this.tokenService.signAccessToken(payload);
        const refreshToken = await this.tokenService.signRefreshToken(payload);
        return { accessToken, refreshToken };
    }

    private async persistRefreshToken(userId: string, refreshToken: string): Promise<void> {
        await this.refreshTokenRepo.revokeByUserId(userId);
        const tokenHash = await this.tokenService.hashToken(refreshToken);
        const expiresAt = this.tokenService.getRefreshExpirationDate();
        const token = RefreshTokenEntity.create({ userId, tokenHash, expiresAt });
        await this.refreshTokenRepo.save(token);
    }
}
