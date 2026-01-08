import { Test } from '@nestjs/testing';
import { PaymentModule } from 'src/contexts/payment/payment.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { cleanDatabase, ensureTestEnv } from 'src/test-utils/prisma-test-helpers';
import { PAYMENT_WRITE_REPOSITORY } from 'src/contexts/payment/constants';
import { PaymentEntity } from 'src/contexts/payment/domain/entity/payment.entity';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('PaymentPrismaWriteRepository — Integration (adapter)', () => {
    let moduleRef: any;
    let prisma: any;
    let writeRepo: any;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({ imports: [PaymentModule] }).compile();
        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        writeRepo = moduleRef.get(PAYMENT_WRITE_REPOSITORY as any);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('save persists PaymentEntity and maps back correctly', async () => {
        const order = await prisma.order.create({ data: { id: `w-${Date.now()}`, userId: 'wu', items: [{ productId: 33, quantity: 2, price: 3 }], totalAmount: 6 } });
        const payment = PaymentEntity.create({ orderId: order.id, userId: 'wu', amount: 6, status: 'PENDING', provider: 'FAKE' });

        const saved = await writeRepo.save(payment);
        expect(saved).toBeDefined();
        expect(saved.id).toBeDefined();
        expect(saved.orderId).toBe(order.id);

        const raw = await prisma.payment.findUnique({ where: { id: saved.id } });
        expect(raw).not.toBeNull();
        expect(raw?.userId).toBe('wu');
    });
});
