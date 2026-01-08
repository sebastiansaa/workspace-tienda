import { UpdateItemQuantityCommand } from '../commands/update-item.command';
import { ICartReadRepository } from '../ports/cart-read.repository';
import { ICartWriteRepository } from '../ports/cart-write.repository';
import PricingServicePort from '../ports/pricing-service.port';
import { InvalidProductError, CartNotFoundError } from '../../domain/errors/cart.errors';
import CartItemEntity from '../../domain/entity/cart-item.entity';
import { CartEntity } from '../../domain/entity/cart.entity';

export class UpdateItemQuantityUseCase {
    constructor(
        private readonly cartReadRepo: ICartReadRepository,
        private readonly cartWriteRepo: ICartWriteRepository,
        private readonly pricing: PricingServicePort
    ) { }

    async execute(cmd: UpdateItemQuantityCommand): Promise<CartEntity> {
        const cart = await this.cartReadRepo.findByUserId(cmd.userId);
        if (!cart) throw new CartNotFoundError();

        const price = await this.pricing.getPrice(cmd.productId);
        if (price === null) throw new InvalidProductError();

        cart.updateQuantity(cmd.productId, cmd.quantity);
        cart.repriceItem(cmd.productId, price);
        return this.cartWriteRepo.save(cart);
    }
}

export default UpdateItemQuantityUseCase;
