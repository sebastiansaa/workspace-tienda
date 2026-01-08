import { Test } from '@nestjs/testing';
import { OrdersModule } from '../../order.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { cleanDatabase, ensureTestEnv } from 'src/test-utils/prisma-test-helpers';
import { ORDER_PRODUCT_READONLY } from '../../constants';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('ProductReadOnlyAdapter integration (Orders module)', () => {
    let moduleRef: any;
    let prisma: PrismaService;
    let adapter: any;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({ imports: [OrdersModule] }).compile();
        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        adapter = moduleRef.get(ORDER_PRODUCT_READONLY as any);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('maps product DTO to snapshot', async () => {
        const cat = await prisma.category.create({ data: { title: 'PRCat', slug: `prcat-${Date.now()}`, image: 'http://example.com/img.jpg' } });
        const prod = await prisma.product.create({ data: { title: 'PRP', slug: `prp-${Date.now()}`, price: new (require('@prisma/client').Prisma).Decimal(9), description: '', categoryId: cat.id, stock: 4, images: [] } });

        const snap = await adapter.findById(prod.id);
        expect(snap).not.toBeNull();
        expect(snap.id).toBe(prod.id);
        expect(snap.price).toBeDefined();
        expect(snap.stock).toBe(4);
    });
});
