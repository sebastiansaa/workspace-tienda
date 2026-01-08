import { OrderEntity } from '../../domain/entity/order.entity';
import { OrderItemProps } from '../../domain/entity/order-item.entity';
import { EmptyOrderError, ProductUnavailableError } from '../../domain/errors/order.errors';
import CreateOrderFromCartCommand from '../commands/create-order-from-cart.command';
import { IOrderWriteRepository } from '../ports/order-write.repository';
import CartReadOnlyPort from '../ports/cart-read.port';
import ProductReadOnlyPort from '../ports/product-read.port';
import PricingServicePort from '../ports/pricing.service.port';
import StockServicePort from '../ports/stock.service.port';
import ReserveStockPort from '../ports/reserve-stock.port';

export class CreateOrderFromCartUsecase {
    constructor(
        private readonly orderWriteRepo: IOrderWriteRepository,
        private readonly cartRead: CartReadOnlyPort,
        private readonly productRead: ProductReadOnlyPort,
        private readonly pricing: PricingServicePort,
        private readonly stock: StockServicePort,
        private readonly reserveStock: ReserveStockPort,
    ) { }

    async execute(cmd: CreateOrderFromCartCommand): Promise<OrderEntity> {
        const cartItems = await this.cartRead.getCartItems(cmd.userId);
        if (!cartItems || cartItems.length === 0) throw new EmptyOrderError();

        const items: OrderItemProps[] = [];
        for (const cartItem of cartItems) {
            const item = await this.buildItem(cartItem.productId, cartItem.quantity, cartItem.price);
            items.push(item);
        }

        const order = OrderEntity.create({ userId: cmd.userId, items, status: 'PENDING' });
        const savedOrder = await this.orderWriteRepo.save(order);

        // Reserve stock for all items after order creation
        for (const item of items) {
            await this.reserveStock.reserve(
                item.productId,
                item.quantity,
                `Order ${savedOrder.id} created`,
            );
        }

        return savedOrder;
    }

    private async buildItem(productId: number, quantity: number, snapshotPrice?: number): Promise<OrderItemProps> {
        const product = await this.productRead.findById(productId);
        if (!product) throw new ProductUnavailableError('Product not found');

        const isStockAvailable = await this.stock.isAvailable(productId, quantity);
        if (!isStockAvailable) throw new ProductUnavailableError('Insufficient stock');

        const price = (await this.pricing.getPrice(productId))
            ?? snapshotPrice
            ?? product.price;

        return { productId, quantity, price };
    }
}

export default CreateOrderFromCartUsecase;
