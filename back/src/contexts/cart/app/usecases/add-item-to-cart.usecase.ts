import { AddItemCommand } from '../commands/add-item.command';
import { ICartReadRepository } from '../ports/cart-read.repository';
import { ICartWriteRepository } from '../ports/cart-write.repository';
import PricingServicePort from '../ports/pricing-service.port';
import StockAvailabilityPort from '../ports/stock-availability.port';
import CartItemEntity from '../../domain/entity/cart-item.entity';
import { CartEntity } from '../../domain/entity/cart.entity';
import { InvalidProductError, InsufficientStockError } from '../../domain/errors/cart.errors';

export class AddItemToCartUseCase {
    constructor(
        private readonly cartReadRepo: ICartReadRepository,
        private readonly cartWriteRepo: ICartWriteRepository,
        private readonly pricing: PricingServicePort,
        private readonly stock: StockAvailabilityPort,
    ) { }

    async execute(cmd: AddItemCommand): Promise<CartEntity> {
        const price = await this.pricing.getPrice(cmd.productId);
        if (price === null) throw new InvalidProductError();

        const isAvailable = await this.stock.isAvailable(cmd.productId, cmd.quantity);
        if (!isAvailable) throw new InsufficientStockError();

        const existingCart = await this.cartReadRepo.findByUserId(cmd.userId);
        const cart = existingCart ?? CartEntity.create({ userId: cmd.userId, items: [] });

        const item = CartItemEntity.create({ productId: cmd.productId, quantity: cmd.quantity, price });
        cart.addItem(item);

        return this.cartWriteRepo.save(cart);
    }
}

export default AddItemToCartUseCase;
