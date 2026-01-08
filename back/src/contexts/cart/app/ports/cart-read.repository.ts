import { CartEntity } from '../../domain/entity/cart.entity';

export interface ICartReadRepository {
    findByUserId(userId: string): Promise<CartEntity | null>;
}
