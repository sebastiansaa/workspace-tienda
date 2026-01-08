import { Test } from '@nestjs/testing';
import { PaymentModule } from 'src/contexts/payment/payment.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { cleanDatabase, ensureTestEnv } from 'src/test-utils/prisma-test-helpers';
import { PAYMENT_ORDER_READONLY } from 'src/contexts/payment/constants';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('PaymentOrderReadAdapter — Integration (adapter)', () => {
    let moduleRef: any;
    let prisma: any;
    let adapter: any;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({ imports: [PaymentModule] }).compile();
        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        adapter = moduleRef.get(PAYMENT_ORDER_READONLY as any);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('findById returns id, userId and totalAmount for existing order', async () => {
        const order = await prisma.order.create({ data: { id: `o-${Date.now()}`, userId: 'ur', items: [{ productId: 101, quantity: 1, price: 5 }], totalAmount: 5 } });
        const found = await adapter.findById(order.id);
        expect(found).toHaveProperty('id', order.id);
        expect(found).toHaveProperty('userId', 'ur');
        expect(found).toHaveProperty('totalAmount', 5);
    });
});
