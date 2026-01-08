import { InventoryItemEntity } from '../../domain/entity/inventory-item.entity';
import { InsufficientStockError } from '../../domain/errors/inventory.errors';
import DecreaseStockCommand from '../commands/decrease-stock.command';
import { IInventoryReadRepository } from '../ports/inventory-read.repository';
import { IInventoryWriteRepository } from '../ports/inventory-write.repository';
import ProductReadOnlyPort from '../ports/product-read.port';

export class DecreaseStockUsecase {
    constructor(
        private readonly inventoryReadRepo: IInventoryReadRepository,
        private readonly inventoryWriteRepo: IInventoryWriteRepository,
        private readonly productRead: ProductReadOnlyPort,
    ) { }

    async execute(cmd: DecreaseStockCommand): Promise<InventoryItemEntity> {
        const product = await this.productRead.findById(cmd.productId);
        if (!product) throw new InsufficientStockError('Product not found');

        const existing = await this.inventoryReadRepo.findByProductId(cmd.productId);
        if (!existing) throw new InsufficientStockError();

        const movement = existing.decrease(cmd.quantity, cmd.reason);
        const saved = await this.inventoryWriteRepo.save(existing);
        await this.inventoryWriteRepo.addMovement(movement);
        return saved;
    }
}

export default DecreaseStockUsecase;
