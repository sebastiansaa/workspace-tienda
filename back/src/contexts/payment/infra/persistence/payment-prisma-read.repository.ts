import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { prismaToPayment } from '../mappers/payment-prisma.mapper';
import { IPaymentReadRepository } from '../../app/ports/payment-read.repository';
import { PaymentEntity } from '../../domain/entity/payment.entity';

@Injectable()
export class PaymentPrismaReadRepository implements IPaymentReadRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<PaymentEntity | null> {
        const record = await this.prisma.payment.findUnique({ where: { id } });
        return prismaToPayment(record);
    }

    async listByUser(userId: string): Promise<PaymentEntity[]> {
        const records = await this.prisma.payment.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
        return records.map((r) => prismaToPayment(r)!) as PaymentEntity[];
    }

    async listAll(): Promise<PaymentEntity[]> {
        const records = await this.prisma.payment.findMany({ orderBy: { createdAt: 'desc' } });
        return records.map((r) => prismaToPayment(r)!) as PaymentEntity[];
    }
}
