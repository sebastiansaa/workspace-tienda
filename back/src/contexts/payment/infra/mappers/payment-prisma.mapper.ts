import { Prisma, Payment as PaymentPrisma } from '@prisma/client';
import { PaymentEntity } from '../../domain/entity/payment.entity';
import { PaymentStatus } from '../../domain/v-o/payment-status.vo';

export const prismaToPayment = (record: PaymentPrisma | null): PaymentEntity | null => {
    if (!record) return null;
    return PaymentEntity.rehydrate({
        id: record.id,
        orderId: record.orderId,
        userId: record.userId,
        amount: Number(record.amount),
        status: record.status as PaymentStatus,
        externalPaymentId: record.externalPaymentId ?? undefined,
        clientSecret: record.clientSecret ?? undefined,
        provider: record.provider,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
    });
};

export const paymentToPrisma = (entity: PaymentEntity): Prisma.PaymentUncheckedCreateInput => ({
    id: entity.id,
    orderId: entity.orderId,
    userId: entity.userId,
    amount: new Prisma.Decimal(entity.amount),
    status: entity.status,
    externalPaymentId: entity.externalPaymentId ?? null,
    clientSecret: entity.clientSecret ?? null,
    provider: entity.provider,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
});
