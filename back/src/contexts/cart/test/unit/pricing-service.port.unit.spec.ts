import { AddItemToCartUseCase } from '../../app/usecases/add-item-to-cart.usecase';

describe('PricingServicePort (unit) - AddItemToCart interaction', () => {
    it('throws or handles when price is null', async () => {
        const readRepo = { findByUserId: jest.fn().mockResolvedValue(null) } as any;
        const writeRepo = { save: jest.fn() } as any;
        const pricing = { getPrice: jest.fn().mockResolvedValue(null) } as any;
        const stock = { isAvailable: jest.fn().mockResolvedValue(true) } as any;

        const uc = new AddItemToCartUseCase(readRepo, writeRepo, pricing, stock);
        await expect(uc.execute({ userId: 'u1', productId: 5, quantity: 1 })).rejects.toBeDefined();
        expect(pricing.getPrice).toHaveBeenCalledWith(5);
    });

    it('uses price when available', async () => {
        const readRepo = { findByUserId: jest.fn().mockResolvedValue(null) } as any;
        const writeRepo = { save: jest.fn().mockResolvedValue({ id: 'c2' }) } as any;
        const pricing = { getPrice: jest.fn().mockResolvedValue(15) } as any;
        const stock = { isAvailable: jest.fn().mockResolvedValue(true) } as any;

        const uc = new AddItemToCartUseCase(readRepo, writeRepo, pricing, stock);
        const res = await uc.execute({ userId: 'u1', productId: 5, quantity: 2 });
        expect(pricing.getPrice).toHaveBeenCalledWith(5);
        expect(writeRepo.save).toHaveBeenCalled();
    });
});
