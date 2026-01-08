import { IPaymentReadRepository } from '../ports/payment-read.repository';
import { PaymentEntity } from '../../domain/entity/payment.entity';

export class ListAllPaymentsUsecase {
    constructor(private readonly paymentReadRepo: IPaymentReadRepository) { }

    async execute(): Promise<PaymentEntity[]> {
        return this.paymentReadRepo.listAll();
    }
}

export default ListAllPaymentsUsecase;
