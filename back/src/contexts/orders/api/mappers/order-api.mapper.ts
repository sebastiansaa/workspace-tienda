import { CreateOrderFromItemsDto } from '../dtos/request/create-order-from-items.dto';
import { OrderResponseDto } from '../dtos/response/order.response.dto';
import { OrderItemResponseDto } from '../dtos/response/order-item.response.dto';
import CreateOrderFromCartCommand from '../../app/commands/create-order-from-cart.command';
import CreateOrderFromItemsCommand from '../../app/commands/create-order-from-items.command';
import { OrderEntity } from '../../domain/entity/order.entity';

export class OrderApiMapper {
    static toCreateFromCartCommand(userId: string): CreateOrderFromCartCommand {
        return new CreateOrderFromCartCommand(userId);
    }

    static toCreateFromItemsCommand(userId: string, dto: CreateOrderFromItemsDto): CreateOrderFromItemsCommand {
        return new CreateOrderFromItemsCommand(userId, dto.items);
    }

    static toResponse(entity: OrderEntity): OrderResponseDto {
        return {
            id: entity.id,
            userId: entity.userId,
            status: entity.status,
            totalAmount: entity.totalAmount,
            items: entity.items.map((item) => this.toItemResponse(item)),
            createdAt: entity.createdAt.toISOString(),
            updatedAt: entity.updatedAt.toISOString(),
        };
    }

    private static toItemResponse(item: OrderEntity['items'][number]): OrderItemResponseDto {
        return {
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            lineTotal: item.lineTotal,
        };
    }
}

export default OrderApiMapper;
