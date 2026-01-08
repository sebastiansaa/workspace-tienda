import { Test } from '@nestjs/testing';
import { OrdersModule } from '../../order.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { cleanDatabase, ensureTestEnv } from 'src/test-utils/prisma-test-helpers';
import { ORDER_PRICING_SERVICE, ORDER_PRODUCT_READONLY } from '../../constants';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('PricingServiceAdapter integration (Orders module)', () => {
    let moduleRef: any;
    let prisma: PrismaService;
    let pricing: any;
    let productAdapter: any;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({ imports: [OrdersModule] }).compile();
        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        pricing = moduleRef.get(ORDER_PRICING_SERVICE as any);
        productAdapter = moduleRef.get(ORDER_PRODUCT_READONLY as any);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('returns product price via product adapter', async () => {
        const cat = await prisma.category.create({ data: { title: 'PrcCat', slug: `prccat-${Date.now()}`, image: 'http://example.com/img.jpg' } });
        const prod = await prisma.product.create({ data: { title: 'PrcP', slug: `prcp-${Date.now()}`, price: new (require('@prisma/client').Prisma).Decimal(12), description: '', categoryId: cat.id, stock: 2, images: [] } });

        const p = await pricing.getPrice(prod.id);
        expect(p).toBeDefined();
        expect(p).toBeGreaterThan(0);

        // also ensure product adapter returns same base price
        const snap = await productAdapter.findById(prod.id);
        expect(snap.price).toBe(p);
    });
});
