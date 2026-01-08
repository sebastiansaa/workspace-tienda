import { ClearCartCommand } from '../commands/clear-cart.command';
import { ICartWriteRepository } from '../ports/cart-write.repository';

export class ClearCartUseCase {
    constructor(private readonly cartWriteRepo: ICartWriteRepository) { }

    async execute(cmd: ClearCartCommand): Promise<void> {
        await this.cartWriteRepo.clear(cmd.userId);
    }
}

export default ClearCartUseCase;
