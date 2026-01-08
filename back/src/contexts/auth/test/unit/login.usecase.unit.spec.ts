import { LoginUserUseCase } from '../../app/usecases/login.usecase';
import { InvalidCredentialsError } from '../../domain/errors/auth.errors';

describe('LoginUserUseCase (unit)', () => {
    it('throws when user not found', async () => {
        const userRepo = { findByEmail: jest.fn().mockResolvedValue(null) } as any;
        const passwordHasher = { compare: jest.fn() } as any;
        const tokenService = { signAccessToken: jest.fn(), signRefreshToken: jest.fn(), hashToken: jest.fn(), getRefreshExpirationDate: jest.fn() } as any;
        const refreshRepo = { revokeByUserId: jest.fn(), save: jest.fn() } as any;

        const uc = new LoginUserUseCase(userRepo, refreshRepo, tokenService, passwordHasher);

        await expect(uc.execute({ email: 'x@x.com', password: 'p' })).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it('returns tokens on valid credentials', async () => {
        const user = { id: 'u1', passwordHash: 'h', roles: ['user'] } as any;
        const userRepo = { findByEmail: jest.fn().mockResolvedValue(user) } as any;
        const passwordHasher = { compare: jest.fn().mockResolvedValue(true) } as any;
        const tokenService = {
            signAccessToken: jest.fn().mockResolvedValue('at'),
            signRefreshToken: jest.fn().mockResolvedValue('rt'),
            hashToken: jest.fn().mockResolvedValue('th'),
            getRefreshExpirationDate: jest.fn().mockReturnValue(new Date()),
        } as any;
        const refreshRepo = { revokeByUserId: jest.fn(), save: jest.fn() } as any;

        const uc = new LoginUserUseCase(userRepo, refreshRepo, tokenService, passwordHasher);

        const res = await uc.execute({ email: 'x@x.com', password: 'p' });

        expect(res.tokens).toBeDefined();
        expect(tokenService.signAccessToken).toHaveBeenCalled();
        expect(refreshRepo.save).toHaveBeenCalled();
    });
});
