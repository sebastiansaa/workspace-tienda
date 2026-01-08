import { RegisterUserUseCase } from '../../app/usecases/register.usecase';
import { UserAlreadyExistsError } from '../../domain/errors/auth.errors';

describe('RegisterUserUseCase (unit)', () => {
    it('throws when user already exists', async () => {
        const userRepo = { findByEmail: jest.fn().mockResolvedValue({ id: 'u' }) } as any;
        const refreshRepo = { revokeByUserId: jest.fn(), save: jest.fn() } as any;
        const tokenService = { signAccessToken: jest.fn(), signRefreshToken: jest.fn(), hashToken: jest.fn(), getRefreshExpirationDate: jest.fn() } as any;
        const passwordHasher = { hash: jest.fn() } as any;

        const uc = new RegisterUserUseCase(userRepo, refreshRepo, tokenService, passwordHasher);

        await expect(uc.execute({ email: 'a@b.com', password: 'p' })).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });

    it('saves and returns tokens on success', async () => {
        const userRepo = { findByEmail: jest.fn().mockResolvedValue(null), save: jest.fn().mockImplementation((u: any) => ({ ...u, id: 'u1' })) } as any;
        const refreshRepo = { revokeByUserId: jest.fn(), save: jest.fn() } as any;
        const tokenService = { signAccessToken: jest.fn().mockResolvedValue('at'), signRefreshToken: jest.fn().mockResolvedValue('rt'), hashToken: jest.fn().mockResolvedValue('th'), getRefreshExpirationDate: jest.fn().mockReturnValue(new Date()) } as any;
        const passwordHasher = { hash: jest.fn().mockResolvedValue('x'.repeat(60)) } as any;

        const uc = new RegisterUserUseCase(userRepo, refreshRepo, tokenService, passwordHasher);

        const res = await uc.execute({ email: 'a@b.com', password: 'p' });
        expect(res.tokens).toBeDefined();
        expect(userRepo.save).toHaveBeenCalled();
        expect(refreshRepo.save).toHaveBeenCalled();
    });
});
