import { InventoryItemEntity } from '../../domain/entity/inventory-item.entity';
import { StockMovementEntity } from '../../domain/entity/stock-movement.entity';

export interface IInventoryReadRepository {
    findByProductId(productId: number): Promise<InventoryItemEntity | null>;
    listMovements(productId: number): Promise<StockMovementEntity[]>;
}

export default IInventoryReadRepository;
