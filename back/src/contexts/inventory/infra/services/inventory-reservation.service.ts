import { Injectable } from '@nestjs/common';
import type InventoryReservationPort from '../../../shared/ports/inventory-reservation.port';
import ReserveStockCommand from '../../app/commands/reserve-stock.command';
import { ReserveStockUsecase } from '../../app/usecases';

@Injectable()
export class InventoryReservationService implements InventoryReservationPort {
    constructor(
        private readonly reserveStockUsecase: ReserveStockUsecase,
    ) { }

    async reserve(productId: number, quantity: number, reason: string): Promise<void> {
        const command = new ReserveStockCommand(productId, quantity, reason);
        await this.reserveStockUsecase.execute(command);
    }
}

export default InventoryReservationService;