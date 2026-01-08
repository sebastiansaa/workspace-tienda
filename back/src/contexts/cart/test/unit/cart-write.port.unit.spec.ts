import { ClearCartUseCase } from '../../app/usecases/clear-cart.usecase';
import { AddItemToCartUseCase } from '../../app/usecases/add-item-to-cart.usecase';

describe('ICartWriteRepository (unit) - Clear & Save contract', () => {
    it('clear calls repo.clear with userId', async () => {
        const repo = { clear: jest.fn().mockResolvedValue(undefined) } as any;
        const uc = new ClearCartUseCase(repo);
        await uc.execute({ userId: 'u9' });
        expect(repo.clear).toHaveBeenCalledWith('u9');
    });

    it('add item calls save on write repo with cart shape', async () => {
        const readRepo = { findByUserId: jest.fn().mockResolvedValue(null) } as any;
        const writeRepo = { save: jest.fn().mockResolvedValue({ id: 'c1' }) } as any;
        const pricing = { getPrice: jest.fn().mockResolvedValue(10) } as any;
        const stock = { isAvailable: jest.fn().mockResolvedValue(true) } as any;

        const uc = new AddItemToCartUseCase(readRepo, writeRepo, pricing, stock);
        await uc.execute({ userId: 'u1', productId: 1, quantity: 2 });

        expect(pricing.getPrice).toHaveBeenCalledWith(1);
        expect(writeRepo.save).toHaveBeenCalled();
        const saved = writeRepo.save.mock.calls[0][0];
        expect(saved.userId).toBe('u1');
        expect(saved.items[0].productId).toBe(1);
    });
});
