import { Prisma } from '@prisma/client';
import { ProductEntity } from '../../domain/entity';
import { decimalToString } from './decimal.helper';

/* Construye un objeto compatibe con Prisma unchecked create input.
 * Usamos UncheckedCreate para poder asignar `categoryId` directamente.
 */
export function buildProductCreateInput(entity: ProductEntity): Prisma.ProductUncheckedCreateInput {
    return {
        // id left undefined so DB can autoincrement
        title: entity.title,
        slug: entity.slug,
        price: decimalToString(entity.price),
        description: entity.description,
        stock: entity.stock,
        active: entity.active,
        images: entity.images,
        categoryId: entity.categoryId,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        deletedAt: entity.deletedAt ?? null,
    };
}

/* Construye un objeto compatible con Prisma unchecked update input.
 * Usamos campos directos o wrappers según lo permita el tipo unchecked. */
export function buildProductUpdateInput(entity: ProductEntity): Prisma.ProductUncheckedUpdateInput {
    return {
        title: entity.title,
        slug: entity.slug,
        price: decimalToString(entity.price),
        description: entity.description,
        stock: entity.stock,
        active: entity.active,
        images: entity.images,
        categoryId: entity.categoryId,
        deletedAt: entity.deletedAt ?? null,
        updatedAt: entity.updatedAt,
    };
}

export default {
    buildProductCreateInput,
    buildProductUpdateInput,
};
