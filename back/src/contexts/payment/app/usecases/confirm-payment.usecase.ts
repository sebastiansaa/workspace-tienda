import { PaymentEntity } from '../../domain/entity/payment.entity';
import { InvalidPaymentStateError } from '../../domain/errors/payment.errors';
import { IPaymentReadRepository } from '../ports/payment-read.repository';
import { IPaymentWriteRepository } from '../ports/payment-write.repository';
import PaymentProviderPort from '../ports/payment-provider.port';
import ConfirmPaymentCommand from '../commands/confirm-payment.command';

export class ConfirmPaymentUsecase {
    constructor(
        private readonly paymentReadRepo: IPaymentReadRepository,
        private readonly paymentWriteRepo: IPaymentWriteRepository,
        private readonly provider: PaymentProviderPort,
    ) { }

    async execute(cmd: ConfirmPaymentCommand): Promise<PaymentEntity> {
        const payment = await this.paymentReadRepo.findById(cmd.paymentId);
        if (!payment) throw new Error('Payment not found');
        if (payment.userId !== cmd.userId) throw new Error('Payment does not belong to user');
        if (!payment.externalPaymentId) throw new Error('Payment has no external reference');

        const providerResult = await this.provider.confirmPayment({ externalPaymentId: payment.externalPaymentId, paymentMethodToken: cmd.paymentMethodToken });
        this.applyProviderStatus(payment, providerResult.status);
        payment.setExternalInfo(providerResult.externalPaymentId, providerResult.clientSecret);

        return this.paymentWriteRepo.save(payment);
    }

    private applyProviderStatus(payment: PaymentEntity, status: string): void {
        if (status === 'AUTHORIZED') {
            payment.markAuthorized();
            return;
        }
        if (status === 'PAID') {
            payment.markPaid();
            return;
        }
        if (status === 'FAILED') {
            payment.markFailed();
            return;
        }
        if (status === 'PENDING') return;
        throw new InvalidPaymentStateError('Unknown provider status');
    }
}

export default ConfirmPaymentUsecase;
