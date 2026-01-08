import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { inventoryItemToPrisma, movementToPrisma, prismaToInventoryItem } from '../mappers/inventory-prisma.mapper';
import { IInventoryWriteRepository } from '../../app/ports/inventory-write.repository';
import { InventoryItemEntity } from '../../domain/entity/inventory-item.entity';
import { StockMovementEntity } from '../../domain/entity/stock-movement.entity';

@Injectable()
export class InventoryPrismaWriteRepository implements IInventoryWriteRepository {
    constructor(private readonly prisma: PrismaService) { }

    async save(item: InventoryItemEntity): Promise<InventoryItemEntity> {
        const data = inventoryItemToPrisma(item);
        const upserted = await this.prisma.inventoryItem.upsert({
            where: { productId: data.productId },
            create: data,
            update: { ...data, updatedAt: new Date() },
        });
        return prismaToInventoryItem(upserted)!;
    }

    async addMovement(movement: StockMovementEntity): Promise<void> {
        const data = movementToPrisma(movement);
        await this.prisma.stockMovement.create({ data });
    }
}
