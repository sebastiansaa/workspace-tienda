import { CreateOrderFromCartUsecase } from '../../app/usecases/create-order-from-cart.usecase';
import { OrderEntity } from '../../domain/entity/order.entity';
import { EmptyOrderError, ProductUnavailableError } from '../../domain/errors/order.errors';

describe('CreateOrderFromCartUsecase (unit) — puerto', () => {
    it('creates order from cart items when valid', async () => {
        const userId = 'cu1';
        const cartItems = [{ productId: 5, quantity: 2, price: undefined }, { productId: 6, quantity: 1, price: 3 }];

        const cart = { getCartItems: jest.fn().mockResolvedValue(cartItems) } as any;
        const productRead = { findById: jest.fn().mockImplementation(async (id: number) => ({ id, price: id === 5 ? 10 : 3 })) } as any;
        const pricing = { getPrice: jest.fn().mockResolvedValue(null) } as any;
        const stock = { isAvailable: jest.fn().mockResolvedValue(true) } as any;
        const reserve = { reserve: jest.fn().mockResolvedValue(undefined) } as any;
        const writeRepo = { save: jest.fn().mockImplementation(async (o: OrderEntity) => o) } as any;

        const uc = new CreateOrderFromCartUsecase(writeRepo, cart, productRead, pricing, stock, reserve);

        const saved = await uc.execute({ userId } as any);

        expect(cart.getCartItems).toHaveBeenCalledWith(userId);
        expect(productRead.findById).toHaveBeenCalledTimes(2);
        expect(stock.isAvailable).toHaveBeenCalledTimes(2);
        expect(writeRepo.save).toHaveBeenCalledWith(expect.any(OrderEntity));
        expect(reserve.reserve).toHaveBeenCalledTimes(2);
        const firstReserveCall = reserve.reserve.mock.calls[0];
        expect(firstReserveCall[0]).toBe(5);
        expect(firstReserveCall[1]).toBe(2);
        expect(firstReserveCall[2]).toContain('Order');
        expect(firstReserveCall[2]).toContain(saved.id);

        expect(saved).toBeInstanceOf(OrderEntity);
        expect(saved.userId).toBe(userId);
        expect(saved.items.length).toBe(2);
    });

    it('throws EmptyOrderError when cart empty', async () => {
        const cart = { getCartItems: jest.fn().mockResolvedValue([]) } as any;
        const uc = new CreateOrderFromCartUsecase({} as any, cart, {} as any, {} as any, {} as any, { reserve: jest.fn() } as any);
        await expect(uc.execute({ userId: 'u' } as any)).rejects.toBeInstanceOf(EmptyOrderError);
    });

    it('throws ProductUnavailableError when stock insufficient', async () => {
        const cartItems = [{ productId: 7, quantity: 3 }];
        const cart = { getCartItems: jest.fn().mockResolvedValue(cartItems) } as any;
        const productRead = { findById: jest.fn().mockResolvedValue({ id: 7, price: 5 }) } as any;
        const pricing = { getPrice: jest.fn().mockResolvedValue(null) } as any;
        const stock = { isAvailable: jest.fn().mockResolvedValue(false) } as any;
        const reserve = { reserve: jest.fn() } as any;
        const writeRepo = { save: jest.fn() } as any;

        const uc = new CreateOrderFromCartUsecase(writeRepo, cart, productRead, pricing, stock, reserve);

        await expect(uc.execute({ userId: 'u' } as any)).rejects.toBeInstanceOf(ProductUnavailableError);
        expect(stock.isAvailable).toHaveBeenCalledWith(7, 3);
    });
});
