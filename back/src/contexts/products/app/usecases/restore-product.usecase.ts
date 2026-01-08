import { RestoreProductCommand } from '../commands/restore-product.command';
import { IProductWriteRepository } from '../ports/product-write.repository';
import { IProductReadRepository } from '../ports/product-read.repository';
import { ProductCategoryPolicy } from '../policies/product-category.policy';
import { ProductEntity } from '../../domain/entity/product.entity';

//usa ambos ports para leer y escribir
export class RestoreProductUsecase {
    constructor(
        private readonly readRepo: IProductReadRepository,
        private readonly writeRepo: IProductWriteRepository,
        private readonly categoryService?: ProductCategoryPolicy
    ) { }

    async execute(cmd: RestoreProductCommand): Promise<ProductEntity> {
        // 1. Leer el producto antes de restaurarlo
        const existing = await this.readRepo.findById(cmd.id);
        if (!existing) throw new Error(`Product not found: ${cmd.id}`);

        // 2. Validar categoría
        if (this.categoryService) {
            await this.categoryService.ensureCategoryExists(existing.categoryId);
        }

        // 3. Restaurar usando el write repo
        return this.writeRepo.restoreById(cmd.id);
    }
}