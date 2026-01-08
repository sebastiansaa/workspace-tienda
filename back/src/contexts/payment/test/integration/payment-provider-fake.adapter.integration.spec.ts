import { Test } from '@nestjs/testing';
import { PaymentModule } from 'src/contexts/payment/payment.module';
import { ensureTestEnv } from 'src/test-utils/prisma-test-helpers';
import { PAYMENT_PROVIDER } from 'src/contexts/payment/constants';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('PaymentProviderFakeAdapter — Integration (adapter)', () => {
    let moduleRef: any;
    let provider: any;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({ imports: [PaymentModule] }).compile();
        await moduleRef.init();
        provider = moduleRef.get(PAYMENT_PROVIDER as any);
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('initiatePayment returns full shape and allowed statuses', async () => {
        const res = await provider.initiatePayment({ paymentId: 'p1', orderId: 'o1', amount: 1 });
        expect(res).toHaveProperty('externalPaymentId');
        expect(res).toHaveProperty('clientSecret');
        expect(res).toHaveProperty('status');
        expect(['PENDING', 'AUTHORIZED', 'FAILED', 'PAID']).toContain(res.status);
        expect(res.payload).toHaveProperty('created');
    });
});
