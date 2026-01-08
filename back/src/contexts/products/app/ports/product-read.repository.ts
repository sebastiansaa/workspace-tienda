import { ProductEntity } from '../../domain/entity/product.entity';

// repositorio de solo lectura para productos
export interface IProductReadRepository {
    findById(id: number): Promise<ProductEntity | null>;
    findAll(params?: { page?: number; limit?: number; categoryId?: number }): Promise<{ products: ProductEntity[]; total: number }>;
    findLowStock(threshold: number): Promise<ProductEntity[]>;
    searchByName(name: string, params?: { page?: number; limit?: number }): Promise<{ products: ProductEntity[]; total: number }>;
}

export default IProductReadRepository;
