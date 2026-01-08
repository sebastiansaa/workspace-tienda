import { SaveProductCommand } from '../commands/save-product.command';
import { IProductReadRepository } from '../ports/product-read.repository';
import { IProductWriteRepository } from '../ports/product-write.repository';
import { ProductEntity } from '../../domain/entity/product.entity';
import { ProductProps } from '../../domain/entity/productPropInterface';
import { ProductCategoryPolicy } from '../policies/product-category.policy';

export class SaveProductUsecase {
    constructor(
        private readonly readRepo: IProductReadRepository,
        private readonly writeRepo: IProductWriteRepository,
        private readonly categoryService: ProductCategoryPolicy
    ) { }

    async execute(cmd: SaveProductCommand): Promise<ProductEntity> {
        const payload: Readonly<Partial<ProductProps>> = cmd.payload;

        if (typeof payload.id === 'number') {
            const existing = await this.readRepo.findById(payload.id);
            if (!existing) throw new Error(`Product ${payload.id} not found`);

            if (payload.title !== undefined) existing.rename(payload.title);
            if (payload.price !== undefined) existing.changePrice(payload.price);
            if (payload.slug !== undefined) existing.changeSlug(payload.slug);
            if (payload.description !== undefined) existing.changeDescription(payload.description);
            if (payload.images !== undefined) existing.replaceImages(payload.images);
            if (payload.stock !== undefined) existing.setStock(payload.stock);

            if (payload.active !== undefined) {
                if (payload.active && !existing.active) existing.restore();
                if (!payload.active && existing.active) existing.remove();
            }

            return this.writeRepo.save(existing);
        }

        if (payload.title === undefined) throw new Error('Missing required field: title');
        if (payload.slug === undefined) throw new Error('Missing required field: slug');
        if (payload.price === undefined) throw new Error('Missing required field: price');
        if (payload.images === undefined) throw new Error('Missing required field: images');
        if (payload.categoryId === undefined) throw new Error('Missing required field: categoryId');

        if (this.categoryService) {
            await this.categoryService.ensureCategoryExists(payload.categoryId);
        } else {
            // Definición de arquitectura: la validación de categoría es obligatoria.
            // Si no hay servicio, lanzamos error (o deberíamos inyectarlo obligatoriamente).
            throw new Error('Category service not available for validation');
        }

        const entity = ProductEntity.create({
            id: payload.id,
            title: payload.title,
            slug: payload.slug,
            price: payload.price,
            description: payload.description ?? '',
            stock: payload.stock ?? 0,
            active: payload.active ?? true,
            images: payload.images,
            categoryId: payload.categoryId,
            deletedAt: payload.deletedAt ?? undefined,
        });

        return this.writeRepo.save(entity);
    }
}