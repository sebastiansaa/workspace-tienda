import { Inject, Injectable } from '@nestjs/common';
import StockServicePort from '../../app/ports/stock.service.port';
import type InventoryAvailabilityPort from '../../../shared/ports/inventory-availability.port';
import { INVENTORY_AVAILABILITY_PORT } from '../../../inventory/constants';

@Injectable()
export class InventoryStockAdapter implements StockServicePort {
    constructor(
        @Inject(INVENTORY_AVAILABILITY_PORT)
        private readonly inventoryAvailability: InventoryAvailabilityPort,
    ) { }

    async isAvailable(productId: number, quantity: number): Promise<boolean> {
        return this.inventoryAvailability.isAvailable(productId, quantity);
    }
}

export default InventoryStockAdapter;
