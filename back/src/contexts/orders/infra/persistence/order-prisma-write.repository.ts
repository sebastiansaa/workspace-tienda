import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { orderDomainToPrisma, orderPrismaToDomain } from '../mappers/order-prisma.mapper';
import { IOrderWriteRepository } from '../../app/ports/order-write.repository';
import { OrderEntity } from '../../domain/entity/order.entity';

@Injectable()
export class OrderPrismaWriteRepository implements IOrderWriteRepository {
    constructor(private readonly prisma: PrismaService) { }

    async save(order: OrderEntity): Promise<OrderEntity> {
        const data = orderDomainToPrisma(order);
        const upserted = await this.prisma.order.upsert({
            where: { id: order.id },
            create: data,
            update: data,
        });
        return orderPrismaToDomain(upserted)!;
    }
}
