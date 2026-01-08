import { PaymentEntity } from '../../domain/entity/payment.entity';

export interface IPaymentWriteRepository {
    save(payment: PaymentEntity): Promise<PaymentEntity>;
}

export default IPaymentWriteRepository;
