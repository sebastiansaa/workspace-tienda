import { PaymentEntity } from '../../domain/entity/payment.entity';
import { IPaymentReadRepository } from '../ports/payment-read.repository';
import { IPaymentWriteRepository } from '../ports/payment-write.repository';
import PaymentProviderPort from '../ports/payment-provider.port';
import FailPaymentCommand from '../commands/fail-payment.command';

export class FailPaymentUsecase {
    constructor(
        private readonly paymentReadRepo: IPaymentReadRepository,
        private readonly paymentWriteRepo: IPaymentWriteRepository,
        private readonly provider: PaymentProviderPort,
    ) { }

    async execute(cmd: FailPaymentCommand): Promise<PaymentEntity> {
        const payment = await this.paymentReadRepo.findById(cmd.paymentId);
        if (!payment) throw new Error('Payment not found');
        if (payment.userId !== cmd.userId) throw new Error('Payment does not belong to user');
        if (!payment.externalPaymentId) throw new Error('Payment has no external reference');

        const providerResult = await this.provider.failPayment({ externalPaymentId: payment.externalPaymentId });
        payment.setExternalInfo(providerResult.externalPaymentId, providerResult.clientSecret);
        payment.markFailed();

        return this.paymentWriteRepo.save(payment);
    }
}

export default FailPaymentUsecase;
