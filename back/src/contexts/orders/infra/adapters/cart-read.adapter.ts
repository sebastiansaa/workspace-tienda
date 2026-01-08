import { Inject, Injectable } from '@nestjs/common';
import { CART_SNAPSHOT_PORT } from '../../../cart/constants';
import type CartSnapshotPort from '../../../shared/ports/cart-snapshot.port';
import CartReadOnlyPort, { CartItemSnapshot } from '../../app/ports/cart-read.port';

@Injectable()
export class CartReadOnlyAdapter implements CartReadOnlyPort {
    constructor(
        @Inject(CART_SNAPSHOT_PORT)
        private readonly cartSnapshot: CartSnapshotPort,
    ) { }

    async getCartItems(userId: string): Promise<CartItemSnapshot[]> {
        const items = await this.cartSnapshot.getCartItems(userId);
        return items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price ?? undefined,
        }));
    }
}

export default CartReadOnlyAdapter;
