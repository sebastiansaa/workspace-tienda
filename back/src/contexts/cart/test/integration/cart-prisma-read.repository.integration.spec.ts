import { Test } from '@nestjs/testing';
import { CartModule } from '../../cart.module';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CART_READ_REPOSITORY } from '../../constants';
import { cleanDatabase, ensureTestEnv } from '../../../../test-utils/prisma-test-helpers';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('CartPrismaReadRepository integration (Prisma)', () => {
    let moduleRef: any;
    let prisma: PrismaService;
    let repo: any;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({ imports: [CartModule] }).compile();
        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        repo = moduleRef.get(CART_READ_REPOSITORY as any);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('returns null when no cart exists', async () => {
        const c = await repo.findByUserId('nouser');
        expect(c).toBeNull();
    });

    it('returns cart entity with proper shape', async () => {
        await prisma.cart.create({ data: { id: 'c10', userId: 'u10', items: [{ productId: 5, quantity: 3, price: 7 }] } });
        const c = await repo.findByUserId('u10');
        expect(c).not.toBeNull();
        expect(c?.userId).toBe('u10');
        expect(c?.items.length).toBe(1);
        expect(c?.items[0].productId).toBe(5);
    });
});
