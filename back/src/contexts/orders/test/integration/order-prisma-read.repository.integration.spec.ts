import { Test } from '@nestjs/testing';
import { OrdersModule } from '../../order.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { cleanDatabase, ensureTestEnv } from 'src/test-utils/prisma-test-helpers';
import { ORDER_READ_REPOSITORY } from '../../constants';
import type { IOrderReadRepository } from '../../app/ports/order-read.repository';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('OrderPrismaReadRepository integration (Prisma)', () => {
    let prisma: PrismaService;
    let repo: IOrderReadRepository;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({ imports: [OrdersModule] }).compile();
        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        repo = moduleRef.get(ORDER_READ_REPOSITORY as any);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    it('findById returns mapped OrderEntity', async () => {
        const id = 'oid-1';
        const created = await prisma.order.create({ data: { id, userId: 'u1', items: [{ productId: 42, quantity: 1, price: 10 }], status: 'PENDING', totalAmount: 10 } });

        const order = await repo.findById(id);
        expect(order).not.toBeNull();
        expect(order?.id).toBe(id);
        expect(order?.userId).toBe('u1');
        expect(order?.items.length).toBe(1);
        expect(order?.items[0].productId).toBe(42);
    });

    it('listByUser returns ordered list by createdAt desc', async () => {
        await prisma.order.create({ data: { id: 'o1', userId: 'uX', items: [{ productId: 1, quantity: 1, price: 1 }], status: 'PENDING', totalAmount: 1 } });
        await prisma.order.create({ data: { id: 'o2', userId: 'uX', items: [{ productId: 2, quantity: 2, price: 2 }], status: 'PENDING', totalAmount: 4 } });

        const list = await repo.listByUser('uX');
        expect(list.length).toBeGreaterThanOrEqual(2);
        expect(list[0].createdAt.getTime()).toBeGreaterThanOrEqual(list[1].createdAt.getTime());
    });
});
