import { Test } from '@nestjs/testing';
import { OrdersModule } from '../../order.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { cleanDatabase, ensureTestEnv } from 'src/test-utils/prisma-test-helpers';
import { ORDER_WRITE_REPOSITORY } from '../../constants';
import type { IOrderWriteRepository } from '../../app/ports/order-write.repository';
import { OrderEntity } from '../../domain/entity/order.entity';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('OrderPrismaWriteRepository integration (Prisma)', () => {
    let prisma: PrismaService;
    let repo: IOrderWriteRepository;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({ imports: [OrdersModule] }).compile();
        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        repo = moduleRef.get(ORDER_WRITE_REPOSITORY as any);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    it('saves order and persists items json', async () => {
        const order = OrderEntity.create({ userId: 'u-test', items: [{ productId: 1, quantity: 2, price: 5 }] });
        const saved = await repo.save(order);

        expect(saved).toBeInstanceOf(OrderEntity);
        expect(saved.id).toBeDefined();
        expect(saved.userId).toBe('u-test');
        expect(saved.items.length).toBe(1);

        const found = await prisma.order.findUnique({ where: { id: saved.id } });
        expect(found).not.toBeNull();
        expect(found?.userId).toBe('u-test');
        expect(Array.isArray(found?.items)).toBe(true);
        expect((found?.items as any)[0].productId).toBe(1);
    });
});
