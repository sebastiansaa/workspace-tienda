import { ReserveStockUsecase } from '../../app/usecases/reserve-stock.usecase';
import { InventoryItemEntity } from '../../domain/entity/inventory-item.entity';
import { InsufficientStockError } from '../../domain/errors/inventory.errors';

describe('ReserveStockUsecase (unit) — puerto', () => {
    it('reserves quantity when inventory exists and has available stock', async () => {
        const productId = 321;
        const quantity = 3;
        const reason = 'order-reserve';

        const existing = new InventoryItemEntity({ productId, onHand: 10, reserved: 0 });

        const productRead = { findById: jest.fn().mockResolvedValue({ id: productId }) } as any;
        const readRepo = { findByProductId: jest.fn().mockResolvedValue(existing) } as any;
        const writeRepo = { save: jest.fn().mockImplementation(async (i: InventoryItemEntity) => i), addMovement: jest.fn().mockResolvedValue(undefined) } as any;

        const uc = new ReserveStockUsecase(readRepo, writeRepo, productRead);

        const saved = await uc.execute({ productId, quantity, reason } as any);

        expect(productRead.findById).toHaveBeenCalledWith(productId);
        expect(readRepo.findByProductId).toHaveBeenCalledWith(productId);
        expect(writeRepo.save).toHaveBeenCalledTimes(1);
        expect(writeRepo.addMovement).toHaveBeenCalledTimes(1);

        expect(saved).toBeInstanceOf(InventoryItemEntity);
        expect(saved.productId).toBe(productId);
        expect(saved.reserved).toBe(quantity);
        expect(saved.available).toBe(10 - quantity);

        const movement = writeRepo.addMovement.mock.calls[0][0];
        expect(movement.quantity).toBe(quantity);
        expect(movement.type).toBe('RESERVATION');
    });

    it('throws InsufficientStockError when inventory does not exist', async () => {
        const productId = 222;
        const productRead = { findById: jest.fn().mockResolvedValue({ id: productId }) } as any;
        const readRepo = { findByProductId: jest.fn().mockResolvedValue(null) } as any;
        const writeRepo = { save: jest.fn(), addMovement: jest.fn() } as any;

        const uc = new ReserveStockUsecase(readRepo, writeRepo, productRead);

        await expect(uc.execute({ productId, quantity: 1, reason: 'x' } as any)).rejects.toBeInstanceOf(InsufficientStockError);

        expect(productRead.findById).toHaveBeenCalledWith(productId);
        expect(readRepo.findByProductId).toHaveBeenCalledWith(productId);
        expect(writeRepo.save).not.toHaveBeenCalled();
    });
});
