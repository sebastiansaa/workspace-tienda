import type { StockResponseDto } from '../../../inventory/api/dtos/response/stock.response.dto';
import type { StockMovementResponseDto } from '../../../inventory/api/dtos/response/stock-movement.response.dto';

export interface InventoryAdminPort {
    increase(productId: number, quantity: number): Promise<StockResponseDto>;
    decrease(productId: number, quantity: number): Promise<StockResponseDto>;
    reserve(productId: number, quantity: number): Promise<StockResponseDto>;
    release(productId: number, quantity: number): Promise<StockResponseDto>;
    listMovements(productId: number): Promise<StockMovementResponseDto[]>;
}
