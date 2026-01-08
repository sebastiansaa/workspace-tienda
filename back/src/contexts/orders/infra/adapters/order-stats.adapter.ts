import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { OrderStatsPort } from '../../../shared/ports/admin/order-stats.port';

type OrderStatusValue = 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELLED';

const ORDER_STATUS_VALUES = new Set<OrderStatusValue>(['PENDING', 'PAID', 'COMPLETED', 'CANCELLED']);

function normalizeStatus(status: string): OrderStatusValue | undefined {
    return ORDER_STATUS_VALUES.has(status as OrderStatusValue) ? (status as OrderStatusValue) : undefined;
}

@Injectable()
export class OrderStatsAdapter implements OrderStatsPort {
    constructor(private readonly prisma: PrismaService) { }

    async countTotal(): Promise<number> {
        return this.prisma.order.count();
    }

    async sumRevenue(status: string): Promise<number> {
        const normalized = normalizeStatus(status);
        const result = await this.prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: normalized ? { status: normalized } : undefined,
        });
        return result._sum.totalAmount ?? 0;
    }

    async countByStatus(status: string): Promise<number> {
        const normalized = normalizeStatus(status);
        if (!normalized) return 0;
        return this.prisma.order.count({ where: { status: normalized } });
    }
}
