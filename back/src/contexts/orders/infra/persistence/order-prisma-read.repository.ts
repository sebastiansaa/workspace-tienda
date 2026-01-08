import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { orderPrismaToDomain } from '../mappers/order-prisma.mapper';
import { IOrderReadRepository } from '../../app/ports/order-read.repository';
import { OrderEntity } from '../../domain/entity/order.entity';

@Injectable()
export class OrderPrismaReadRepository implements IOrderReadRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<OrderEntity | null> {
        const record = await this.prisma.order.findUnique({ where: { id } });
        return orderPrismaToDomain(record);
    }

    async listByUser(userId: string): Promise<OrderEntity[]> {
        const records = await this.prisma.order.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
        return records.map((r) => orderPrismaToDomain(r)!).filter(Boolean);
    }

    async listAll(): Promise<OrderEntity[]> {
        const records = await this.prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
        return records.map((r) => orderPrismaToDomain(r)!).filter(Boolean);
    }
}
