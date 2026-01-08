import { ListOrdersForUserUsecase } from '../../app/usecases/list-orders-for-user.usecase';
import { OrderEntity } from '../../domain/entity/order.entity';

describe('ListOrdersForUserUsecase (unit) — puerto', () => {
    it('returns list of orders from repo', async () => {
        const o1 = OrderEntity.create({ userId: 'u1', items: [{ productId: 1, quantity: 1, price: 1 }] });
        const o2 = OrderEntity.create({ userId: 'u1', items: [{ productId: 2, quantity: 2, price: 2 }] });
        const readRepo = { listByUser: jest.fn().mockResolvedValue([o2, o1]) } as any;
        const uc = new ListOrdersForUserUsecase(readRepo);

        const res = await uc.execute({ userId: 'u1' } as any);
        expect(readRepo.listByUser).toHaveBeenCalledWith('u1');
        expect(Array.isArray(res)).toBe(true);
        expect(res[0].id).toBeDefined();
    });
});
