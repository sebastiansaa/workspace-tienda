import InitiatePaymentUsecase from '../../app/usecases/initiate-payment.usecase';
import ConfirmPaymentUsecase from '../../app/usecases/confirm-payment.usecase';
import FailPaymentUsecase from '../../app/usecases/fail-payment.usecase';
import { PaymentEntity } from '../../domain/entity/payment.entity';

describe('PaymentProviderPort — Unit (puerto)', () => {
    it('InitiatePayment calls provider.initiatePayment with exact shape and handles PENDING', async () => {
        const order = { id: 'o1', userId: 'u1', totalAmount: 100 };
        const orderRead = { findById: jest.fn().mockResolvedValue(order) } as any;

        const provider = {
            initiatePayment: jest.fn().mockResolvedValue({ externalPaymentId: 'ext-1', clientSecret: 'cs-1', status: 'PENDING' }),
        } as any;

        const writeRepo = { save: jest.fn().mockImplementation(async (p: PaymentEntity) => p) } as any;
        const orderWrite = { createCheckoutOrder: jest.fn() } as any;

        const uc = new InitiatePaymentUsecase(writeRepo, provider, orderRead, orderWrite);
        const res = await uc.execute({ orderId: order.id, userId: order.userId, amount: 100 } as any);

        expect(orderRead.findById).toHaveBeenCalledWith(order.id);
        expect(orderWrite.createCheckoutOrder).not.toHaveBeenCalled();
        expect(provider.initiatePayment).toHaveBeenCalledTimes(1);

        const calledWith = provider.initiatePayment.mock.calls[0][0];
        expect(calledWith).toMatchObject({ paymentId: expect.any(String), orderId: order.id, amount: 100 });

        expect(res).toBeInstanceOf(PaymentEntity);
        expect(res.status).toBe('PENDING');
        expect(res.externalPaymentId).toBe('ext-1');
    });

    it('ConfirmPayment calls provider.confirmPayment and applies PAID status when provider returns PAID', async () => {
        const payment = PaymentEntity.rehydrate({ orderId: 'o2', userId: 'u2', amount: 50, status: 'PENDING', externalPaymentId: 'ext-2' });
        const readRepo = { findById: jest.fn().mockResolvedValue(payment) } as any;
        const writeRepo = { save: jest.fn().mockImplementation(async (p: PaymentEntity) => p) } as any;
        const provider = { confirmPayment: jest.fn().mockResolvedValue({ externalPaymentId: 'ext-2', clientSecret: 'cs-2', status: 'PAID' }) } as any;

        const uc = new ConfirmPaymentUsecase(readRepo, writeRepo, provider);
        const after = await uc.execute({ paymentId: payment.id, userId: payment.userId } as any);

        expect(readRepo.findById).toHaveBeenCalledWith(payment.id);
        expect(provider.confirmPayment).toHaveBeenCalledWith({ externalPaymentId: payment.externalPaymentId });
        expect(after.status).toBe('PAID');
    });

    it('FailPayment calls provider.failPayment and marks FAILED', async () => {
        const payment = PaymentEntity.rehydrate({ orderId: 'o3', userId: 'u3', amount: 5, status: 'PENDING', externalPaymentId: 'ext-3' });
        const readRepo = { findById: jest.fn().mockResolvedValue(payment) } as any;
        const writeRepo = { save: jest.fn().mockImplementation(async (p: PaymentEntity) => p) } as any;
        const provider = { failPayment: jest.fn().mockResolvedValue({ externalPaymentId: 'ext-3', clientSecret: 'cs-3', status: 'FAILED' }) } as any;

        const uc = new FailPaymentUsecase(readRepo, writeRepo, provider);
        const after = await uc.execute({ paymentId: payment.id, userId: payment.userId } as any);

        expect(provider.failPayment).toHaveBeenCalledWith({ externalPaymentId: payment.externalPaymentId });
        expect(after.status).toBe('FAILED');
    });
});
