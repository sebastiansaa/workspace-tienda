import { IPaymentReadRepository } from '../ports/payment-read.repository';
import GetPaymentByIdQuery from '../queries/get-payment-by-id.query';
import { PaymentEntity } from '../../domain/entity/payment.entity';

export class GetPaymentByIdUsecase {
    constructor(private readonly paymentReadRepo: IPaymentReadRepository) { }

    async execute(query: GetPaymentByIdQuery): Promise<PaymentEntity | null> {
        const payment = await this.paymentReadRepo.findById(query.paymentId);
        if (!payment) return null;
        if (payment.userId !== query.userId) return null;
        return payment;
    }
}

export default GetPaymentByIdUsecase;
