import { RefreshTokenUseCase } from '../../app/usecases/refresh-token.usecase';
import { RefreshTokenNotFoundError } from '../../domain/errors/auth.errors';

describe('RefreshTokenUseCase (unit)', () => {
    it('throws when refresh token not stored', async () => {
        const tokenService = { verifyRefreshToken: jest.fn().mockResolvedValue({ sub: 'u1' }), hashToken: jest.fn().mockResolvedValue('h') } as any;
        const refreshRepo = { findByHash: jest.fn().mockResolvedValue(null) } as any;
        const userRepo = { findById: jest.fn() } as any;

        const uc = new RefreshTokenUseCase(userRepo, refreshRepo, tokenService);

        await expect(uc.execute({ refreshToken: 'rt' })).rejects.toBeInstanceOf(RefreshTokenNotFoundError);
    });

    it('generates new tokens when valid', async () => {
        const tokenService = { verifyRefreshToken: jest.fn().mockResolvedValue({ sub: 'u1' }), hashToken: jest.fn().mockResolvedValue('h'), signAccessToken: jest.fn().mockResolvedValue('at'), signRefreshToken: jest.fn().mockResolvedValue('rt'), getRefreshExpirationDate: jest.fn().mockReturnValue(new Date()) } as any;
        const stored = { isExpired: () => false, userId: 'u1' } as any;
        const refreshRepo = { findByHash: jest.fn().mockResolvedValue(stored), revokeByUserId: jest.fn(), save: jest.fn() } as any;
        const user = { id: 'u1', roles: ['user'] } as any;
        const userRepo = { findById: jest.fn().mockResolvedValue(user) } as any;

        const uc = new RefreshTokenUseCase(userRepo, refreshRepo, tokenService);
        const res = await uc.execute({ refreshToken: 'rt' });
        expect(res.tokens).toBeDefined();
        expect(refreshRepo.save).toHaveBeenCalled();
    });
});
