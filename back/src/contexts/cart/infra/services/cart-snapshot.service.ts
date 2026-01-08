import { Inject, Injectable } from '@nestjs/common';
import { CART_READ_REPOSITORY } from '../../constants';
import type { ICartReadRepository } from '../../app/ports/cart-read.repository';
import type CartSnapshotPort from '../../../shared/ports/cart-snapshot.port';

@Injectable()
export class CartSnapshotService implements CartSnapshotPort {
    constructor(
        @Inject(CART_READ_REPOSITORY)
        private readonly cartReadRepo: ICartReadRepository,
    ) { }

    async getCartItems(userId: string) {
        const cart = await this.cartReadRepo.findByUserId(userId);
        if (!cart) return [];
        return cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
        }));
    }
}

export default CartSnapshotService;