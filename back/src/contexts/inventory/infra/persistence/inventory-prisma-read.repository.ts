import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { prismaToInventoryItem, prismaToMovement } from '../mappers/inventory-prisma.mapper';
import { IInventoryReadRepository } from '../../app/ports/inventory-read.repository';
import { InventoryItemEntity } from '../../domain/entity/inventory-item.entity';
import { StockMovementEntity } from '../../domain/entity/stock-movement.entity';

@Injectable()
export class InventoryPrismaReadRepository implements IInventoryReadRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByProductId(productId: number): Promise<InventoryItemEntity | null> {
        const record = await this.prisma.inventoryItem.findUnique({ where: { productId } });
        return prismaToInventoryItem(record);
    }

    async listMovements(productId: number): Promise<StockMovementEntity[]> {
        const records = await this.prisma.stockMovement.findMany({ where: { productId }, orderBy: { createdAt: 'desc' } });
        return records.map(prismaToMovement);
    }
}
