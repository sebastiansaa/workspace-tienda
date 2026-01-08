import ConfirmPaymentUsecase from '../../app/usecases/confirm-payment.usecase';
import GetPaymentByIdUsecase from '../../app/usecases/get-payment-by-id.usecase';
import ListPaymentsForUserUsecase from '../../app/usecases/list-payments-for-user.usecase';
import { PaymentEntity } from '../../domain/entity/payment.entity';

describe('IPaymentReadRepository — Unit (puerto)', () => {
    it('provides findById and listByUser contract for usecases', async () => {
        const payment = PaymentEntity.rehydrate({ orderId: 'o-r', userId: 'u-r', amount: 9, status: 'PENDING', externalPaymentId: 'er' });
        const readRepo = {
            findById: jest.fn().mockResolvedValue(payment),
            listByUser: jest.fn().mockResolvedValue([payment]),
        } as any;

        // Confirm uses findById
        const writeRepo = { save: jest.fn().mockImplementation(async (p: PaymentEntity) => p) } as any;
        const provider = { confirmPayment: jest.fn().mockResolvedValue({ externalPaymentId: 'er', clientSecret: 'c', status: 'PAID' }) } as any;
        const confirmUc = new ConfirmPaymentUsecase(readRepo, writeRepo, provider);
        const after = await confirmUc.execute({ paymentId: payment.id, userId: payment.userId } as any);
        expect(readRepo.findById).toHaveBeenCalledWith(payment.id);
        expect(after.status).toBe('PAID');

        // Get by id
        const getUc = new GetPaymentByIdUsecase(readRepo);
        const found = await getUc.execute({ paymentId: payment.id, userId: payment.userId } as any);
        expect(found).not.toBeNull();

        // List by user
        const listUc = new ListPaymentsForUserUsecase(readRepo);
        const list = await listUc.execute({ userId: payment.userId } as any);
        expect(Array.isArray(list)).toBe(true);
        expect(list[0].userId).toBe(payment.userId);
    });
});
