import { GetAuthenticatedUserUseCase } from '../../app/usecases/get-authenticated-user.usecase';
import { UserNotFoundError } from '../../domain/errors/auth.errors';

describe('GetAuthenticatedUserUseCase (unit)', () => {
    it('throws when user is not found', async () => {
        const userRepo = {
            findById: jest.fn().mockResolvedValue(null),
        } as any;

        const uc = new GetAuthenticatedUserUseCase(userRepo);

        await expect(uc.execute({ userId: 'x' }))
            .rejects
            .toBeInstanceOf(UserNotFoundError);

        expect(userRepo.findById).toHaveBeenCalledWith('x');
        expect(userRepo.findById).toHaveBeenCalledTimes(1);
    });

    it('returns user when found', async () => {
        const user = { id: 'u1', email: 't@t.com' } as any;

        const userRepo = {
            findById: jest.fn().mockResolvedValue(user),
        } as any;

        const uc = new GetAuthenticatedUserUseCase(userRepo);

        const res = await uc.execute({ userId: 'u1' });

        expect(userRepo.findById).toHaveBeenCalledWith('u1');
        expect(res).toEqual(expect.objectContaining({ id: 'u1' }));
    });
});