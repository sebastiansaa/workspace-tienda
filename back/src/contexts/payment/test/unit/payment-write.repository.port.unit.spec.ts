import InitiatePaymentUsecase from '../../app/usecases/initiate-payment.usecase';
import ConfirmPaymentUsecase from '../../app/usecases/confirm-payment.usecase';
import FailPaymentUsecase from '../../app/usecases/fail-payment.usecase';
import { PaymentEntity } from '../../domain/entity/payment.entity';

describe('IPaymentWriteRepository — Unit (puerto)', () => {
    it('writeRepo.save is called with PaymentEntity when initiating, confirming or failing', async () => {
        const order = { id: 'ow-1', userId: 'uw-1', totalAmount: 12 };
        const orderRead = { findById: jest.fn().mockResolvedValue(order) } as any;

        const providerInit = { initiatePayment: jest.fn().mockResolvedValue({ externalPaymentId: 'ei', clientSecret: 'cs', status: 'PENDING' }) } as any;
        const writeRepo = { save: jest.fn().mockImplementation(async (p: PaymentEntity) => p) } as any;
        const orderWrite = { createCheckoutOrder: jest.fn() } as any;

        const initUc = new InitiatePaymentUsecase(writeRepo, providerInit, orderRead, orderWrite);
        const saved = await initUc.execute({ orderId: order.id, userId: order.userId, amount: 12 } as any);
        expect(writeRepo.save).toHaveBeenCalled();
        expect(saved).toBeInstanceOf(PaymentEntity);
        expect(orderWrite.createCheckoutOrder).not.toHaveBeenCalled();

        // confirm path
        const payment = PaymentEntity.rehydrate({ orderId: 'oc', userId: 'uc', amount: 3, status: 'PENDING', externalPaymentId: 'exc' });
        const readRepo = { findById: jest.fn().mockResolvedValue(payment) } as any;
        const providerConfirm = { confirmPayment: jest.fn().mockResolvedValue({ externalPaymentId: 'exc', clientSecret: 'c', status: 'PAID' }) } as any;
        const confirmUc = new ConfirmPaymentUsecase(readRepo, writeRepo, providerConfirm);
        await confirmUc.execute({ paymentId: payment.id, userId: payment.userId } as any);
        expect(writeRepo.save).toHaveBeenCalled();

        // fail path (use fresh pending)
        const paymentF = PaymentEntity.rehydrate({ orderId: 'of', userId: 'uf', amount: 4, status: 'PENDING', externalPaymentId: 'exf' });
        const readRepoF = { findById: jest.fn().mockResolvedValue(paymentF) } as any;
        const providerFail = { failPayment: jest.fn().mockResolvedValue({ externalPaymentId: 'exf', clientSecret: 'c', status: 'FAILED' }) } as any;
        const failUc = new FailPaymentUsecase(readRepoF, writeRepo, providerFail);
        await failUc.execute({ paymentId: paymentF.id, userId: paymentF.userId } as any);
        expect(writeRepo.save).toHaveBeenCalled();
    });
});
