import { IPaymentReadRepository } from '../ports/payment-read.repository';
import { PaymentEntity } from '../../domain/entity/payment.entity';

export class AdminGetPaymentByIdUsecase {
    constructor(private readonly paymentReadRepo: IPaymentReadRepository) { }

    async execute(id: string): Promise<PaymentEntity | null> {
        return this.paymentReadRepo.findById(id);
    }
}

export default AdminGetPaymentByIdUsecase;
