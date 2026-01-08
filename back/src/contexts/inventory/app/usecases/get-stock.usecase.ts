import GetStockQuery from '../queries/get-stock.query';
import { IInventoryReadRepository } from '../ports/inventory-read.repository';
import { InventoryItemEntity } from '../../domain/entity/inventory-item.entity';

export class GetStockUsecase {
    constructor(private readonly inventoryReadRepo: IInventoryReadRepository) { }

    async execute(query: GetStockQuery): Promise<InventoryItemEntity | null> {
        return this.inventoryReadRepo.findByProductId(query.productId);
    }
}

export default GetStockUsecase;
