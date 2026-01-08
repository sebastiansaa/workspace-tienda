import { CartEntity } from '../../domain/entity/cart.entity';

export interface ICartWriteRepository {
    save(cart: CartEntity): Promise<CartEntity>;
    clear(userId: string): Promise<void>;
}
