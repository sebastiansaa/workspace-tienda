import { PaymentEntity } from '../../domain/entity/payment.entity';

export interface IPaymentReadRepository {
    findById(id: string): Promise<PaymentEntity | null>;
    listByUser(userId: string): Promise<PaymentEntity[]>;
    listAll(): Promise<PaymentEntity[]>;
}

export default IPaymentReadRepository;
