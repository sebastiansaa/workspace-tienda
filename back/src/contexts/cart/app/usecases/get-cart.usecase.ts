import { GetCartQuery } from '../queries/get-cart.query';
import { ICartReadRepository } from '../ports/cart-read.repository';
import { CartEntity } from '../../domain/entity/cart.entity';

export class GetCartUseCase {
    constructor(private readonly cartReadRepo: ICartReadRepository) { }

    async execute(query: GetCartQuery): Promise<CartEntity | null> {
        return this.cartReadRepo.findByUserId(query.userId);
    }
}

export default GetCartUseCase;
