import { AddItemDto, UpdateItemDto } from '../dtos/request';
import { CartResponseDto, CartItemResponseDto } from '../dtos/response';
import { AddItemCommand } from '../../app/commands/add-item.command';
import { UpdateItemQuantityCommand } from '../../app/commands/update-item.command';
import { RemoveItemCommand } from '../../app/commands/remove-item.command';
import { ClearCartCommand } from '../../app/commands/clear-cart.command';
import { GetCartQuery } from '../../app/queries/get-cart.query';
import { CartEntity } from '../../domain/entity/cart.entity';

export class CartApiMapper {
    static toAddCommand(userId: string, dto: AddItemDto): AddItemCommand {
        return new AddItemCommand(userId, dto.productId, dto.quantity);
    }

    static toUpdateCommand(userId: string, productId: number, dto: UpdateItemDto): UpdateItemQuantityCommand {
        return new UpdateItemQuantityCommand(userId, productId, dto.quantity);
    }

    static toRemoveCommand(userId: string, productId: number): RemoveItemCommand {
        return new RemoveItemCommand(userId, productId);
    }

    static toClearCommand(userId: string): ClearCartCommand {
        return new ClearCartCommand(userId);
    }

    static toGetQuery(userId: string): GetCartQuery {
        return new GetCartQuery(userId);
    }

    static toResponse(cart: CartEntity): CartResponseDto {
        return {
            id: cart.id,
            userId: cart.userId,
            items: cart.items.map(this.toItemResponse),
            total: cart.calculateTotal(),
            createdAt: cart.createdAt.toISOString(),
            updatedAt: cart.updatedAt.toISOString(),
        };
    }

    private static toItemResponse(item: CartEntity['items'][number]): CartItemResponseDto {
        return {
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            lineTotal: item.lineTotal,
        };
    }
}

export default CartApiMapper;
