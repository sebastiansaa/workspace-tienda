import { Test } from '@nestjs/testing';
import { OrdersModule } from '../../order.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { cleanDatabase, ensureTestEnv } from 'src/test-utils/prisma-test-helpers';
import { ORDER_STOCK_SERVICE } from '../../constants';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('StockServiceAdapter integration (Orders module)', () => {
    let moduleRef: any;
    let prisma: PrismaService;
    let stock: any;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({ imports: [OrdersModule] }).compile();
        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        stock = moduleRef.get(ORDER_STOCK_SERVICE as any);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('returns false when product not found', async () => {
        const ok = await stock.isAvailable(9999, 1);
        expect(ok).toBe(false);
    });

    it('returns true when stock >= quantity', async () => {
        const cat = await prisma.category.create({ data: { title: 'StCat', slug: `stcat-${Date.now()}`, image: 'http://example.com/img.jpg' } });
        const prod = await prisma.product.create({ data: { title: 'StP', slug: `stp-${Date.now()}`, price: new (require('@prisma/client').Prisma).Decimal(3), description: '', categoryId: cat.id, stock: 5, images: [] } });

        const ok = await stock.isAvailable(prod.id, 4);
        expect(ok).toBe(true);
    });
});
