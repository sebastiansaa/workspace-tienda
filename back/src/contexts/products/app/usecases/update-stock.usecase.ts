import { UpdateStockCommand } from '../commands/update-stock.command';
import { IProductWriteRepository } from '../ports/product-write.repository';

export class UpdateStockUsecase {
    constructor(private readonly repo: IProductWriteRepository) { }

    async execute(cmd: UpdateStockCommand): Promise<import('../../domain/entity/product.entity').ProductEntity> {
        // repository devuelve la entidad actualizada
        return this.repo.updateStock(cmd.id, cmd.quantity);
    }
}
