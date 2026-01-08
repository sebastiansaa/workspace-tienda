import { AdjustStockDto, StockResponseDto, StockMovementResponseDto } from '../dtos';
import IncreaseStockCommand from '../../app/commands/increase-stock.command';
import DecreaseStockCommand from '../../app/commands/decrease-stock.command';
import ReserveStockCommand from '../../app/commands/reserve-stock.command';
import ReleaseStockCommand from '../../app/commands/release-stock.command';
import GetStockQuery from '../../app/queries/get-stock.query';
import ListMovementsQuery from '../../app/queries/list-movements.query';
import { InventoryItemEntity } from '../../domain/entity/inventory-item.entity';
import { StockMovementEntity } from '../../domain/entity/stock-movement.entity';

export class InventoryApiMapper {
    static toIncreaseStockCommand(productId: number, dto: AdjustStockDto): IncreaseStockCommand {
        return new IncreaseStockCommand(productId, dto.quantity, dto.reason);
    }

    static toDecreaseStockCommand(productId: number, dto: AdjustStockDto): DecreaseStockCommand {
        return new DecreaseStockCommand(productId, dto.quantity, dto.reason);
    }

    static toReserveStockCommand(productId: number, dto: AdjustStockDto): ReserveStockCommand {
        return new ReserveStockCommand(productId, dto.quantity, dto.reason);
    }

    static toReleaseStockCommand(productId: number, dto: AdjustStockDto): ReleaseStockCommand {
        return new ReleaseStockCommand(productId, dto.quantity, dto.reason);
    }

    static toGetStockQuery(productId: number): GetStockQuery {
        return new GetStockQuery(productId);
    }

    static toListMovementsQuery(productId: number): ListMovementsQuery {
        return new ListMovementsQuery(productId);
    }

    static toStockResponseDto(entity: InventoryItemEntity): StockResponseDto {
        return {
            productId: entity.productId,
            onHand: entity.onHand,
            reserved: entity.reserved,
            available: entity.available,
        };
    }

    static toMovementResponseDto(movement: StockMovementEntity): StockMovementResponseDto {
        return {
            id: movement.id,
            productId: movement.productId,
            type: movement.type,
            reason: movement.reason,
            quantity: movement.quantity,
            onHandAfter: movement.onHandAfter,
            reservedAfter: movement.reservedAfter,
            createdAt: movement.createdAt.toISOString(),
        };
    }

    static toMovementResponseDtoList(movements: StockMovementEntity[]): StockMovementResponseDto[] {
        return movements.map(this.toMovementResponseDto);
    }
}

export default InventoryApiMapper;
