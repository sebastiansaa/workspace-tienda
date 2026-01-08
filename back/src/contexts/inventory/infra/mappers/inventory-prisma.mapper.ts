import type { InventoryItem, StockMovement, Prisma } from '@prisma/client';
import { InventoryItemEntity } from '../../domain/entity/inventory-item.entity';
import { StockMovementEntity } from '../../domain/entity/stock-movement.entity';
import { MovementType } from '../../domain/v-o/movement-type.vo';

export const prismaToInventoryItem = (record: InventoryItem | null): InventoryItemEntity | null => {
    if (!record) return null;
    return new InventoryItemEntity({
        id: record.id,
        productId: record.productId,
        onHand: record.onHand,
        reserved: record.reserved,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
    });
};

export const inventoryItemToPrisma = (entity: InventoryItemEntity): Prisma.InventoryItemUncheckedCreateInput => ({
    id: entity.id,
    productId: entity.productId,
    onHand: entity.onHand,
    reserved: entity.reserved,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
});

export const prismaToMovement = (record: StockMovement): StockMovementEntity => new StockMovementEntity({
    id: record.id,
    inventoryItemId: record.inventoryItemId,
    productId: record.productId,
    type: record.type as MovementType,
    reason: record.reason,
    quantity: record.quantity,
    onHandAfter: record.onHandAfter,
    reservedAfter: record.reservedAfter,
    createdAt: record.createdAt,
});

export const movementToPrisma = (movement: StockMovementEntity): Prisma.StockMovementUncheckedCreateInput => ({
    id: movement.id,
    inventoryItemId: movement.inventoryItemId,
    productId: movement.productId,
    type: movement.type,
    reason: movement.reason,
    quantity: movement.quantity,
    onHandAfter: movement.onHandAfter,
    reservedAfter: movement.reservedAfter,
    createdAt: movement.createdAt,
});
