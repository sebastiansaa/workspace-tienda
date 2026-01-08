import { CancelOrderUsecase } from '../../app/usecases/cancel-order.usecase';
import { MarkOrderAsPaidUsecase } from '../../app/usecases/mark-order-as-paid.usecase';
import { MarkOrderAsCompletedUsecase } from '../../app/usecases/mark-order-as-completed.usecase';
import { OrderEntity } from '../../domain/entity/order.entity';
import { OrderOwnershipError } from '../../domain/errors/order.errors';

describe('Order state change usecases (unit) — puertos', () => {
    it('cancel saves cancelled order when owned', async () => {
        const ord = OrderEntity.create({ userId: 'owner', items: [{ productId: 1, quantity: 1, price: 1 }] });
        const readRepo = { findById: jest.fn().mockResolvedValue(ord) } as any;
        const writeRepo = { save: jest.fn().mockImplementation(async (o: OrderEntity) => o) } as any;
        const uc = new CancelOrderUsecase(readRepo, writeRepo);

        const res = await uc.execute({ orderId: ord.id, userId: 'owner' } as any);
        expect(readRepo.findById).toHaveBeenCalledWith(ord.id);
        expect(writeRepo.save).toHaveBeenCalledWith(expect.any(OrderEntity));
        expect(res?.status).toBe('CANCELLED');
    });

    it('throws OrderOwnershipError when cancelling not owned', async () => {
        const ord = OrderEntity.create({ userId: 'owner', items: [{ productId: 1, quantity: 1, price: 1 }] });
        const readRepo = { findById: jest.fn().mockResolvedValue(ord) } as any;
        const uc = new CancelOrderUsecase(readRepo, {} as any);
        await expect(uc.execute({ orderId: ord.id, userId: 'intruder' } as any)).rejects.toBeInstanceOf(OrderOwnershipError);
    });

    it('mark paid updates to PAID state', async () => {
        const ord = OrderEntity.create({ userId: 'owner', items: [{ productId: 1, quantity: 1, price: 1 }] });
        const readRepo = { findById: jest.fn().mockResolvedValue(ord) } as any;
        const writeRepo = { save: jest.fn().mockImplementation(async (o: OrderEntity) => o) } as any;
        const uc = new MarkOrderAsPaidUsecase(readRepo, writeRepo);

        const res = await uc.execute({ orderId: ord.id, userId: 'owner' } as any);
        expect(res?.status).toBe('PAID');
        expect(writeRepo.save).toHaveBeenCalled();
    });

    it('mark completed updates to COMPLETED state', async () => {
        const ord = OrderEntity.rehydrate({ userId: 'owner', items: [{ productId: 1, quantity: 1, price: 1 }], status: 'PAID' });
        const readRepo = { findById: jest.fn().mockResolvedValue(ord) } as any;
        const writeRepo = { save: jest.fn().mockImplementation(async (o: OrderEntity) => o) } as any;
        const uc = new MarkOrderAsCompletedUsecase(readRepo, writeRepo);

        const res = await uc.execute({ orderId: ord.id, userId: 'owner' } as any);
        expect(res?.status).toBe('COMPLETED');
        expect(writeRepo.save).toHaveBeenCalled();
    });
});
