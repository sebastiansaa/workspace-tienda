import { Test } from '@nestjs/testing';
import { PaymentModule } from 'src/contexts/payment/payment.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { cleanDatabase, ensureTestEnv } from 'src/test-utils/prisma-test-helpers';
import { PAYMENT_READ_REPOSITORY } from 'src/contexts/payment/constants';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('PaymentPrismaReadRepository — Integration (adapter)', () => {
    let moduleRef: any;
    let prisma: any;
    let readRepo: any;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({ imports: [PaymentModule] }).compile();
        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        readRepo = moduleRef.get(PAYMENT_READ_REPOSITORY as any);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('findById and listByUser return PaymentEntity mapped from prisma', async () => {
        const order = await prisma.order.create({ data: { id: `r-${Date.now()}`, userId: 'ru', items: [{ productId: 12, quantity: 1, price: 2 }], totalAmount: 2 } });
        const created = await prisma.payment.create({ data: { orderId: order.id, userId: 'ru', amount: 2, status: 'PENDING', provider: 'FAKE' } });

        const fetched = await readRepo.findById(created.id);
        expect(fetched).not.toBeNull();
        expect(fetched?.id).toBe(created.id);

        const list = await readRepo.listByUser('ru');
        expect(Array.isArray(list)).toBe(true);
        expect(list.some((p: any) => p.id === created.id)).toBe(true);
    });
});
