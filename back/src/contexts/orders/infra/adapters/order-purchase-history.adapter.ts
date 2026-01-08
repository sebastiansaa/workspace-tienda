import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import type OrderPurchaseHistoryPort from '../../../shared/ports/order-purchase-history.port';

const QUALIFIED_STATUSES: string[] = ['PAID', 'COMPLETED'];

interface OrderItemRecord {
    productId?: unknown;
}

function isOrderItemRecord(value: unknown): value is { productId: number } {
    if (!value || typeof value !== 'object') return false;
    const record = value as OrderItemRecord;
    return typeof record.productId === 'number';
}

function extractOrderItems(items: unknown): { productId: number }[] {
    if (!Array.isArray(items)) return [];
    return items.filter(isOrderItemRecord).map((item) => ({ productId: item.productId as number }));
}

@Injectable()
export class OrderPurchaseHistoryAdapter implements OrderPurchaseHistoryPort {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async hasUserPurchasedProduct(userId: string, productId: number): Promise<boolean> {
        const candidateOrders = await this.prisma.order.findMany({
            where: {
                userId,
                status: { in: QUALIFIED_STATUSES },
            },
            select: { items: true },
            take: 25,
        });

        return candidateOrders.some((order) => {
            const items = extractOrderItems(order.items);
            return items.some((item) => item.productId === productId);
        });
    }
}

export default OrderPurchaseHistoryAdapter;