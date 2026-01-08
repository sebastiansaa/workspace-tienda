import { IncreaseStockUsecase } from '../../app/usecases/increase-stock.usecase';
import { InventoryItemEntity } from '../../domain/entity/inventory-item.entity';
import { InsufficientStockError } from '../../domain/errors/inventory.errors';

describe('IncreaseStockUsecase (unit) — puerto', () => {
    it('increments onHand when product exists and no existing inventory', async () => {
        const productId = 123;
        const quantity = 5;
        const reason = 'restock';

        const productRead = { findById: jest.fn().mockResolvedValue({ id: productId, name: 'P' }) } as any;
        const readRepo = { findByProductId: jest.fn().mockResolvedValue(null) } as any;
        const writeRepo = { save: jest.fn().mockImplementation(async (i: InventoryItemEntity) => i), addMovement: jest.fn().mockResolvedValue(undefined) } as any;

        const uc = new IncreaseStockUsecase(readRepo, writeRepo, productRead);

        const saved = await uc.execute({ productId, quantity, reason } as any);

        expect(productRead.findById).toHaveBeenCalledWith(productId);
        expect(readRepo.findByProductId).toHaveBeenCalledWith(productId);
        expect(writeRepo.save).toHaveBeenCalledTimes(1);
        expect(writeRepo.addMovement).toHaveBeenCalledTimes(1);

        // saved must be InventoryItemEntity with correct onHand
        expect(saved).toBeInstanceOf(InventoryItemEntity);
        expect(saved.productId).toBe(productId);
        expect(saved.onHand).toBe(quantity);

        const movement = writeRepo.addMovement.mock.calls[0][0];
        expect(movement.quantity).toBe(quantity);
        expect(movement.reason).toBe(reason);
        expect(movement.onHandAfter).toBe(quantity);
    });

    it('throws InsufficientStockError when product not found', async () => {
        const productId = 999;
        const productRead = { findById: jest.fn().mockResolvedValue(null) } as any;
        const readRepo = { findByProductId: jest.fn() } as any;
        const writeRepo = { save: jest.fn(), addMovement: jest.fn() } as any;

        const uc = new IncreaseStockUsecase(readRepo, writeRepo, productRead);

        await expect(uc.execute({ productId, quantity: 1, reason: 'x' } as any)).rejects.toBeInstanceOf(InsufficientStockError);

        expect(productRead.findById).toHaveBeenCalledWith(productId);
        expect(readRepo.findByProductId).not.toHaveBeenCalled();
        expect(writeRepo.save).not.toHaveBeenCalled();
    });
});
