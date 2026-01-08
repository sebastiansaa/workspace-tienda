import { Inject, Injectable } from '@nestjs/common';
import ReserveStockPort from '../../app/ports/reserve-stock.port';
import { INVENTORY_RESERVATION_PORT } from '../../../inventory/constants';
import type InventoryReservationPort from '../../../shared/ports/inventory-reservation.port';

@Injectable()
export class ReserveStockAdapter implements ReserveStockPort {
    constructor(
        @Inject(INVENTORY_RESERVATION_PORT)
        private readonly inventoryReservation: InventoryReservationPort,
    ) { }

    async reserve(productId: number, quantity: number, reason: string): Promise<void> {
        await this.inventoryReservation.reserve(productId, quantity, reason);
    }
}

export default ReserveStockAdapter;
