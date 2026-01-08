import type { Prisma, Order as PrismaOrder } from '@prisma/client';
import { OrderEntity } from '../../domain/entity/order.entity';
import type { OrderItemProps } from '../../domain/entity/order-item.entity';
import type { OrderStatusType } from '../../domain/v-o/order-status.vo';

const mapItemsFromJson = (items: Prisma.JsonValue): OrderItemProps[] => {
    if (!Array.isArray(items)) return [];
    return items.map((raw) => {
        if (!raw || typeof raw !== 'object') return { productId: 0, quantity: 0, price: 0 };
        const obj = raw as Record<string, unknown>;
        const productId = Number(obj.productId);
        const quantity = Number(obj.quantity);
        const price = obj.price === undefined || obj.price === null ? 0 : Number(obj.price);
        return { productId, quantity, price };
    });
};

export const orderPrismaToDomain = (record: PrismaOrder | null): OrderEntity | null => {
    if (!record) return null;
    return OrderEntity.rehydrate({
        id: record.id,
        userId: record.userId,
        status: record.status as OrderStatusType,
        items: mapItemsFromJson(record.items),
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
    });
};

export const orderDomainToPrisma = (order: OrderEntity): Prisma.OrderUncheckedCreateInput => ({
    id: order.id,
    userId: order.userId,
    status: order.status,
    totalAmount: order.totalAmount,
    items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
    })) as Prisma.InputJsonValue,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
});
