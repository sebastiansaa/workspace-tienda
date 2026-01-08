import { Test } from '@nestjs/testing';
import { CartModule } from '../../cart.module';
import { CART_PRICING_SERVICE } from '../../constants';
import { PrismaService } from '../../../../prisma/prisma.service';
import { cleanDatabase, ensureTestEnv } from '../../../../test-utils/prisma-test-helpers';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('CartPricingService integration', () => {
    let moduleRef: any;
    let svc: any;
    let prisma: PrismaService;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({ imports: [CartModule] }).compile();
        await moduleRef.init();
        svc = moduleRef.get(CART_PRICING_SERVICE as any);
        prisma = moduleRef.get(PrismaService);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('returns null when product not found', async () => {
        const p = await svc.getPrice(99999);
        expect(p).toBeNull();
    });

    it('returns product price when exists', async () => {
        const cat = await prisma.category.create({ data: { title: 'C', slug: `c-${Date.now()}`, image: 'http://x' } });
        await prisma.product.create({ data: { id: 55, title: 'TP', slug: 'tp', price: 42, stock: 1, images: [], description: 'd', categoryId: cat.id } });
        const p = await svc.getPrice(55);
        expect(p).toBe(42);
    });
});
