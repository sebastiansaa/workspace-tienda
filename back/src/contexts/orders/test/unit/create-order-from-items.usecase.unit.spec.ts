import { CreateOrderFromItemsUsecase } from '../../app/usecases/create-order-from-items.usecase';
import { OrderEntity } from '../../domain/entity/order.entity';
import { EmptyOrderError, ProductUnavailableError } from '../../domain/errors/order.errors';

describe('CreateOrderFromItemsUsecase (unit) — puerto', () => {
    it('creates order when all products exist, stock available and pricing applied', async () => {
        const userId = 'user-1';
        const items = [{ productId: 10, quantity: 2 }, { productId: 11, quantity: 1 }];

        const productRead = {
            findById: jest.fn()
                .mockImplementation(async (id: number) => ({ id, price: id === 10 ? 5 : 8 })),
        } as any;
        const pricing = { getPrice: jest.fn().mockImplementation(async (id: number) => (id === 10 ? 6 : null)) } as any;
        const stock = { isAvailable: jest.fn().mockResolvedValue(true) } as any;
        const reserve = { reserve: jest.fn().mockResolvedValue(undefined) } as any;
        const orderWriteRepo = { save: jest.fn().mockImplementation(async (o: OrderEntity) => o) } as any;

        const uc = new CreateOrderFromItemsUsecase(orderWriteRepo, productRead, pricing, stock, reserve);

        const saved = await uc.execute({ userId, items } as any);

        expect(productRead.findById).toHaveBeenCalledTimes(2);
        expect(stock.isAvailable).toHaveBeenCalledTimes(2);
        expect(pricing.getPrice).toHaveBeenCalledTimes(2);
        expect(orderWriteRepo.save).toHaveBeenCalledWith(expect.any(OrderEntity));
        expect(reserve.reserve).toHaveBeenCalledTimes(2);
        const reserveCall = reserve.reserve.mock.calls[0];
        expect(reserveCall[0]).toBe(10);
        expect(reserveCall[1]).toBe(2);
        expect(reserveCall[2]).toContain(saved.id);

        expect(saved).toBeInstanceOf(OrderEntity);
        expect(saved.userId).toBe(userId);
        expect(saved.items.length).toBe(2);
        // pricing override for product 10
        const item10 = saved.items.find(i => i.productId === 10)!;
        expect(item10.price).toBe(6);
        const item11 = saved.items.find(i => i.productId === 11)!;
        expect(item11.price).toBe(8);
    });

    it('throws EmptyOrderError when items empty', async () => {
        const uc = new CreateOrderFromItemsUsecase({} as any, {} as any, {} as any, {} as any, { reserve: jest.fn() } as any);
        await expect(uc.execute({ userId: 'u', items: [] } as any)).rejects.toBeInstanceOf(EmptyOrderError);
    });

    it('throws ProductUnavailableError when product not found', async () => {
        const productRead = { findById: jest.fn().mockResolvedValue(null) } as any;
        const pricing = { getPrice: jest.fn() } as any;
        const stock = { isAvailable: jest.fn() } as any;
        const reserve = { reserve: jest.fn() } as any;
        const orderWriteRepo = { save: jest.fn() } as any;

        const uc = new CreateOrderFromItemsUsecase(orderWriteRepo, productRead, pricing, stock, reserve);

        await expect(uc.execute({ userId: 'u', items: [{ productId: 99, quantity: 1 }] } as any)).rejects.toBeInstanceOf(ProductUnavailableError);
        expect(productRead.findById).toHaveBeenCalledWith(99);
        expect(stock.isAvailable).not.toHaveBeenCalled();
    });

    it('throws ProductUnavailableError when stock not available', async () => {
        const productRead = { findById: jest.fn().mockResolvedValue({ id: 5, price: 10 }) } as any;
        const pricing = { getPrice: jest.fn().mockResolvedValue(null) } as any;
        const stock = { isAvailable: jest.fn().mockResolvedValue(false) } as any;
        const reserve = { reserve: jest.fn() } as any;
        const orderWriteRepo = { save: jest.fn() } as any;

        const uc = new CreateOrderFromItemsUsecase(orderWriteRepo, productRead, pricing, stock, reserve);

        await expect(uc.execute({ userId: 'u', items: [{ productId: 5, quantity: 2 }] } as any)).rejects.toBeInstanceOf(ProductUnavailableError);
        expect(stock.isAvailable).toHaveBeenCalledWith(5, 2);
    });
});
