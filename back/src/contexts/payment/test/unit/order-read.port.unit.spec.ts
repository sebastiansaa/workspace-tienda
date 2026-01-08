import InitiatePaymentUsecase from '../../app/usecases/initiate-payment.usecase';

describe('OrderReadOnlyPort — Unit (puerto)', () => {
    it('validates order existence, ownership and amount before initiating payment', async () => {
        const order = { id: 'ord-1', userId: 'usr-1', totalAmount: 77 };
        const orderRead = { findById: jest.fn().mockResolvedValue(order) } as any;

        const provider = { initiatePayment: jest.fn().mockResolvedValue({ externalPaymentId: 'e', clientSecret: 'c', status: 'PENDING' }) } as any;
        const writeRepo = { save: jest.fn().mockImplementation(async (p: any) => p) } as any;
        const orderWrite = { createCheckoutOrder: jest.fn() } as any;

        const uc = new InitiatePaymentUsecase(writeRepo, provider, orderRead, orderWrite);

        await expect(uc.execute({ orderId: order.id, userId: order.userId, amount: 77 } as any)).resolves.toBeDefined();
        expect(orderRead.findById).toHaveBeenCalledWith(order.id);

        // missing order
        const orderReadNull = { findById: jest.fn().mockResolvedValue(null) } as any;
        const uc2 = new InitiatePaymentUsecase(writeRepo, provider, orderReadNull, orderWrite);
        await expect(uc2.execute({ orderId: 'x', userId: 'u', amount: 1 } as any)).rejects.toThrow('Order not found');

        // ownership mismatch
        const orderReadOther = { findById: jest.fn().mockResolvedValue(order) } as any;
        const uc3 = new InitiatePaymentUsecase(writeRepo, provider, orderReadOther, orderWrite);
        await expect(uc3.execute({ orderId: order.id, userId: 'wrong', amount: 77 } as any)).rejects.toThrow('Order does not belong to user');

        // amount mismatch
        const orderReadAmt = { findById: jest.fn().mockResolvedValue(order) } as any;
        const uc4 = new InitiatePaymentUsecase(writeRepo, provider, orderReadAmt, orderWrite);
        await expect(uc4.execute({ orderId: order.id, userId: order.userId, amount: 1 } as any)).rejects.toThrow('Payment amount mismatch');
    });
});
