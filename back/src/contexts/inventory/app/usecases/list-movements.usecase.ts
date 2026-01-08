import ListMovementsQuery from '../queries/list-movements.query';
import { IInventoryReadRepository } from '../ports/inventory-read.repository';
import { StockMovementEntity } from '../../domain/entity/stock-movement.entity';

export class ListMovementsUsecase {
    constructor(private readonly inventoryReadRepo: IInventoryReadRepository) { }

    async execute(query: ListMovementsQuery): Promise<StockMovementEntity[]> {
        return this.inventoryReadRepo.listMovements(query.productId);
    }
}

export default ListMovementsUsecase;
