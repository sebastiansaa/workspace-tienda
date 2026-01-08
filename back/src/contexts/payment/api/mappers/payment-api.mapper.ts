import { InitiatePaymentDto, PaymentResponseDto } from '../dtos';
import InitiatePaymentCommand, { InitiatePaymentItemPayload } from '../../app/commands/initiate-payment.command';
import ConfirmPaymentCommand from '../../app/commands/confirm-payment.command';
import FailPaymentCommand from '../../app/commands/fail-payment.command';
import GetPaymentByIdQuery from '../../app/queries/get-payment-by-id.query';
import ListPaymentsForUserQuery from '../../app/queries/list-payments-for-user.query';
import { PaymentEntity } from '../../domain/entity/payment.entity';

export class PaymentApiMapper {
    static toInitiateCommand(dto: InitiatePaymentDto, userId: string): InitiatePaymentCommand {
        const items: InitiatePaymentItemPayload[] | undefined = dto.items?.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
        }));

        return new InitiatePaymentCommand(
            dto.orderId ?? null,
            dto.amount,
            userId,
            items,
            dto.paymentMethodToken,
            dto.currency,
        );
    }

    static toConfirmCommand(paymentId: string, userId: string, paymentMethodToken?: string): ConfirmPaymentCommand {
        return new ConfirmPaymentCommand(paymentId, userId, paymentMethodToken);
    }

    static toFailCommand(paymentId: string, userId: string): FailPaymentCommand {
        return new FailPaymentCommand(paymentId, userId);
    }

    static toGetByIdQuery(paymentId: string, userId: string): GetPaymentByIdQuery {
        return new GetPaymentByIdQuery(paymentId, userId);
    }

    static toListForUserQuery(userId: string): ListPaymentsForUserQuery {
        return new ListPaymentsForUserQuery(userId);
    }

    static toResponseDto(entity: PaymentEntity): PaymentResponseDto {
        return {
            paymentId: entity.id,
            orderId: entity.orderId,
            amount: entity.amount,
            status: entity.status,
            externalPaymentId: entity.externalPaymentId,
            clientSecret: entity.clientSecret,
            provider: entity.provider,
            createdAt: entity.createdAt.toISOString(),
            updatedAt: entity.updatedAt.toISOString(),
        };
    }

    static toResponseList(entities: PaymentEntity[]): PaymentResponseDto[] {
        return entities.map((p) => this.toResponseDto(p));
    }
}

export default PaymentApiMapper;
