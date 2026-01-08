import { Injectable } from '@nestjs/common';
import { InventoryAdminPort } from '../../../shared/ports/admin/inventory-admin.port';
import {
    IncreaseStockUsecase,
    DecreaseStockUsecase,
    ReserveStockUsecase,
    ReleaseStockUsecase,
    ListMovementsUsecase,
} from '../../app/usecases/index';
import { InventoryApiMapper } from '../../api/mappers/inventory-api.mapper';
import type { StockResponseDto } from '../../api/dtos/response/stock.response.dto';
import type { StockMovementResponseDto } from '../../api/dtos/response/stock-movement.response.dto';

@Injectable()
export class InventoryAdminAdapter implements InventoryAdminPort {
    constructor(
        private readonly increaseStock: IncreaseStockUsecase,
        private readonly decreaseStock: DecreaseStockUsecase,
        private readonly reserveStock: ReserveStockUsecase,
        private readonly releaseStock: ReleaseStockUsecase,
        private readonly listMovementsUsecase: ListMovementsUsecase,
    ) { }

    async increase(productId: number, quantity: number): Promise<StockResponseDto> {
        const item = await this.increaseStock.execute({ productId, quantity, reason: 'ADMIN_ADJUSTMENT' });
        return InventoryApiMapper.toStockResponseDto(item);
    }

    async decrease(productId: number, quantity: number): Promise<StockResponseDto> {
        const item = await this.decreaseStock.execute({ productId, quantity, reason: 'ADMIN_ADJUSTMENT' });
        return InventoryApiMapper.toStockResponseDto(item);
    }

    async reserve(productId: number, quantity: number): Promise<StockResponseDto> {
        const item = await this.reserveStock.execute({ productId, quantity, reason: 'ADMIN_RESERVATION' });
        return InventoryApiMapper.toStockResponseDto(item);
    }

    async release(productId: number, quantity: number): Promise<StockResponseDto> {
        const item = await this.releaseStock.execute({ productId, quantity, reason: 'ADMIN_RELEASE' });
        return InventoryApiMapper.toStockResponseDto(item);
    }

    async listMovements(productId: number): Promise<StockMovementResponseDto[]> {
        const movements = await this.listMovementsUsecase.execute({ productId });
        return InventoryApiMapper.toMovementResponseDtoList(movements);
    }
}
