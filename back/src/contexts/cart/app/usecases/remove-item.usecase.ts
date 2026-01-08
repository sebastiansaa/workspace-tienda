import { RemoveItemCommand } from '../commands/remove-item.command';
import { ICartReadRepository } from '../ports/cart-read.repository';
import { ICartWriteRepository } from '../ports/cart-write.repository';
import { CartNotFoundError } from '../../domain/errors/cart.errors';
import { CartEntity } from '../../domain/entity/cart.entity';

export class RemoveItemUseCase {
    constructor(
        private readonly cartReadRepo: ICartReadRepository,
        private readonly cartWriteRepo: ICartWriteRepository,
    ) { }

    async execute(cmd: RemoveItemCommand): Promise<CartEntity> {
        const cart = await this.cartReadRepo.findByUserId(cmd.userId);
        if (!cart) throw new CartNotFoundError();

        cart.removeItem(cmd.productId);
        return this.cartWriteRepo.save(cart);
    }
}

export default RemoveItemUseCase;
