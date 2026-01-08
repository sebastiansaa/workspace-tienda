import { InventoryItemEntity } from '../../domain/entity/inventory-item.entity';
import { InsufficientStockError } from '../../domain/errors/inventory.errors';
import IncreaseStockCommand from '../commands/increase-stock.command';
import { IInventoryReadRepository } from '../ports/inventory-read.repository';
import { IInventoryWriteRepository } from '../ports/inventory-write.repository';
import ProductReadOnlyPort from '../ports/product-read.port';

export class IncreaseStockUsecase {
    constructor(
        private readonly inventoryReadRepo: IInventoryReadRepository,
        private readonly inventoryWriteRepo: IInventoryWriteRepository,
        private readonly productRead: ProductReadOnlyPort,
    ) { }

    async execute(cmd: IncreaseStockCommand): Promise<InventoryItemEntity> {
        const product = await this.productRead.findById(cmd.productId);
        if (!product) throw new InsufficientStockError('Product not found');

        const existing = await this.inventoryReadRepo.findByProductId(cmd.productId);
        const item = existing ?? new InventoryItemEntity({ productId: cmd.productId, onHand: 0, reserved: 0 });

        const movement = item.increase(cmd.quantity, cmd.reason);
        const saved = await this.inventoryWriteRepo.save(item);
        await this.inventoryWriteRepo.addMovement(movement);
        return saved;
    }
}

export default IncreaseStockUsecase;
