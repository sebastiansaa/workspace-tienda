import { Inject, Injectable } from '@nestjs/common';
import { INVENTORY_AVAILABILITY_PORT } from '../../../inventory/constants';
import type InventoryAvailabilityPort from '../../../shared/ports/inventory-availability.port';
import StockAvailabilityPort from '../../app/ports/stock-availability.port';

@Injectable()
export class CartStockService implements StockAvailabilityPort {
    constructor(
        @Inject(INVENTORY_AVAILABILITY_PORT)
        private readonly inventoryAvailability: InventoryAvailabilityPort,
    ) { }

    async isAvailable(productId: number, quantity: number): Promise<boolean> {
        return this.inventoryAvailability.isAvailable(productId, quantity);
    }
}

export default CartStockService;
