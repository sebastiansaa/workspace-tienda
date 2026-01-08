import { Test } from '@nestjs/testing';
import { OrdersModule } from '../../order.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { cleanDatabase, ensureTestEnv } from 'src/test-utils/prisma-test-helpers';
import { ORDER_CART_READONLY } from '../../constants';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('CartReadOnlyAdapter integration (Orders module)', () => {
    let moduleRef: any;
    let prisma: PrismaService;
    let cartAdapter: any;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({ imports: [OrdersModule] }).compile();
        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        cartAdapter = moduleRef.get(ORDER_CART_READONLY as any);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('returns empty array when no cart', async () => {
        const res = await cartAdapter.getCartItems('no-user');
        expect(Array.isArray(res)).toBe(true);
        expect(res.length).toBe(0);
    });

    it('returns mapped items when cart exists', async () => {
        const userId = 'cart-user-1';
        await prisma.cart.create({ data: { id: 'c1', userId, items: [{ productId: 10, quantity: 2, price: 5 }] } });

        const res = await cartAdapter.getCartItems(userId);
        expect(res.length).toBe(1);
        expect(res[0].productId).toBe(10);
        expect(res[0].quantity).toBe(2);
        expect(res[0].price).toBe(5);
    });
});
