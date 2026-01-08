import { Inject, Injectable } from '@nestjs/common';
import { INVENTORY_READ_REPOSITORY } from '../../constants';
import type { IInventoryReadRepository } from '../../app/ports/inventory-read.repository';
import type InventoryAvailabilityPort from '../../../shared/ports/inventory-availability.port';

@Injectable()
export class InventoryAvailabilityService implements InventoryAvailabilityPort {
    constructor(
        @Inject(INVENTORY_READ_REPOSITORY)
        private readonly inventoryReadRepo: IInventoryReadRepository,
    ) { }

    async isAvailable(productId: number, quantity: number): Promise<boolean> {
        const inventoryItem = await this.inventoryReadRepo.findByProductId(productId);
        if (!inventoryItem) return false;
        return inventoryItem.available >= quantity;
    }
}

export default InventoryAvailabilityService;