import { InventoryItemEntity } from '../../domain/entity/inventory-item.entity';
import { StockMovementEntity } from '../../domain/entity/stock-movement.entity';

export interface IInventoryWriteRepository {
    save(item: InventoryItemEntity): Promise<InventoryItemEntity>;
    addMovement(movement: StockMovementEntity): Promise<void>;
}

export default IInventoryWriteRepository;
