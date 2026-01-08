import { Test } from '@nestjs/testing';
import { PaymentModule } from 'src/contexts/payment/payment.module';
import { PAYMENT_PROVIDER } from 'src/contexts/payment/constants';
import { PaymentProviderStripeAdapter } from 'src/contexts/payment/infra/adapters/payment-provider-stripe.adapter';
import { ensureTestEnv } from 'src/test-utils/prisma-test-helpers';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('PaymentProviderStripeAdapter — Integration (adapter)', () => {
    let moduleRef: any;
    let provider: any;

    beforeAll(async () => {
        const mod = await Test.createTestingModule({ imports: [PaymentModule] })
            .overrideProvider(PAYMENT_PROVIDER)
            .useClass(PaymentProviderStripeAdapter)
            .compile();
        moduleRef = mod;
        await moduleRef.init();
        provider = moduleRef.get(PAYMENT_PROVIDER as any);
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('initiatePayment returns stripe-shaped result and PENDING status', async () => {
        const res = await provider.initiatePayment({ paymentId: 'ps1', orderId: 'o', amount: 1 });
        expect(typeof res.externalPaymentId).toBe('string');
        expect(res.externalPaymentId.startsWith('pi_stripe_')).toBe(true);
        expect(res.status).toBe('PENDING');
    });
});
