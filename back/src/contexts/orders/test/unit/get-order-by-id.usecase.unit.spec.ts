import { GetOrderByIdUsecase } from '../../app/usecases/get-order-by-id.usecase';
import { OrderEntity } from '../../domain/entity/order.entity';
import { OrderOwnershipError } from '../../domain/errors/order.errors';

describe('GetOrderByIdUsecase (unit) — puerto', () => {
    it('returns order when found and owned by user', async () => {
        const mockOrder = OrderEntity.create({ userId: 'u1', items: [{ productId: 1, quantity: 1, price: 5 }] });
        const readRepo = { findById: jest.fn().mockResolvedValue(mockOrder) } as any;

        const uc = new GetOrderByIdUsecase(readRepo);

        const res = await uc.execute({ orderId: mockOrder.id, userId: 'u1' } as any);
        expect(readRepo.findById).toHaveBeenCalledWith(mockOrder.id);
        expect(res).toBeInstanceOf(OrderEntity);
        expect(res?.id).toBe(mockOrder.id);
    });

    it('returns null when order not found', async () => {
        const readRepo = { findById: jest.fn().mockResolvedValue(null) } as any;
        const uc = new GetOrderByIdUsecase(readRepo);
        const res = await uc.execute({ orderId: 'nope', userId: 'u' } as any);
        expect(res).toBeNull();
    });

    it('throws OrderOwnershipError when user mismatch', async () => {
        const mockOrder = OrderEntity.create({ userId: 'owner', items: [{ productId: 2, quantity: 1, price: 3 }] });
        const readRepo = { findById: jest.fn().mockResolvedValue(mockOrder) } as any;
        const uc = new GetOrderByIdUsecase(readRepo);
        await expect(uc.execute({ orderId: mockOrder.id, userId: 'intruder' } as any)).rejects.toBeInstanceOf(OrderOwnershipError);
    });
});
