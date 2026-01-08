import { Test } from '@nestjs/testing';
import { CartModule } from '../../cart.module';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CART_WRITE_REPOSITORY } from '../../constants';
import { cleanDatabase, ensureTestEnv } from '../../../../test-utils/prisma-test-helpers';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('CartPrismaWriteRepository integration (Prisma)', () => {
    let moduleRef: any;
    let prisma: PrismaService;
    let repo: any;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({ imports: [CartModule] }).compile();
        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        repo = moduleRef.get(CART_WRITE_REPOSITORY as any);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('saves a cart and persists items', async () => {
        const cart = await repo.save({ id: 'c1', userId: 'u1', items: [{ productId: 1, quantity: 2, price: 10 }] });
        expect(cart).toBeDefined();

        const raw = await prisma.cart.findUnique({ where: { id: 'c1' } });
        expect(raw).toBeDefined();
        expect(Array.isArray(raw?.items)).toBe(true);
        expect((raw?.items as any[])[0].productId).toBe(1);
    });

    it('clear removes cart for user', async () => {
        await repo.save({ id: 'c2', userId: 'u2', items: [{ productId: 2, quantity: 1, price: 5 }] });
        await repo.clear('u2');
        const found = await prisma.cart.findFirst({ where: { userId: 'u2' } });
        expect(found).toBeNull();
    });
});
