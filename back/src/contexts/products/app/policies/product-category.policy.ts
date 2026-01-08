import { InvalidCategoryError } from '../../domain/errors/product.errors';
import { CategoryReadOnlyPort } from '../../../shared/ports/category-readonly.port';

// Valida que la categoría exista antes de ejecutar cada usecase (política de aplicación)
export class ProductCategoryPolicy {
    constructor(private readonly categoryRepo: CategoryReadOnlyPort) { }

    async ensureCategoryExists(categoryId: number | string): Promise<void> {
        if (categoryId === undefined || categoryId === null) throw new InvalidCategoryError('categoryId is required');
        const found = await this.categoryRepo.findById(categoryId);
        if (!found) throw new InvalidCategoryError(`Category not found: ${categoryId}`);
    }
}

export default ProductCategoryPolicy;

