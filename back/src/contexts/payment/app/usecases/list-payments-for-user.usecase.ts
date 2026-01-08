import { IPaymentReadRepository } from '../ports/payment-read.repository';
import ListPaymentsForUserQuery from '../queries/list-payments-for-user.query';
import { PaymentEntity } from '../../domain/entity/payment.entity';

export class ListPaymentsForUserUsecase {
    constructor(private readonly paymentReadRepo: IPaymentReadRepository) { }

    async execute(query: ListPaymentsForUserQuery): Promise<PaymentEntity[]> {
        return this.paymentReadRepo.listByUser(query.userId);
    }
}

export default ListPaymentsForUserUsecase;
