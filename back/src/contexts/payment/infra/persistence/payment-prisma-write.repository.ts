import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { paymentToPrisma, prismaToPayment } from '../mappers/payment-prisma.mapper';
import { IPaymentWriteRepository } from '../../app/ports/payment-write.repository';
import { PaymentEntity } from '../../domain/entity/payment.entity';

@Injectable()
export class PaymentPrismaWriteRepository implements IPaymentWriteRepository {
    constructor(private readonly prisma: PrismaService) { }

    async save(payment: PaymentEntity): Promise<PaymentEntity> {
        const data = paymentToPrisma(payment);
        const upserted = await this.prisma.payment.upsert({
            where: { id: data.id },
            create: data,
            update: data,
        });
        return prismaToPayment(upserted)!;
    }
}
