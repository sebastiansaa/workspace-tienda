import { GetCartUseCase } from '../../app/usecases/get-cart.usecase';

describe('ICartReadRepository (unit) - GetCartUseCase spec', () => {
    it('returns null when repo returns null', async () => {
        const repo = { findByUserId: jest.fn().mockResolvedValue(null) } as any;
        const uc = new GetCartUseCase(repo);
        const res = await uc.execute({ userId: 'u1' });
        expect(res).toBeNull();
        expect(repo.findByUserId).toHaveBeenCalledWith('u1');
    });

    it('returns cart entity from repo', async () => {
        const entity = { id: 'c', userId: 'u1', items: [] } as any;
        const repo = { findByUserId: jest.fn().mockResolvedValue(entity) } as any;
        const uc = new GetCartUseCase(repo);
        const res = await uc.execute({ userId: 'u1' });
        expect(res).toBe(entity);
        expect(repo.findByUserId).toHaveBeenCalledTimes(1);
    });
});
