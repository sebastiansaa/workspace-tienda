import type { Prisma, Cart } from '@prisma/client';
import { CartEntity } from '../../domain/entity/cart.entity';
import type { CartItemProps } from '../../domain/entity/cart-item.entity';

const mapItemsFromJson = (items: Prisma.JsonValue): CartItemProps[] => {
    if (!Array.isArray(items)) throw new Error('Items de carrito corruptos');
    return items.map((raw) => {
        if (!raw || typeof raw !== 'object') throw new Error('Item de carrito inválido');
        const obj = raw as Record<string, unknown>;
        const productId = Number(obj.productId);
        const quantity = Number(obj.quantity);
        const price = Number(obj.price);
        if (!Number.isFinite(productId) || productId <= 0) throw new Error('ProductId inválido');
        if (!Number.isFinite(quantity) || quantity <= 0) throw new Error('Cantidad inválida');
        if (!Number.isFinite(price) || price < 0) throw new Error('Precio inválido');
        return { productId, quantity, price };
    });
};

export const prismaToCartEntity = (record: Cart | null): CartEntity | null => {
    if (!record) return null;
    return CartEntity.rehydrate({
        id: record.id,
        userId: record.userId,
        items: mapItemsFromJson(record.items),
    });
};

export const cartToPrisma = (cart: CartEntity): Prisma.CartUncheckedCreateInput => ({
    id: cart.id,
    userId: cart.userId,
    items: cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
    })) as Prisma.InputJsonValue,
});
